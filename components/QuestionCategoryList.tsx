// components/QuestionCategoryList.tsx
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

interface Question {
  _id: string;
  title: string;
  contents: string[];
}

interface Category {
  _id: string;
  name: string;
  group: string | null;
  questions: Array<Question>;
}

interface QuestionCategoryListProps {
  onCategoryChange: (selectedCategory: any) => void;
}

export default function QuestionCategoryList({ onCategoryChange }: QuestionCategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const groupCategories = (categories: Category[]) => {
    const groupedCategories: { [group: string]: Category[] } = {};

    categories.forEach((cat) => {
      const group = cat.group || 'UNGROUPED'; // Default to 'Ungrouped' if group is null
      if (!groupedCategories[group]) {
        groupedCategories[group] = [];
      }
      groupedCategories[group].push(cat);
    });

    return groupedCategories;
  };


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories || []);
        console.log("CATEGORIES:", data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const storedCategoryId = localStorage.getItem("selectedCategoryId");
    if (storedCategoryId && categories.find((cat) => cat._id === storedCategoryId)) {
      setSelectedCategoryId(storedCategoryId);
      const selectedCategory = categories.find((cat) => cat._id === storedCategoryId);
      onCategoryChange(selectedCategory);
    }
  }, [categories, onCategoryChange]);

  const handleCategoryChange = (categoryId: string) => {
    localStorage.setItem("selectedCategoryId", categoryId);
    setSelectedCategoryId(categoryId);
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    onCategoryChange(selectedCategory);
  };

  const groupedCategories = groupCategories(categories);

  return (
    <div className="p-4">
      <div className="space-y-2">
        {Object.entries(groupedCategories).map(([groupName, groupCategories]) => (
          <div key={groupName}>
            {/* Render the group name */}
            <div className="text-sm opacity-25 text-gray-100 font-bold py-2">{groupName}</div>
            
            {/* Render categories within the group */}
            {groupCategories.map((cat) => (
              <div
                key={cat._id}
                className={`text-sm py-2 rounded cursor-pointer ${cat._id === selectedCategoryId ? "p-2 bg-opacity-25 bg-gray-100 text-white" : "hover:bg-gray-100 p-2 hover:bg-opacity-10 text-white"}`}
                onClick={() => handleCategoryChange(cat._id)}
              >
                {cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}