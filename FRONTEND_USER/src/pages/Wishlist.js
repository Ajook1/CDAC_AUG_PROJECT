import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getWishlist,
  removeFromWishlist,
  addToCart
} from "../services/api";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await getWishlist();

      if (res.data.status === "success") {
        setItems(res.data.data || []);
      }
    } catch {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Buy Now
  const buyNow = async (inventoryId) => {
    try {
      const res = await addToCart({
        inventory_id: inventoryId,
        quantity: 1
      });

      if (res.data.status === "success") {
        toast.success("Added to cart 🛒");
        navigate("/cart");
      }
    } catch {
      toast.error("Unable to add to cart");
    }
  };

  // ✅ Remove from wishlist (inventory based)
  const handleRemove = async (inventoryId) => {
    try {
      const res = await removeFromWishlist(inventoryId);

      if (res.data.status === "success") {
        setItems(prev =>
          prev.filter(item => item.inventory_id !== inventoryId)
        );
        toast.info("Removed from wishlist 🤍");
      }
    } catch {
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">❤️ My Wishlist</h3>

      {items.length === 0 && (
        <div className="alert alert-info text-center">
          Your wishlist is empty ❤️
        </div>
      )}

      {items.map((item) => (
        <div
          key={item.inventory_id}   // ✅ FIX
          className="card shadow-sm mb-3"
        >
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-12 col-md-7">
                <h6>{item.title}</h6>
                <small className="text-muted">
                  {item.author}
                </small>
                <div className="fw-bold mt-1">
                  ₹ {item.price}
                </div>
              </div>

              <div className="col-12 col-md-5 text-md-end">
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => buyNow(item.inventory_id)}
                >
                  Buy Now
                </button>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemove(item.inventory_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Wishlist;
