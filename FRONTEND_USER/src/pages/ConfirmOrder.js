import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAddresses,
  getCart,
  placeOrder
} from "../services/api";

function ConfirmOrder() {
  const [address, setAddress] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const addressId = params.get("addressId");

  // 🔹 Load address + cart
  useEffect(() => {
    if (!addressId) {
      toast.error("Please select an address ❗");
      navigate("/addresses");
      return;
    }

    const loadData = async () => {
      try {
        // 📍 Addresses
        const addrRes = await getAddresses();
        if (addrRes.data.status === "error") {
          toast.error(addrRes.data.error);
          navigate("/login");
          return;
        }

        const selected = addrRes.data.data.find(
          a => String(a.address_id) === String(addressId)
        );

        if (!selected) {
          toast.error("Selected address not found ❌");
          navigate("/addresses");
          return;
        }

        setAddress(selected);

        // 🛒 Cart
        const cartRes = await getCart();
        if (cartRes.data.status === "error") {
          toast.error(cartRes.data.error);
          navigate("/cart");
          return;
        }

        if (cartRes.data.data.length === 0) {
          toast.error("Your cart is empty 🛒");
          navigate("/cart");
          return;
        }

        setCart(cartRes.data.data);

        const totalAmount = cartRes.data.data.reduce(
          (sum, item) =>
            sum + item.price_at_addition * item.quantity,
          0
        );

        setTotal(totalAmount);

      } catch {
        toast.error("Failed to load order details ❌");
        navigate("/cart");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [addressId, navigate]);

  // 🧾 PLACE ORDER
  const handlePlaceOrder = async () => {
    try {
      const res = await placeOrder({
        address_id: addressId
      });

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      toast.success("Order placed successfully 🎉");
      navigate("/orders");

    } catch {
      toast.error("Failed to place order ❌");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        Loading order details...
      </div>
    );
  }

  if (!address) return null;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <h3 className="mb-4 text-center text-md-start">
            ✅ Confirm Order
          </h3>

          {/* 📍 ADDRESS */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="mb-2">📍 Delivery Address</h5>
              <strong>{address.full_name}</strong>
              <div className="text-muted">📱 {address.phone}</div>
              <div className="text-muted">
                {address.address_line}, {address.city}
              </div>
              <div className="text-muted">
                {address.state} - {address.postal_code}
              </div>
              <div className="text-muted">{address.country}</div>
            </div>
          </div>

          {/* 🛒 ORDER SUMMARY */}
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h5 className="mb-3">🛒 Order Summary</h5>

              {cart.map((item) => (
                <div
                  key={item.cart_item_id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <div>
                    <b>{item.title}</b>
                    <div className="text-muted small">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  <div>
                    ₹ {item.price_at_addition * item.quantity}
                  </div>
                </div>
              ))}

              <hr />

              <div className="d-flex justify-content-between">
                <h6>Total</h6>
                <h6>₹ {total}</h6>
              </div>
            </div>
          </div>

          {/* 💰 PAYMENT */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5>💰 Payment Method</h5>
              <span className="badge bg-success">
                Cash on Delivery (COD)
              </span>
            </div>
          </div>

          {/* ✅ FINAL BUTTON */}
          <div className="text-center text-md-end">
            <button
              className="btn btn-success px-4"
              style={{ minWidth: "240px" }}
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ConfirmOrder;
