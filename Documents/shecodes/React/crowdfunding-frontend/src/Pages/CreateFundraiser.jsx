import { useState } from "react";
import { useNavigate } from "react-router-dom";
import postFundraiser from "../api/post-fundraiser";
import postChild from "../api/post-child";

function CreateFundraiser() {
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token");
  const userJson = window.localStorage.getItem("user");
  const user = userJson ? JSON.parse(userJson) : null;

  // Fundraiser form state
  const [fundraiserForm, setFundraiserForm] = useState({
    title: "",
    summary: "",
    description: "",
    goal: "",
    imageUrl: "", // Changed from 'image' to 'imageUrl' (string, not file)
    pledgeType: "both", // "money", "time", or "both"
  });

  // Child form state
  const [childForm, setChildForm] = useState({
    firstname: "",
    lastname: "",
    DOB: "",
    description: "",
    SpecialHelp: false,
    Specify: "",
    imageUrl: "", // Changed from 'image' to 'imageUrl' (string, not file)
  });

  // UI state
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [childImagePreview, setChildImagePreview] = useState(null);
  const [fundraiserImagePreview, setFundraiserImagePreview] = useState(null);

  // Check auth
  if (!token || !user?.bluecard) {
    return (
      <div className="create-container">
        <h2>Access Restricted</h2>
        <p>Only verified bluecard members can create fundraisers</p>
      </div>
    );
  }

  // Handle fundraiser form changes
  const handleFundraiserChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFundraiserForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle fundraiser image URL change
  const handleFundraiserImageChange = (e) => {
    const url = e.target.value;
    setFundraiserForm((prev) => ({
      ...prev,
      imageUrl: url,
    }));
    // Show preview
    if (url) {
      setFundraiserImagePreview(url);
      console.log("🖼️ Fundraiser image URL updated:", url);
    } else {
      setFundraiserImagePreview(null);
    }
  };

  // Handle child form changes
  const handleChildChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChildForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle child image URL change
  const handleChildImageChange = (e) => {
    const url = e.target.value;
    setChildForm((prev) => ({
      ...prev,
      imageUrl: url,
    }));
    // Show preview
    if (url) {
      setChildImagePreview(url);
      console.log("🖼️ Child image URL updated:", url);
    } else {
      setChildImagePreview(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate fundraiser
    if (!fundraiserForm.title.trim()) {
      setMessage("Please enter a fundraiser title");
      return;
    }
    if (!fundraiserForm.summary.trim()) {
      setMessage("Please enter a summary");
      return;
    }
    if (!fundraiserForm.description.trim()) {
      setMessage("Please enter a description for the fundraiser");
      return;
    }
    // Only require goal for money or both pledges
    if (
      (fundraiserForm.pledgeType === "money" ||
        fundraiserForm.pledgeType === "both") &&
      (!fundraiserForm.goal || fundraiserForm.goal <= 0)
    ) {
      setMessage("Please enter a valid goal amount");
      return;
    }

    // Validate child
    if (!childForm.firstname.trim()) {
      setMessage("Please enter child's first name");
      return;
    }
    if (!childForm.lastname.trim()) {
      setMessage("Please enter child's last name");
      return;
    }
    if (!childForm.DOB) {
      setMessage("Please enter child's date of birth");
      return;
    }
    if (!childForm.description.trim()) {
      setMessage("Please enter a description for the child");
      return;
    }
    if (childForm.SpecialHelp && !childForm.Specify.trim()) {
      setMessage("Please specify what special help is needed");
      return;
    }

    try {
      setIsSubmitting(true);

      // Step 1: Create fundraiser FIRST (because child needs fundraiser_id)
      // Note: Backend expects URLField for image, so send as JSON, not FormData
      const fundraiserData = {
        title: fundraiserForm.title,
        summary: fundraiserForm.summary,
        description: fundraiserForm.description || "",
        pledge_type: fundraiserForm.pledgeType,
        is_open: true,
      };

      // Backend ALWAYS requires goal field
      if (
        fundraiserForm.pledgeType === "money" ||
        fundraiserForm.pledgeType === "both"
      ) {
        fundraiserData.goal = parseInt(fundraiserForm.goal, 10);
      } else {
        fundraiserData.goal = 0;
      }

      // Add image URL if provided
      if (fundraiserForm.imageUrl) {
        fundraiserData.image = fundraiserForm.imageUrl;
      }

      console.log("Creating fundraiser...");
      console.log("Fundraiser data being sent:", fundraiserData);
      const newFundraiser = await postFundraiser(fundraiserData, token);
      console.log("Fundraiser created:", newFundraiser);
      setMessage("Fundraiser created! Adding child...");

      // Step 2: Create child with the fundraiser ID
      const childDataWithFundraiser = {
        ...childForm,
        fundraisers: newFundraiser.id, // Attach to fundraiser
      };

      console.log("Creating child with data:", childDataWithFundraiser);
      console.log("Fundraiser ID being attached:", newFundraiser.id);

      try {
        const newChild = await postChild(childDataWithFundraiser, token);
        console.log("Child created:", newChild);

        setMessage("Fundraiser and child created successfully!");
        setTimeout(() => {
          navigate("/account");
        }, 1500);
      } catch (childErr) {
        console.error("Child creation error details:", childErr);
        setMessage(`Fundraiser created but child failed: ${childErr.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="create-fundraiser-page">
      <div className="create-container">
        <h1>Create a Fundraiser</h1>
        <p className="subtitle">Help your child by creating a fundraiser</p>

        {message && (
          <div
            className={`alert ${message.includes("Error") ? "error" : "success"}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="fundraiser-form">
          {/* Fundraiser Section */}
          <section className="form-section">
            <h2>📋 Fundraiser Details</h2>

            <div className="form-group">
              <label htmlFor="title">Fundraiser Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Summer Camp"
                value={fundraiserForm.title}
                onChange={handleFundraiserChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="summary">Summary *</label>
              <input
                id="summary"
                name="summary"
                type="text"
                placeholder="Brief description"
                value={fundraiserForm.summary}
                onChange={handleFundraiserChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Full Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Tell more about your fundraiser"
                value={fundraiserForm.description}
                onChange={handleFundraiserChange}
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              {/* Goal field only shows for money or both pledges */}
              {(fundraiserForm.pledgeType === "money" ||
                fundraiserForm.pledgeType === "both") && (
                <div className="form-group">
                  <label htmlFor="goal">Goal Amount ($) *</label>
                  <input
                    id="goal"
                    name="goal"
                    type="number"
                    placeholder="1000"
                    value={fundraiserForm.goal}
                    onChange={handleFundraiserChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="imageUrl">Fundraiser Image URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={fundraiserForm.imageUrl}
                  onChange={handleFundraiserImageChange}
                />
                {fundraiserImagePreview && (
                  <div className="image-preview">
                    <img src={fundraiserImagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>What type of help do you need? *</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="pledgeType"
                    value="money"
                    checked={fundraiserForm.pledgeType === "money"}
                    onChange={handleFundraiserChange}
                  />
                  Money Only
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="pledgeType"
                    value="time"
                    checked={fundraiserForm.pledgeType === "time"}
                    onChange={handleFundraiserChange}
                  />
                  Time Only
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="pledgeType"
                    value="both"
                    checked={fundraiserForm.pledgeType === "both"}
                    onChange={handleFundraiserChange}
                  />
                  Both Money & Time
                </label>
              </div>
            </div>
          </section>

          {/* Child Section */}
          <section className="form-section">
            <h2>👶 Child Information</h2>
            <p className="section-note">
              Every fundraiser is for a child. Please provide their details.
            </p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstname">First Name *</label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  placeholder="e.g., Emma"
                  value={childForm.firstname}
                  onChange={handleChildChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Last Name *</label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  placeholder="e.g., Smith"
                  value={childForm.lastname}
                  onChange={handleChildChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="DOB">Date of Birth *</label>
                <input
                  id="DOB"
                  name="DOB"
                  type="date"
                  value={childForm.DOB}
                  onChange={handleChildChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Tell us about this child *</label>
              <textarea
                id="description"
                name="description"
                placeholder="e.g., Emma is 5 years old and loves drawing and music"
                value={childForm.description}
                onChange={handleChildChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="SpecialHelp"
                  checked={childForm.SpecialHelp}
                  onChange={handleChildChange}
                />
                Does this child need special help?
              </label>
            </div>

            {childForm.SpecialHelp && (
              <div className="form-group">
                <label htmlFor="Specify">
                  Please specify what help is needed *
                </label>
                <textarea
                  id="Specify"
                  name="Specify"
                  placeholder="e.g., Speech therapy, tutoring, etc."
                  value={childForm.Specify}
                  onChange={handleChildChange}
                  rows="3"
                  required={childForm.SpecialHelp}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="childImageUrl">Child's Photo URL</label>
              <input
                id="childImageUrl"
                name="childImageUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={childForm.imageUrl}
                onChange={handleChildImageChange}
              />
              {childImagePreview && (
                <div className="image-preview">
                  <img src={childImagePreview} alt="Child preview" />
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Fundraiser"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateFundraiser;
