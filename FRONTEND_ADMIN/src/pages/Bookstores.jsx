// import { useEffect, useState } from "react";
// import Navbar from "../component/Navbar";
// import Sidebar from "../component/Sidebar";
// import adminApi from "../api/adminApi";

// const Bookstores = () => {
//   const [bookstores, setBookstores] = useState([]);
//   const [showForm, setShowForm] = useState(false);

//   const [formData, setFormData] = useState({
//     owner_id: "",
//     store_name: "",
//     description: "",
//     address_line: "",
//     city: "",
//     state: "",
//     postal_code: "",
//     country: "",
//     contact_email: "",
//     contact_phone: ""
//   });

//   /* ================= LOAD BOOKSTORES ================= */
//   const loadBookstores = () => {
//     adminApi.get("/bookstores").then(res => {
//       setBookstores(res.data.data || []);
//     });
//   };

//   useEffect(() => {
//     loadBookstores();
//   }, []);

//   /* ================= FORM HANDLERS ================= */
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const resetForm = () => {
//     setShowForm(false);
//     setFormData({
//       owner_id: "",
//       store_name: "",
//       description: "",
//       address_line: "",
//       city: "",
//       state: "",
//       postal_code: "",
//       country: "",
//       contact_email: "",
//       contact_phone: ""
//     });
//   };

//   /* ================= ADD BOOKSTORE ================= */
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     adminApi.post("/bookstores", formData).then(() => {
//       alert("Bookstore created successfully");
//       resetForm();
//       loadBookstores();
//     });
//   };

//   /* ================= UI ================= */
//   return (
//     <>
//       <Navbar />

//       <div className="d-flex">
//         <Sidebar />

//         <div className="container-fluid p-4">

//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h3>Bookstores</h3>

//             <button
//               className="btn btn-primary"
//               onClick={() => setShowForm(true)}
//             >
//               + Add Bookstore
//             </button>
//           </div>

//           {/* ================= ADD BOOKSTORE FORM ================= */}
//           {showForm && (
//             <form className="card p-3 mb-4" onSubmit={handleSubmit}>
//               <h5>Add New Bookstore</h5>

//               <input
//                 className="form-control mb-2"
//                 name="store_name"
//                 placeholder="Store Name"
//                 onChange={handleChange}
//                 required
//               />

//               <input
//                 className="form-control mb-2"
//                 name="owner_id"
//                 placeholder="Owner ID (existing user_id)"
//                 onChange={handleChange}
//                 required
//               />

//               <textarea
//                 className="form-control mb-2"
//                 name="description"
//                 placeholder="Description"
//                 onChange={handleChange}
//               />

//               <input
//                 className="form-control mb-2"
//                 name="address_line"
//                 placeholder="Address"
//                 onChange={handleChange}
//               />

//               <div className="row">
//                 <div className="col-md-6">
//                   <input
//                     className="form-control mb-2"
//                     name="city"
//                     placeholder="City"
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="col-md-6">
//                   <input
//                     className="form-control mb-2"
//                     name="state"
//                     placeholder="State"
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>

//               <input
//                 className="form-control mb-2"
//                 name="postal_code"
//                 placeholder="Postal Code"
//                 onChange={handleChange}
//               />

//               <input
//                 className="form-control mb-2"
//                 name="country"
//                 placeholder="Country"
//                 onChange={handleChange}
//               />

//               <input
//                 className="form-control mb-2"
//                 name="contact_email"
//                 placeholder="Contact Email"
//                 onChange={handleChange}
//               />

//               <input
//                 className="form-control mb-2"
//                 name="contact_phone"
//                 placeholder="Contact Phone"
//                 onChange={handleChange}
//               />

//               <button className="btn btn-success me-2">Save</button>
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={resetForm}
//               >
//                 Cancel
//               </button>
//             </form>
//           )}

//           {/* ================= BOOKSTORES TABLE ================= */}
//           <table className="table table-bordered table-hover">
//             <thead className="table-dark">
//               <tr>
//                 <th>Store ID</th>
//                 <th>Store Name</th>
//                 <th>Owner ID</th>
//                 <th>City</th>
//                 <th>Contact</th>
//               </tr>
//             </thead>

//             <tbody>
//               {bookstores.map(store => (
//                 <tr key={store.store_id}>
//                   <td>{store.store_id}</td>
//                   <td>{store.store_name}</td>
//                   <td>{store.owner_id}</td>
//                   <td>{store.city}</td>
//                   <td>{store.contact_phone}</td>
//                 </tr>
//               ))}

//               {bookstores.length === 0 && (
//                 <tr>
//                   <td colSpan="5" className="text-center">
//                     No bookstores found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//         </div>
//       </div>
//     </>
//   );
// };

// export default Bookstores;


import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";
import adminApi from "../api/adminApi";

const Bookstores = () => {
  const [bookstores, setBookstores] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDisabled, setShowDisabled] = useState(false);

  const [formData, setFormData] = useState({
    owner_id: "",
    store_name: "",
    description: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    contact_email: "",
    contact_phone: ""
  });

  /* ================= LOAD BOOKSTORES ================= */
  const loadBookstores = () => {
    const url = showDisabled ? "/bookstores/all" : "/bookstores";
    adminApi.get(url).then(res => {
      setBookstores(res.data.data || []);
    });
  };

  useEffect(() => {
    loadBookstores();
  }, [showDisabled]);

  /* ================= FORM HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      owner_id: "",
      store_name: "",
      description: "",
      address_line: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      contact_email: "",
      contact_phone: ""
    });
  };

  /* ================= ADD BOOKSTORE ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    adminApi.post("/bookstores", formData).then(() => {
      alert("Bookstore created successfully");
      resetForm();
      loadBookstores();
    });
  };

  /* ================= ENABLE / DISABLE ================= */
  const disableStore = (id) => {
    if (!window.confirm("Disable this bookstore?")) return;
    adminApi.put("/bookstores/disable", { store_id: id }).then(loadBookstores);
  };

  const enableStore = (id) => {
    if (!window.confirm("Enable this bookstore?")) return;
    adminApi.put("/bookstores/enable", { store_id: id }).then(loadBookstores);
  };

  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar />

        <div className="container-fluid p-4">

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Bookstores</h3>

            <div>
              <button
                className="btn btn-secondary me-2"
                onClick={() => setShowDisabled(!showDisabled)}
              >
                {showDisabled ? "Show Active" : "Show Disabled"}
              </button>

              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                + Add Bookstore
              </button>
            </div>
          </div>

          {/* ================= ADD FORM ================= */}
          {showForm && (
            <form className="card p-3 mb-4" onSubmit={handleSubmit}>
              <h5>Add New Bookstore</h5>

              <input className="form-control mb-2" name="store_name" placeholder="Store Name" onChange={handleChange} required />
              <input className="form-control mb-2" name="owner_id" placeholder="Owner ID (existing user_id)" onChange={handleChange} required />
              <textarea className="form-control mb-2" name="description" placeholder="Description" onChange={handleChange} />
              <input className="form-control mb-2" name="address_line" placeholder="Address" onChange={handleChange} />

              <div className="row">
                <div className="col-md-6">
                  <input className="form-control mb-2" name="city" placeholder="City" onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <input className="form-control mb-2" name="state" placeholder="State" onChange={handleChange} />
                </div>
              </div>

              <input className="form-control mb-2" name="postal_code" placeholder="Postal Code" onChange={handleChange} />
              <input className="form-control mb-2" name="country" placeholder="Country" onChange={handleChange} />
              <input className="form-control mb-2" name="contact_email" placeholder="Contact Email" onChange={handleChange} />
              <input className="form-control mb-2" name="contact_phone" placeholder="Contact Phone" onChange={handleChange} />

              <button className="btn btn-success me-2">Save</button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </form>
          )}

          {/* ================= TABLE ================= */}
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Store ID</th>
                <th>Owner</th>
                <th>Name</th>
                <th>City</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookstores.map(store => (
                <tr key={store.store_id}>
                  <td>{store.store_id}</td>
                  <td>{store.owner_id}</td>
                  <td>{store.store_name}</td>
                  <td>{store.city}</td>
                  <td>
                    {store.is_active === 1 ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Disabled</span>
                    )}
                  </td>
                  <td>
                    {store.is_active === 1 ? (
                      <button className="btn btn-sm btn-danger" onClick={() => disableStore(store.store_id)}>
                        Disable
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-success" onClick={() => enableStore(store.store_id)}>
                        Enable
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {bookstores.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No bookstores found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>
    </>
  );
};

export default Bookstores;
