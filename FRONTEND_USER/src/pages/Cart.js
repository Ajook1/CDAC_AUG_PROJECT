import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCart,
  updateCartItem,
  deleteCartItem
} from "../services/api";

function Cart({ refreshCartCount }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // 🔹 Load cart items
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCart();

        if (res.data.status === "error") {
          toast.error(res.data.error || "Please login again");
          navigate("/login");
          return;
        }

        setItems(res.data.data || []);
      } catch {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    loadCart();
  }, [navigate]);

  // 🔄 Update quantity
  const updateQuantity = async (cartItemId, qty) => {
    if (qty < 1) {
      toast.warning("Minimum quantity is 1");
      return;
    }

    try {
      const res = await updateCartItem(cartItemId, { quantity: qty });

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      setItems(prev =>
        prev.map(i =>
          i.cart_item_id === cartItemId
            ? { ...i, quantity: qty }
            : i
        )
      );

      refreshCartCount();
      toast.success("Cart updated");
    } catch {
      toast.error("Failed to update cart");
    }
  };

  // ❌ Remove item
  const removeItem = async (cartItemId) => {
    try {
      const res = await deleteCartItem(cartItemId);

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      setItems(prev =>
        prev.filter(i => i.cart_item_id !== cartItemId)
      );

      refreshCartCount();
      toast.info("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  // 💰 Total calculation
  const total = items.reduce(
    (sum, i) => sum + i.price_at_addition * i.quantity,
    0
  );

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">

          <h3 className="mb-3 text-center text-md-start">
            🛒 My Cart
          </h3>

          {items.length === 0 ? (
            <div className="text-center text-muted mt-5">
              Your cart is empty 🛒
            </div>
          ) : (
            <>
              {/* 📦 CART TABLE */}
              <div className="card shadow-sm">
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0">
                    <thead className="table-dark text-center">
                      <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                        <th>Remove</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map(i => (
                        <tr key={i.cart_item_id}>
                          <td>
                            <b>{i.title}</b>
                          </td>

                          <td className="text-center">
                            ₹ {i.price_at_addition}
                          </td>

                          <td className="text-center">
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={i.quantity === 1}
                                onClick={() =>
                                  updateQuantity(i.cart_item_id, i.quantity - 1)
                                }
                              >
                                −
                              </button>

                              <span>{i.quantity}</span>

                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() =>
                                  updateQuantity(i.cart_item_id, i.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="text-center">
                            ₹ {i.price_at_addition * i.quantity}
                          </td>

                          <td className="text-center">
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeItem(i.cart_item_id)}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 🔹 TOTAL + ACTION */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
                <h5 className="mb-0">
                  Total: ₹ {total}
                </h5>

                <button
                  className="btn btn-success px-4"
                  style={{ minWidth: "220px" }}
                  onClick={() => navigate("/addresses?from=cart")}
                >
                  Proceed to Address
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Cart;
