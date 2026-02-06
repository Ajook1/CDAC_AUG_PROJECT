import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAddresses,
  addAddress,
  deleteAddress
} from "../services/api";

function Addresses() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const [defaultId, setDefaultId] = useState(
    localStorage.getItem("defaultAddressId")
  );
  const [lastUsedId, setLastUsedId] = useState(
    localStorage.getItem("lastUsedAddressId")
  );

  // 🔹 Load addresses
  const loadAddresses = useCallback(async () => {
    try {
      const res = await getAddresses();

      if (res.data.status === "error") {
        toast.error(res.data.error);
        navigate("/login");
        return;
      }

      setAddresses(res.data.data || []);
    } catch {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 ADD ADDRESS
  const handleAddAddress = async () => {
    const {
      full_name,
      phone,
      address_line,
      city,
      state,
      postal_code,
      country,
    } = form;

    if (
      !full_name ||
      !phone ||
      !address_line ||
      !city ||
      !state ||
      !postal_code ||
      !country
    ) {
      toast.error("All address fields are mandatory ❗");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Mobile number must be exactly 10 digits ❗");
      return;
    }

    if (!/^\d{6}$/.test(postal_code)) {
      toast.error("Pincode must be exactly 6 digits ❗");
      return;
    }

    try {
      const res = await addAddress(form);

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      toast.success("Address added successfully ✅");

      setForm({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        postal_code: "",
        country: "",
      });

      loadAddresses();
    } catch {
      toast.error("Failed to add address ❌");
    }
  };

  // 🔹 Set default address (local only)
  const setDefaultAddress = (id) => {
    localStorage.setItem("defaultAddressId", id);
    setDefaultId(id);
    toast.success("Default address set ⭐");
  };

  const removeDefaultAddress = () => {
    localStorage.removeItem("defaultAddressId");
    setDefaultId(null);
    toast.info("Default address removed ❌");
  };

  // 🔹 Use address
  const handleUseAddress = (id) => {
    localStorage.setItem("lastUsedAddressId", id);
    setLastUsedId(id);
    navigate(`/confirm-order?addressId=${id}`);
  };

  // 🔹 Remove address
  const handleRemoveAddress = async (id) => {
    try {
      const res = await deleteAddress(id);

      if (res.data.status === "error") {
        toast.error(res.data.error);
        return;
      }

      toast.info("Address removed 🗑️");

      if (String(id) === String(defaultId)) {
        localStorage.removeItem("defaultAddressId");
        setDefaultId(null);
      }
      if (String(id) === String(lastUsedId)) {
        localStorage.removeItem("lastUsedAddressId");
        setLastUsedId(null);
      }

      loadAddresses();
    } catch {
      toast.error("Failed to remove address ❌");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">

          <h3 className="mb-3">📍 My Addresses</h3>

          {addresses.length === 0 && (
            <p className="text-muted">No address added yet</p>
          )}

          {addresses.map((addr) => (
            <div
              key={addr.address_id}
              className={`card shadow-sm p-3 mb-3 ${String(addr.address_id) === String(defaultId)
                  ? "border border-primary"
                  : ""
                }`}
            >
              <strong>{addr.full_name}</strong>
              <div className="text-muted">📱 {addr.phone}</div>
              <div className="text-muted">
                {addr.address_line}, {addr.city}
              </div>
              <div className="text-muted">
                {addr.state} - {addr.postal_code}
              </div>
              <div className="text-muted">{addr.country}</div>

              <div className="mt-2">
                {String(addr.address_id) === String(defaultId) && (
                  <span className="badge bg-primary me-2">Default</span>
                )}
                {String(addr.address_id) === String(lastUsedId) && (
                  <span className="badge bg-success">Last used</span>
                )}
              </div>

              <div className="d-flex gap-2 flex-wrap mt-3">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleUseAddress(addr.address_id)}
                >
                  Use this address
                </button>

                {String(addr.address_id) === String(defaultId) ? (
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={removeDefaultAddress}
                  >
                    Remove Default
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setDefaultAddress(addr.address_id)}
                  >
                    Set Default
                  </button>
                )}

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleRemoveAddress(addr.address_id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* ➕ ADD NEW ADDRESS */}
          <div className="card shadow-sm mt-4">
            <div className="card-body">
              <h5 className="mb-3">➕ Add New Address</h5>

              <div className="row">
                {[
                  { key: "full_name", label: "Name" },
                  { key: "phone", label: "Mobile" },
                  { key: "address_line", label: "Street" },
                  { key: "city", label: "City" },
                  { key: "state", label: "State" },
                  { key: "postal_code", label: "Pincode" },
                  { key: "country", label: "Country" },
                ].map(({ key, label }) => (
                  <div className="col-md-6 mb-2" key={key}>
                    <input
                      className="form-control"
                      name={key}
                      placeholder={label}
                      value={form[key]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>

              <div className="text-end mt-2">
                <button
                  className="btn btn-primary"
                  onClick={handleAddAddress}
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Addresses;
