import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  FileText,
  Link,
  DollarSign,
  Layers,
  BarChart,
  ArrowLeft,
  Save,
  Upload,
  Award,
} from "lucide-react";
import { useRewardStore } from "../../store/rewardStore";

const EditRewardPage = () => {
  const { rewardId } = useParams();
  const navigate = useNavigate();

  // Get data and functions from reward store
  const {
    reward,
    isLoading,
    error,
    updateSuccess,
    fetchRewardById,
    updateReward,
    resetRewardStatus,
  } = useRewardStore();

  // Form state
  const [rewardData, setRewardData] = useState({
    name: "",
    description: "",
    courseLink: "",
    price: "",
    points: "",
    category: "",
    level: "",
    image: null,
    imagePreview: "",
  });

  // Image upload state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch reward data when component mounts
  useEffect(() => {
    // Fetch the reward data by ID
    fetchRewardById(rewardId);

    // Reset update status when component unmounts
    return () => {
      resetRewardStatus();
    };
  }, [rewardId]);

  // Populate form when reward data is loaded
  useEffect(() => {
    if (reward && Object.keys(reward).length > 0) {
      console.log("Loading reward data:", reward);

      // Set form data with reward values or defaults
      setRewardData({
        name: reward.name || "",
        description: reward.description || "",
        courseLink: reward.courseLink || "",
        price: reward.price || "",
        points: reward.points || "",
        category: reward.category || "",
        level: reward.level || "",
        image: null,
        imagePreview: reward.image || "",
      });

      // Set image preview if an image URL exists
      if (reward.image) {
        setImagePreview(reward.image);
      }
    }
  }, [reward]);

  // Handle navigation after successful update
  useEffect(() => {
    if (updateSuccess) {
      navigate(`/admin/managerewards`);
    }
  }, [updateSuccess, navigate, rewardId]);

  // Form input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRewardData({
      ...rewardData,
      [name]: value,
    });
  };

  // Image file change handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRewardData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting reward data:", rewardData);

    // Create FormData object for multipart form data (image upload)
    const rewardFormData = new FormData();

    // Append all form fields
    Object.keys(rewardData).forEach((key) => {
      if (key !== "image" && key !== "imagePreview") {
        rewardFormData.append(key, rewardData[key]);
      }
    });

    // Append image file if a new one was selected
    if (imageFile) {
      rewardFormData.append("rewardImage", imageFile);
    }

    // Update reward using the store function
    // Note: You mentioned you'll implement this function
    updateReward(rewardId, rewardFormData);
  };

  // Show loading spinner while fetching data
  if (isLoading && !reward) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Edit Reward</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Reward Image</label>
          <div className="flex items-start space-x-6">
            <div className="w-40 h-40 bg-gray-100 rounded-lg overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Reward preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue-50">
                <Upload className="text-blue-500" />
                <span className="mt-2 text-base">Select course image</span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Recommended size: 800x600 pixels, PNG or JPG format
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <BookOpen size={16} className="mr-1" />
              Course Name
            </label>
            <input
              type="text"
              name="courseName"
              value={rewardData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Link size={16} className="mr-1" />
              Udemy Course Link
            </label>
            <input
              type="url"
              name="udemyLink"
              value={rewardData.courseLink}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 mb-2 flex items-center">
            <FileText size={16} className="mr-1" />
            Description
          </label>
          <textarea
            name="description"
            value={rewardData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Category & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Layers size={16} className="mr-1" />
              Category
            </label>
            <select
              name="category"
              value={rewardData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <BarChart size={16} className="mr-1" />
              level
            </label>
            <select
              name="level"
              value={rewardData.level}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Price and Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <DollarSign size={16} className="mr-1" />
              Price
            </label>
            <input
              type="number"
              name="price"
              value={rewardData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <Award size={16} className="mr-1" />
              Points Required
            </label>
            <input
              type="number"
              name="points"
              value={rewardData.points}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg mr-4 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <Save size={18} className="mr-2" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRewardPage;
