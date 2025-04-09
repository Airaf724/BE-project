import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrderStore } from "../../store/orderStore";
import Input from "../../components/Input";
import {
  BookOpen,
  FileTextIcon,
  Link,
  DollarSign,
  Layers,
  ImageIcon,
  BarChart,
} from "lucide-react";

const CreateReward = () => {
  const { addReward } = useOrderStore();
  const navigate = useNavigate();
  const [rewardData, setRewardData] = useState({
    courseName: "",
    description: "",
    udemyLink: "",
    price: "",
    category: "--select--",
    difficulty: "--select--",
    image: null,
    imagePreview: "",
  });

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
    } = rewardData;
    if (
      !courseName ||
      !description ||
      !udemyLink ||
      !price ||
      category === "--select--" ||
      difficulty === "--select--" ||
      !image
    ) {
      alert("Please fill in all fields!");
      return;
    }
    try {
      await addReward(rewardData);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-start justify-center p-6">
        <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">
            Add Reward
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              icon={BookOpen}
              type="text"
              placeholder="Course Name"
              value={rewardData.courseName}
              onChange={(e) =>
                setRewardData({ ...rewardData, courseName: e.target.value })
              }
            />
            <Input
              icon={FileTextIcon}
              type="text"
              placeholder="Description"
              value={rewardData.description}
              onChange={(e) =>
                setRewardData({ ...rewardData, description: e.target.value })
              }
            />
            <Input
              icon={Link}
              type="url"
              placeholder="Udemy Course Link"
              value={rewardData.udemyLink}
              onChange={(e) =>
                setRewardData({ ...rewardData, udemyLink: e.target.value })
              }
            />
            <Input
              icon={DollarSign}
              type="number"
              placeholder="Price"
              value={rewardData.price}
              onChange={(e) =>
                setRewardData({ ...rewardData, price: e.target.value })
              }
            />
            <Input
              icon={Layers}
              type="select"
              options={[
                "--select--",
                "Web Development",
                "Data Science",
                "AI/ML",
                "Cybersecurity",
              ]}
              value={rewardData.category}
              onChange={(e) =>
                setRewardData({ ...rewardData, category: e.target.value })
              }
            />
            <Input
              icon={BarChart}
              type="select"
              options={["--select--", "Beginner", "Intermediate", "Advanced"]}
              value={rewardData.difficulty}
              onChange={(e) =>
                setRewardData({ ...rewardData, difficulty: e.target.value })
              }
            />
            <Input
              icon={ImageIcon}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {rewardData.imagePreview && (
              <img
                src={rewardData.imagePreview}
                alt="Preview"
                className="w-52 h-32 object-cover rounded-md"
              />
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
            >
              Add Reward
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReward;
