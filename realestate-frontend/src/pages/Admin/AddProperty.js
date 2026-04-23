import React, { useState } from "react";
import api from "../../services/api"; 
import "./AddProperty.css";

const AddProperty = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    listingType: "",
    description: "",
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.length) {
      alert("Please upload images ❗");
      return;
    }

    setUploading(true);

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("price", Number(form.price));
    formData.append("type", form.type);
    formData.append("listingType", form.listingType);
    formData.append("description", form.description);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // ✅ API CALL FIXED (NO 5000)
      const res = await api.post("/property", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added successfully ✅");
      console.log(res.data);

      // ✅ RESET FORM
      setForm({
        title: "",
        location: "",
        price: "",
        type: "",
        listingType: "",
        description: "",
      });

      setFiles([]);

    } catch (err) {
      console.error("Error adding property:", err);

      if (err.response) {
        alert(err.response.data?.message || "Failed ❌");
      } else {
        alert("Server not reachable ❌");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-property-page">
      <div className="overlay">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Add Property 🏠</h2>

          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
          </select>

          <select
            value={form.listingType}
            onChange={(e) =>
              setForm({ ...form, listingType: e.target.value })
            }
          >
            <option value="">Select Listing Type</option>
            <option value="Sell">Sell (Buy)</option>
            <option value="Rent">Rent</option>
          </select>

          <textarea
            placeholder="Enter property description..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* FILE UPLOAD */}
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />

          {uploading && (
            <p className="uploading-text">Uploading images...</p>
          )}

          {/* PREVIEW */}
          <div className="preview-grid">
            {files.length > 0 &&
              files.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  width="100"
                />
              ))}
          </div>

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;