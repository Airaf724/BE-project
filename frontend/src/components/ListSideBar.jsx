import { useState } from "react";
import { BookOpen, GraduationCap, Star, Plus, Lock } from "lucide-react";

export default function ListSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`bg-white shadow-md h-screen p-4 transition-all ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <span
          className={` ml-3 text-[20px] font-semibold ${
            isOpen ? "block" : "hidden"
          }`}
        >
          My Lists
        </span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-200 p-2 rounded-md"
        >
          {isOpen ? "📁" : "📂"}
        </button>
      </div>

      <nav>
        <ul className="space-y-4">
          <li className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            {isOpen && <span>My Orders</span>}
          </li>
          <li className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5" />
            {isOpen && <span>Study Plan</span>}
          </li>
        </ul>
      </nav>

      <div className="mt-6 border-t pt-4">
        <button className="flex items-center space-x-2 mt-2">
          <Plus className="w-4 h-4" />
          {isOpen && <span>Add List</span>}
        </button>
        <div className="flex items-center space-x-2 mt-4 bg-gray-100 p-2 rounded-md">
          <Star className="text-yellow-500 w-5 h-5" />
          {isOpen && <span>Favorite</span>}
          <Lock className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
