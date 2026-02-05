import { Routes, Route, Navigate } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Inventory from '../pages/Inventory';
import Orders from '../pages/Orders';
import ProtectedRoute from '../components/ProtectedRoute';
import Stores from '../pages/Stores';        // ⭐ NEW
import CreateStore from '../pages/createStore'; // ⭐ NEW
import EditStore from '../pages/EditStore';     // ⭐ NEW
import AddInventory from '../pages/AddInventory';
import EditInventory from '../pages/EditInventory';
import LowStock from '../pages/LowStock';
import StoreInventoryDashboard from '../pages/StoreInventoryDashboard';
import Profile from '../pages/Profile';
import ChangePassword from '../pages/ChangePassword';
import OrderDetails from '../pages/OrderDetails';
import OwnerForgotPassword from "../pages/OwnerForgotPassword";





const StoreRoutes = () => (
    <Routes>
        {/* ⭐ NEW: Default route shows Register first */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/owner/forgot-password" element={<OwnerForgotPassword />} />


        {/* ⭐ NEW: Protected dashboard routes */}
        <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/stores" element={
            <ProtectedRoute><Stores /></ProtectedRoute>
        } />

        <Route path="/stores/create" element={
            <ProtectedRoute><CreateStore /></ProtectedRoute>
        } />

        <Route path="/stores/edit/:id" element={
            <ProtectedRoute><EditStore /></ProtectedRoute>
        } />

        <Route path="/inventory" element={
            <ProtectedRoute><Inventory /></ProtectedRoute>
        } />

        <Route
            path="/inventory/dashboard"
            element={
                <ProtectedRoute>
                    <StoreInventoryDashboard />
                </ProtectedRoute>
            }
        />

        <Route
            path="/inventory/add"
            element={
                <ProtectedRoute>
                    <AddInventory />
                </ProtectedRoute>
            }
        />

        {/* ✅ EDIT INVENTORY */}
        <Route
            path="/inventory/edit/:inventory_id"
            element={
                <ProtectedRoute>
                    <EditInventory />
                </ProtectedRoute>
            }
        />

        {/* ✅ LOW STOCK */}
        <Route
            path="/inventory/low-stock"
            element={
                <ProtectedRoute>
                    <LowStock />
                </ProtectedRoute>
            }
        />

        <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="/change-password" element={
            <ProtectedRoute><ChangePassword /></ProtectedRoute>
        } />


        <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
        } />

        <Route path="/orders/:order_id" element={
            <ProtectedRoute><OrderDetails /></ProtectedRoute>
        } />



    </Routes>
);




export default StoreRoutes;
