import React, { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    brand: "",
    variant: "",
    fuelType: false,
    transmissionType: false,
    kmsDriven: 0,
    askingPrice: 0,
    condition: 0,
  });
  const d = new Date();
  const currYear = d.getFullYear().toString();
  const minCurrYear = (d.getFullYear() - 15).toString();
  const handleImage = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image Upload Failed (2mb max per image)");
        });
    } else {
      setImageUploadError("Only 6 images are allowed per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  function removeImage(index) {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }
  function handleChange(e) {
    const { id, value, type, checked, name } = e.target;
    if (type === "radio" && name === "fuel") {
      if (id === "petrol") {
        setFormData({ ...formData, fuelType: true });
      } else if (id === "diesel") {
        setFormData({ ...formData, fuelType: false });
      }
    } else if (type === "radio" && name === "type") {
      if (id === "auto") {
        setFormData({ ...formData, transmissionType: true });
      } else if (id === "manual") {
        setFormData({ ...formData, transmissionType: false });
      }
    } else {
      setFormData({ ...formData, [e.target.id]: value });
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      if (formData.imageUrls.length === 0) {
        setError("Atleast 1 image is required");
        setLoading(false);
      } else {
        const res = await fetch("/api/listing/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
        }
        navigate(`/listing/${data._id}`);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Brand"
            className="border p-3 rounded-lg"
            id="brand"
            maxLength="62"
            required
          />
          <input
            type="text"
            onChange={handleChange}
            placeholder="Model"
            className="border p-3 rounded-lg"
            id="variant"
            required
          />
          <input
            type="number"
            onChange={handleChange}
            placeholder="Year of Purchase"
            className="border p-3 rounded-lg"
            id="year"
            min={minCurrYear}
            max={currYear}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <h1 className="font-semibold mr-12">Fuel Type:</h1>
            <div className="flex gap-2">
              <input
                type="radio"
                onChange={handleChange}
                id="petrol"
                name="fuel"
                className="w-5 ml-4"
                required
              />
              <span>Petrol</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                onChange={handleChange}
                id="diesel"
                name="fuel"
                className="w-5 ml-7"
                required
              />
              <span>Diesel</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <h1 className="font-semibold">Transmission Type:</h1>
            <div className="flex gap-2">
              <input
                type="radio"
                onChange={handleChange}
                id="auto"
                name="type"
                className="w-5"
                required
              />
              <span>Automatic</span>
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                onChange={handleChange}
                id="manual"
                name="type"
                className="w-5"
                required
              />
              <span>Manual</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 w-28 border border-gray-300 rounded-lg"
                onChange={handleChange}
                type="number"
                id="kmsDriven"
                min="0"
                required
              />
              <p>kms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 w-28 border border-gray-300 rounded-lg"
                onChange={handleChange}
                type="number"
                id="condition"
                min="1"
                max="5"
                required
              />
              <p>Condition on scale from 1-5</p>
            </div>
            <div className="flex items-center gap-2">
              <p>₹</p>
              <input
                className="p-3 w-28 border border-gray-300 rounded-lg"
                onChange={handleChange}
                type="number"
                id="askingPrice"
                min="0"
                required
              />
              <p>Asking Price</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImage}
              className="p-3 text-green-700 border border-green-700 rounded-md uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-60"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          <p className="text-red-700 text-sm">{error ? error : ""}</p>
        </div>
      </form>
    </main>
  );
}
