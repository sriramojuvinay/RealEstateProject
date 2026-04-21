import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProperty.css";

const API_BASE = "http://localhost:5000";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [property, setProperty] = useState({
    title: "",
    location: "",
    price: "",
    type: "",
    listingType: "",
    description: "",
    imageUrls: [],
  });

  const [newImages, setNewImages] = useState([]);

  // 🔥 FETCH PROPERTY
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/property/${id}`);
        const data = await res.json();

        let images = data.imageUrls;

        if (typeof images === "string") {
          try {
            images = JSON.parse(images);
          } catch {
            images = [];
          }
        }

        setProperty({
          ...data,
          imageUrls: images || [],
        });
      } catch (err) {
        console.error("Error fetching property:", err);
      }
    };

    fetchProperty();
  }, [id]);

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 NEW IMAGES
  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  // 🔥 DELETE EXISTING IMAGE (IMPORTANT)
  const handleDeleteImage = (index) => {
    const updatedImages = property.imageUrls.filter((_, i) => i !== index);

    setProperty({
      ...property,
      imageUrls: updatedImages,
    });
  };

  // 🔥 UPDATE PROPERTY (FIXED)
  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("Title", property.title);
      formData.append("Location", property.location);
      formData.append("Price", property.price);
      formData.append("Type", property.type);
      formData.append("ListingType", property.listingType);
      formData.append("Description", property.description);

      // 🔥 KEY FIX: SEND EXISTING IMAGES
      property.imageUrls.forEach((img) => {
        formData.append("ExistingImages", img);
      });

      // 🔥 SEND NEW IMAGES
      newImages.forEach((img) => {
        formData.append("Files", img);
      });

      const res = await fetch(`${API_BASE}/api/property/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert("Updated successfully ✅");
        navigate("/admin/properties");
      } else {
        console.error(await res.text());
        alert("Update failed ❌");
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-property-container">
      <h2>Edit Property ✏️</h2>

      <input
        name="title"
        value={property.title}
        onChange={handleChange}
        placeholder="Title"
      />

      <input
        name="location"
        value={property.location}
        onChange={handleChange}
        placeholder="Location"
      />

      <input
        name="price"
        value={property.price}
        onChange={handleChange}
        placeholder="Price"
      />

      <select name="type" value={property.type} onChange={handleChange}>
        <option>Apartment</option>
        <option>Villa</option>
        <option>House</option>
      </select>

      <select
        name="listingType"
        value={property.listingType}
        onChange={handleChange}
      >
        <option>Sale</option>
        <option>Rent</option>
      </select>

      <textarea
        name="description"
        value={property.description}
        onChange={handleChange}
        placeholder="Description"
      />

      {/* 🔥 EXISTING IMAGES */}
      <div className="preview">
        {property.imageUrls.map((img, i) => (
          <div className="image-box" key={i}>
            <img src={img} alt="" />
            <button
              className="delete-img"
              onClick={() => handleDeleteImage(i)}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* NEW IMAGES */}
      <input type="file" multiple onChange={handleImageChange} />

      <div className="preview">
        {newImages.map((img, i) => (
          <img key={i} src={URL.createObjectURL(img)} alt="" />
        ))}
      </div>

      <button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Property"}
      </button>
    </div>
  );
};

export default EditProperty;