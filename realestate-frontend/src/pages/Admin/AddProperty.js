import React, { useState } from "react";
import "./AddProperty.css";

const AddProperty = () => {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    listingType: "",
    imageUrls: [], 
    description: "",
  });

  const [uploading, setUploading] = useState(false);


  
const [files, setFiles] = useState([]);
  
 const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!files.length) {
    alert("Please upload images ❗");
    return;
  }

  setUploading(true); // 🔥 START LOADING

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
    const res = await fetch("http://localhost:5000/api/Property", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) {
      alert("Property added ✅");

      setForm({
        title: "",
        location: "",
        price: "",
        type: "",
        listingType: "",
        description: "",
      });

      setFiles([]);
    } else {
      alert("Failed ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  } finally {
    setUploading(false); // 🔥 STOP LOADING
  }
};
  console.log(form.imageUrls);

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

          
          <input
            type="file"
            multiple
            onChange={(e) => setFiles([...e.target.files])}
          />

          
          {uploading && <p className="uploading-text">Uploading images...</p>}

         
          <div className="preview-grid">
           {files && files.length > 0 &&
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