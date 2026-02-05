import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";
import OrderStatusTimeline from "../component/OrderStatusTimeline";

/* ================= CONSTANT ================= */
const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled"
];

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  /* ================= LOAD ORDERS ================= */
  const loadOrders = () => {
    adminApi.get("/orders").then(res => {
      if (res.data && res.data.data) {
        setOrders(res.data.data);
      }
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= LOAD ORDER DETAILS ================= */
  const viewOrderDetails = (orderId) => {
    adminApi.get(`/orders/${orderId}`).then(res => {
      if (res.data && res.data.data) {
        setOrderItems(res.data.data);
        setSelectedOrderId(orderId);
        setShowModal(true);
      }
    });
  };

  /* ================= UPDATE STATUS ================= */
  const updateStatus = (orderId, status) => {
    adminApi
      .put("/orders", {
        order_id: orderId,
        status: status
      })
      .then(() => {
        // Small delay ensures backend commit is reflected
        setTimeout(() => {
          loadOrders();
        }, 300);
      });
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">
          <h3 className="mb-3">Orders Management (Admin View)</h3>

          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status Timeline</th>
                <th>Change Status</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {orders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.username}</td>
                  <td>{order.email}</td>
                  <td>₹ {order.total_amount}</td>

                  {/* PAYMENT STATUS */}
                  <td>
                    <span
                      className={`badge ${
                        order.payment_status === "Completed"
                          ? "bg-success"
                          : order.payment_status === "Cancelled"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {order.payment_status || "Unpaid"}
                    </span>
                  </td>

                  {/* STATUS TIMELINE */}
                  <td>
                    <OrderStatusTimeline status={order.status} />
                  </td>

                  {/* STATUS DROPDOWN / FINAL STATE */}
                  <td>
                    {["Delivered", "Cancelled"].includes(order.status) ? (
                      <span
                        className={`badge ${
                          order.status === "Delivered"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {order.status}
                      </span>
                    ) : (
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order.order_id, e.target.value)
                        }
                      >
                        {ORDER_STATUSES.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>

                  {/* DETAILS */}
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => viewOrderDetails(order.order_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {showModal && (
        <>
          <div className="modal fade show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    Order #{selectedOrderId} Details
                  </h5>
                  <button
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <table className="table table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Qty</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map(item => (
                        <tr key={item.order_item_id}>
                          <td>{item.book_title}</td>
                          <td>{item.author_name}</td>
                          <td>{item.quantity}</td>
                          <td>₹ {item.item_price}</td>
                        </tr>
                      ))}

                      {orderItems.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default Orders;
