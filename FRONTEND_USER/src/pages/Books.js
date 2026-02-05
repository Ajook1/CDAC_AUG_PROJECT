import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

import {
  getBooks,
  getWishlist,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  // searchBooks
} from "../services/api";

function Books({ refreshCartCount }) {
  console.log("API URL =", process.env.REACT_APP_API_URL); 
  const location = useLocation();

  const [books, setBooks] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]); // inventory_ids
  // const [search, setSearch] = useState("");
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    if (location.pathname === "/books") {
      loadInitialData();
    }
  }, [location.pathname]);

  const loadInitialData = async () => {
    try {
      const bookRes = await getBooks();
      if (bookRes.data.status === "success") {
        setBooks(bookRes.data.data || []);
      }

      const wishRes = await getWishlist();
      if (wishRes.data.status === "success") {
        // ✅ store inventory_ids
        setWishlistIds((wishRes.data.data || []).map(i => i.inventory_id));
      }
    } catch {
      toast.error("Failed to load books");
    }
  };

  // const handleSearch = async (value) => {
  //   setSearch(value);

  //   if (!value.trim()) {
  //     const res = await getBooks();
  //     if (res.data.status === "success") {
  //       setBooks(res.data.data);
  //     }
  //     return;
  //   }

  //   try {
  //     const res = await searchBooks(value);
  //     if (res.data.status === "success") {
  //       setBooks(res.data.data);
  //     }
  //   } catch {
  //     toast.error("Search failed");
  //   }
  // };

  const handleAddToCart = async (inventoryId) => {
    try {
      const res = await addToCart({
        inventory_id: inventoryId,
        quantity: 1
      });

      if (res.data.status === "success") {
        setAddedIds(prev => [...prev, inventoryId]);
        toast.success("Added to cart 🛒");
        refreshCartCount();
      } else {
        toast.error(res.data.error || "Cart failed");
      }
    } catch {
      toast.error("Unable to add to cart");
    }
  };

  // ✅ Wishlist logic (inventory based)
  const toggleWishlist = async (inventoryId) => {
    try {
      if (wishlistIds.includes(inventoryId)) {
        const res = await removeFromWishlist(inventoryId);
        if (res.data.status === "success") {
          setWishlistIds(prev => prev.filter(id => id !== inventoryId));
          toast.info("Removed from wishlist 🤍");
        }
        return;
      }

      const res = await addToWishlist({ inventory_id: inventoryId });
      if (res.data.status === "success") {
        setWishlistIds(prev => [...prev, inventoryId]);
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Wishlist update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">📚 Books</h3>

      <div className="row">
        {books.map((book) => (
          
          <div
            key={book.inventory_id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <div className="card shadow-sm">
              <img
               src={`${process.env.REACT_APP_API_URL?.replace(/\/$/, "")}/${book.cover_image_url}`}
                alt={book.title}
                style={{
                  height: "220px",
                  objectFit: "contain",
                  padding: "20px",
                  background: "#f8f9fa"
                }}
              />

              <div className="card-body text-center">
                <h6>{book.title}</h6>
                <small className="text-muted">
                  {book.author} · {book.store_name}
                </small>

                <p className="fw-bold mt-2">₹ {book.price}</p>

                <button
                  className="btn btn-primary w-100 mb-2"
                  onClick={() => handleAddToCart(book.inventory_id)}
                >
                  {addedIds.includes(book.inventory_id)
                    ? "Added to Cart ✓"
                    : "Add to Cart"}
                </button>

                {/* ✅ THE REAL FIX IS HERE */}
                <button
                  className={`btn w-100 ${
                    wishlistIds.includes(book.inventory_id)
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => toggleWishlist(book.inventory_id)}
                >
                  {wishlistIds.includes(book.inventory_id)
                    ? "❤️ Wishlisted"
                    : "🤍 Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
