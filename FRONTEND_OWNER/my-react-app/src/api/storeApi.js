import axios from 'axios';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,  // keep this
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('ownerToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

/* ===================== AUTH ===================== */

export const ownerRegister = (data) =>
    API.post('/owner/auth/register', data);

export const ownerLogin = (data) =>
    API.post('/owner/auth/login', data);

export const ownerForgotPassword = (data) =>
    API.post('/owner/auth/forgot-password', data);

export const ownerResetPassword = (data) =>
    API.post('/owner/auth/reset-password', data);


/* ===================== STORES ===================== */

export const createStore = (data) =>
    API.post('/owner/store', data);

export const getOwnerStores = () =>
    API.get('/owner/store');

export const getStoreById = (id) =>
    API.get(`/owner/store/${id}`);

export const updateStore = (id, data) =>
    API.put(`/owner/store/${id}`, data);

export const updateStoreStatus = (id, is_active) =>
    API.patch(`/owner/store/${id}/status`, { is_active });


export const uploadStoreImage = (id, image) => {
    const formData = new FormData();
    formData.append('image', image);
    return API.post(`/owner/store/${id}/image`, formData);
};



/* ===================== INVENTORY ===================== */

export const getOwnerInventory = () =>
    API.get('/owner/inventory');

export const addInventory = (data) =>
    API.post('/owner/inventory', data);

export const updateInventory = (id, data) =>
    API.patch(`/owner/inventory/${id}/update`, data);

export const toggleInventoryStatus = (id, is_active) =>
    API.patch(`/owner/inventory/${id}/status`, { is_active });

export const getAdminBooks = () =>
    API.get('/owner/inventory/admin-books');

export const deleteInventoryItem = (inventory_id) =>
    API.delete(`/owner/inventory/${inventory_id}`);


/* ===================== OWNER PROFILE ===================== */

export const getOwnerProfile = () =>
    API.get('/owner/auth/profile');

export const updateOwnerProfile = (data) =>
    API.put('/owner/auth/profile', data);

export const changeOwnerPassword = (data) =>
    API.put('/owner/auth/password', data);



/* ===================== ORDERS ===================== */

export const getOwnerOrders = () =>
    API.get('/owner/orders');

export const getOrderDetails = (order_id) =>
    API.get(`/owner/orders/${order_id}`);

export const cancelOrder = (order_id) =>
    API.patch(`/owner/orders/${order_id}/cancel`);


/* ===================== DASHBOARD ===================== */

export const getTotalOrders = () =>
    API.get('/owner/dashboard/orders');

export const getTotalSales = () =>
    API.get('/owner/dashboard/sales');

export const getLowStock = () =>
    API.get('/owner/inventory/low-stock');


