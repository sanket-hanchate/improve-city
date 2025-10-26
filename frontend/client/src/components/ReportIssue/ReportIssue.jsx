import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./index.css"; // Ensure this is linked

// 🟢 Custom marker icon (Leaflet needs explicit path)
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

// ✅ Success Message Modal
const SuccessMessage = ({ message, onClose }) => (
  <div className="status-modal success">
    <div className="status-content">
      <p className="status-text">✅ {message}</p>
      <button className="status-button" onClick={onClose}>
        Close
      </button>
    </div>
  </div>
);

// ❌ Error Message Modal
const ErrorMessage = ({ message, onClose }) => (
  <div className="status-modal error">
    <div className="status-content">
      <p className="status-text">❌ {message}</p>
      <button className="status-button" onClick={onClose}>
        Dismiss
      </button>
    </div>
  </div>
);

// 📍 Map Component (handles click to select location)
const LocationSelector = ({ setForm }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setForm((prev) => ({
        ...prev,
        location: `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`,
      }));
    },
  });

  return position ? (
    <Marker position={position} icon={markerIcon}>
      <Popup>Location Selected!</Popup>
    </Marker>
  ) : null;
};

function ReportIssue() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    location: "",
  });

  // 🆕 Added: State for image upload
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // 🆕 Added: Handle image selection + preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    if (!form.location) {
      setSubmissionStatus("error");
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData(); // 🆕 use FormData
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (image) data.append("image", image); // 🆕 add image to formData

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        body: data, // 🆕 no JSON.stringify here
      });

      if (response.ok) {
        setSubmissionStatus("success");
        setForm({
          name: "",
          email: "",
          title: "",
          description: "",
          location: "",
        });
        setImage(null); // 🆕 reset image
        setPreview(null); // 🆕 reset preview
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeMessage = () => setSubmissionStatus(null);
  const isLocationSelected = !!form.location;

  return (
    <>
      <div className="bg-container">
        <div>
          <img
            src="https://www.cbac.com/images/blog/Screenshot_2[3].jpg"
            className="banner-image"
          />
        </div>
        <div className="page-header">
          <h1>CivicFlow 🛠️ | Report an Issue</h1>
          <p className="subtitle">
            Your voice matters! Help us pinpoint and resolve community problems quickly.
          </p>
        </div>

        <div className="report-page">
          {/* LEFT FORM SECTION */}
          <div className="report-form card-shadow">
            <h2>Report Details</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <input
                name="title"
                placeholder="Issue Title (e.g., Pothole on Main St.)"
                value={form.title}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
              <textarea
                name="description"
                placeholder="Describe the issue in detail..."
                value={form.description}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />

              {/* 🆕 Added: Image Upload Field */}
              <label>Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="preview-image"
                />
              )}

              <div
                className={`location-input-group ${
                  isLocationSelected ? "selected" : ""
                }`}
              >
                <input
                  name="location"
                  placeholder="Click the map to select location"
                  value={
                    isLocationSelected
                      ? `Selected at: ${form.location}`
                      : "Location required*"
                  }
                  onChange={handleChange}
                  disabled
                />
                <span className="location-status">
                  {isLocationSelected ? "📌 Selected" : "👆 Click Map"}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isLocationSelected}
                className={
                  isSubmitting
                    ? "submitting"
                    : isLocationSelected
                    ? "ready"
                    : "disabled"
                }
              >
                {isSubmitting ? "Submitting..." : "Submit Issue"}
              </button>
            </form>
          </div>

          {/* RIGHT MAP SECTION */}
          <div className="map-section card-shadow">
            <h2>Select Location</h2>
            <div className="map-instruction pulse-animation">
              {isLocationSelected
                ? "Location is set! Review details and submit."
                : "☝️ Click anywhere on the map to mark the issue location."}
            </div>
            <div className="map-container">
              <MapContainer
                center={[17.6599, 75.9064]}
                zoom={13}
                scrollWheelZoom={false}
                className="leaflet-map"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationSelector setForm={setForm} />
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS / ERROR MODAL */}
      {submissionStatus === "success" && (
        <SuccessMessage
          message="Thank you! Your issue has been successfully reported."
          onClose={closeMessage}
        />
      )}
      {submissionStatus === "error" && (
        <ErrorMessage
          message={
            !form.location
              ? "Please click the map to select a location before submitting."
              : "Submission failed. Please try again later."
          }
          onClose={closeMessage}
        />
      )}
    </>
  );
}

export default ReportIssue;
