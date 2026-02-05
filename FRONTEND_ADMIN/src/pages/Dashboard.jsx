import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    lowStockBooks: 0,
    blockedUsers: 0,
    todayRevenue: 0,
    totalRevenue: 0
  });


  useEffect(() => {
    Promise.all([
      adminApi.get("/dashboard/total-users"),
      adminApi.get("/dashboard/total-books"),
      adminApi.get("/dashboard/total-orders"),
      adminApi.get("/dashboard/low-stock"),
      adminApi.get("/dashboard/blocked-users"),
      adminApi.get("/dashboard/today-revenue"),
      adminApi.get("/dashboard/total-revenue")
    ]).then(
      ([
        users,
        books,
        orders,
        stock,
        blocked,
        todayRev,
        totalRev
      ]) => {
        setStats({
          totalUsers: users.data.data.totalUsers,
          totalBooks: books.data.data.totalBooks,
          totalOrders: orders.data.data.totalOrders,
          lowStockBooks: stock.data.data.lowStockBooks,
          blockedUsers: blocked.data.data.blockedUsers,
          todayRevenue: todayRev.data.data.todayRevenue,
          totalRevenue: totalRev.data.data.totalRevenue
        });
      }
    );
  }, []);


  return (
    <>
      <Navbar />
      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">
          <h3 className="mb-4">Admin Dashboard</h3>

          {/* ===== SYSTEM STATS ===== */}
          <div className="row mb-4">

            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white h-100">
                <div className="card-body">
                  <h6>Total Users</h6>
                  <h3>{stats.totalUsers}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white h-100">
                <div className="card-body">
                  <h6>Total Books</h6>
                  <h3>{stats.totalBooks}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <h6>Total Orders</h6>
                  <h3>{stats.totalOrders}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card bg-dark text-white h-100">
                <div className="card-body">
                  <h6>Total Revenue</h6>
                  <h3>₹ {stats.totalRevenue}</h3>
                </div>
              </div>
            </div>

          </div>

          <div className="row">

            <div className="col-md-4 mb-3">
              <div className="card bg-success text-white h-100">
                <div className="card-body">
                  <h6>Today's Revenue</h6>
                  <h3>₹ {stats.todayRevenue}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-warning text-dark h-100">
                <div className="card-body">
                  <h6>Low Stock Books</h6>
                  <h3>{stats.lowStockBooks}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card bg-danger text-white h-100">
                <div className="card-body">
                  <h6>Blocked Users</h6>
                  <h3>{stats.blockedUsers}</h3>
                </div>
              </div>
            </div>

          </div>


        </div>
      </div>
    </>
  );
};

export default Dashboard;
