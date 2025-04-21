import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRewardStore } from "../../store/rewardStore";
import {
  BookOpen,
  FileText,
  Link,
  DollarSign,
  Layers,
  BarChart,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Upload,
  Award,
} from "lucide-react";

const CreateReward = () => {
  const { addReward } = useRewardStore();
  const navigate = useNavigate();

  const [rewardData, setRewardData] = useState({
    courseName: "",
    description: "",
    udemyLink: "",
    price: "",
    points: "",
    category: "--select--",
    difficulty: "--select--",
    image: null,
    imagePreview: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRewardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setRewardData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      courseName,
      description,
      udemyLink,
      price,
      category,
      difficulty,
      image,
      points,
    } = rewardData;

    if (
      !courseName ||
      !description ||
      !udemyLink ||
      !price ||
      !points ||
      category === "--select--" ||
      difficulty === "--select--" ||
      !image
    ) {
      setError("Please fill in all fields!");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await addReward(rewardData);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Failed to add reward. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-3 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Add Reward</h1>
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
              {rewardData.imagePreview ? (
                <img
                  src={rewardData.imagePreview}
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
                  name="image"
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
              value={rewardData.courseName}
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
              value={rewardData.udemyLink}
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
              <option value="--select--">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Cybersecurity">Cybersecurity</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2 flex items-center">
              <BarChart size={16} className="mr-1" />
              Difficulty
            </label>
            <select
              name="difficulty"
              value={rewardData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="--select--">Select Difficulty</option>
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
            Add Reward
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReward;
