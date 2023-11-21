// components/QuestionCategoryList.tsx
import { useEffect, useState } from "react";
import { faEllipsisH, faEllipsisV, faPencilAlt, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OptionsDropdown from "./OptionsDropdown";

interface Question {
  _id: string;
  title: string;
  contents: string[];
}

interface Category {
  _id: string;
  name: string;
  questions: Array<Question>;
}

interface QuestionCategoryListProps {
  onCategoryChange: (selectedCategory: any) => void;
}

export default function QuestionCategoryList({ onCategoryChange }: QuestionCategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        console.log("DATA", data.categories)
        setCategories(data.categories || []); // Ensure data.data is an array or default to an empty array
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Handle error if needed
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to fetch data only once

  useEffect(() => {
    // Load the selected category from localStorage on component mount
    const storedCategoryId = localStorage.getItem("selectedCategoryId");
    if (storedCategoryId && categories.find((cat) => cat._id === storedCategoryId)) {
      setSelectedCategoryId(storedCategoryId);
      const selectedCategory = categories.find((cat) => cat._id === storedCategoryId);
      onCategoryChange(selectedCategory);
    }
  }, [categories, onCategoryChange]);

  const handleCategoryChange = (categoryId: string) => {
    // Save the selected category to localStorage
    localStorage.setItem("selectedCategoryId", categoryId);

    setSelectedCategoryId(categoryId);
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    onCategoryChange(selectedCategory);
  };

  const handleOptionClick = (option: string, categoryId: string) => {
    // Handle the click event for each option (share, rename, edit)
    // For now, we can just log the option and category ID
    console.log(option, categoryId);
    // You can add additional logic here based on the selected option
  };

  const handleCloseOptions = () => {
    // Close the options when clicking outside the options card
    setShowOptions(null);
  };
  console.log("Data outside", categories)
  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold mb-2">Overview of FAQ</h2>

      <div className="space-y-2 ml-1">
        {categories.map((cat) => (
          <div key={cat._id} className="relative">
            <div
              className={`truncate flex items-center text-xs px-1 py-2 rounded ${cat._id === selectedCategoryId ? "bg-blue-500 text-white" : "hover:bg-blue-100 bg-gray-200"
                } cursor-pointer `}
              style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              onClick={() => handleCategoryChange(cat._id)}
              title={cat.name} // Show full category name on hover
            >
              <p className="truncate">{cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold mb-2">Overview of Abbreviations</h2>
      <h2 className="text-sm font-semibold mb-2">Contact details</h2>
    </div>
  );
}
