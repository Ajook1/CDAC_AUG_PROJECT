import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteInventoryItem } from '../../api/storeApi';
import { toast } from 'react-toastify';
import BookInfoModal from './BookInfoModal';

const InventoryTable = ({ items, reload }) => {
    const navigate = useNavigate();
    const [selectedBook, setSelectedBook] = useState(null);

    const deleteItem = async (inventory_id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;

        try {
            const res = await deleteInventoryItem(inventory_id);

            if (res.data?.error) {
                toast.error(res.data.error);
                return;
            }

            toast.success('Book removed from inventory');
            reload();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete book');
        }
    };

    return (
        <>
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover mb-0 align-middle">
                        <thead className="table-light">
                            <tr>
                                <th style={{ width: '70px' }}>Cover</th>
                                <th>Title</th>
                                <th>Store</th>
                                <th>Price</th>
                                <th>MRP</th>
                                <th>Stock</th>
                                <th style={{ width: '110px' }}>More Info</th>
                                <th style={{ width: '160px' }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted py-4">
                                        No books found
                                    </td>
                                </tr>
                            )}

                            {items.map((item) => (
                                <tr key={item.inventory_id}>
                                    {/* COVER */}
                                    <td>
                                        <img
                                            src={
                                                item.cover_image_url
                                                    ? `${import.meta.env.VITE_API_URL}/${item.cover_image_url}`
                                                    : 'https://via.placeholder.com/50x70?text=No+Image'
                                            }
                                            alt={item.title}
                                            style={{
                                                width: '50px',
                                                height: '70px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </td>

                                    <td>{item.title}</td>
                                    <td>{item.store_name}</td>
                                    <td>₹{item.price}</td>
                                    <td>{item.mrp ? `₹${item.mrp}` : '-'}</td>
                                    <td>{item.stock_quantity}</td>

                                    {/* MORE INFO */}
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => setSelectedBook(item)}
                                        >
                                            More Info
                                        </button>
                                    </td>

                                    {/* ACTIONS */}
                                    <td>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() =>
                                                    navigate(`/inventory/edit/${item.inventory_id}`)
                                                }
                                            >
                                                Update
                                            </button>

                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    deleteItem(item.inventory_id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {selectedBook && (
                <BookInfoModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </>
    );
};

export default InventoryTable;
