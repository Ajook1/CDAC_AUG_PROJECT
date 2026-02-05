import React from 'react';

const BookInfoModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">

                    {/* HEADER */}
                    <div className="modal-header">
                        <h5 className="modal-title">Book Details</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>

                    {/* BODY */}
                    <div className="modal-body">
                        <div className="row">
                            {/* COVER */}
                            <div className="col-md-4 text-center">
                                <img
                                    src={
                                        book.cover_image_url
                                            ? `http://localhost:4000/${book.cover_image_url}`
                                            : 'https://via.placeholder.com/180x260?text=No+Image'
                                    }
                                    alt={book.title}
                                    className="img-fluid rounded shadow-sm mb-3"
                                    style={{ maxHeight: '260px' }}
                                />
                            </div>

                            {/* DETAILS */}
                            <div className="col-md-8">
                                <h4 className="fw-bold">{book.title}</h4>

                                <table className="table table-sm mt-3">
                                    <tbody>
                                        <tr>
                                            <th>Book ID</th>
                                            <td>{book.book_id}</td>
                                        </tr>
                                        <tr>
                                            <th>Store</th>
                                            <td>{book.store_name}</td>
                                        </tr>
                                        <tr>
                                            <th>ISBN</th>
                                            <td>{book.isbn || '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Price</th>
                                            <td>₹ {book.price}</td>
                                        </tr>
                                        <tr>
                                            <th>MRP</th>
                                            <td>{book.mrp ? `₹ ${book.mrp}` : '-'}</td>
                                        </tr>
                                        <tr>
                                            <th>Stock</th>
                                            <td>{book.stock_quantity}</td>
                                        </tr>
                                        <tr>
                                            <th>Status</th>
                                            <td>
                                                {book.is_active ? (
                                                    <span className="badge bg-success">Active</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Inactive</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Close
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookInfoModal;
