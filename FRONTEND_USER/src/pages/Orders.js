import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getOrders,
  getOrderDetails,
  cancelOrder
} from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState({}); // order_id -> items[]

  // 🔹 Load orders
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await getOrders();

        if (res.data.status === "error") {
          toast.error(res.data.error || "Please login again");
          return;
        }

        setOrders(res.data.data || []);
      } catch {
        toast.error("Failed to load orders ❌");
      }
    };

    loadOrders();
  }, []);

  // 🔹 Load items for a specific order
  const loadOrderItems = async (orderId) => {
    // Toggle (collapse / expand)
    if (orderItems[orderId]) {
      setOrderItems(prev => {
        const copy = { ...prev };
        delete copy[orderId];
        return copy;
      });
      return;
    }

    try {
      const res = await getOrderDetails(orderId);

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      setOrderItems(prev => ({
        ...prev,
        [orderId]: res.data.data
      }));
    } catch {
      toast.error("Failed to load order details ❌");
    }
  };

  // 🔴 Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      const res = await cancelOrder(orderId);

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      toast.info("Order cancelled successfully 🛑");

      setOrders(prev =>
        prev.map(o =>
          o.order_id === orderId
            ? { ...o, status: "Cancelled" }
            : o
        )
      );
    } catch {
      toast.error("Failed to cancel order ❌");
    }
  };

  // 🎨 STATUS BADGE
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-warning text-dark";
      case "Confirmed":
        return "bg-primary";
      case "Shipped":
        return "bg-info text-dark";
      case "Delivered":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">

          <h4 className="mb-4 text-center text-md-start">
            📦 My Orders
          </h4>

          {orders.length === 0 && (
            <div className="text-center text-muted mt-5">
              You have not placed any orders yet 📦
            </div>
          )}

          {orders.map((order) => (
            <div
              key={order.order_id}
              className="card mb-3 shadow-sm"
            >
              {/* 🔹 HEADER */}
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">
                    Order #{order.order_id}
                  </div>
                  <small className="text-muted">
                    Total: ₹ {order.total_amount}
                  </small>
                </div>

                <span
                  className={`badge px-3 py-2 ${getStatusBadge(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* 🔹 ACTIONS */}
              <div className="card-body py-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => loadOrderItems(order.order_id)}
                >
                  {orderItems[order.order_id]
                    ? "Hide Items"
                    : "View Items"}
                </button>

                {/* 🔹 ORDER ITEMS */}
                {orderItems[order.order_id] &&
                  orderItems[order.order_id].map((item, idx) => (
                    <div
                      key={idx}
                      className="d-flex justify-content-between border-bottom py-2"
                    >
                      <div>
                        <b>{item.title}</b>{" "}
                        <span className="text-muted">
                          × {item.quantity}
                        </span>
                      </div>

                      <div className="fw-semibold">
                        ₹ {item.price * item.quantity}
                      </div>
                    </div>
                  ))}
              </div>

              {/* 🔹 CANCEL */}
              {order.status === "Pending" && (
                <div className="card-footer text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      handleCancelOrder(order.order_id)
                    }
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Orders;
