// components/QuestionCategoryList.tsx
import { faChevronDown, faChevronUp, faEdit, faEllipsisH, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import OptionsDropdown from "./OptionsDropdown";

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
  isEditing?: boolean;
}

interface QuestionCategoryListProps {
  onCategoryChange: (selectedCategory: any) => void;
}

export default function QuestionCategoryList({ onCategoryChange }: QuestionCategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<{ [group: string]: boolean }>({});
  const [moreOptionsCategoryId, setMoreOptionsCategoryId] = useState<string | null>(null);
  const [isOptionsDropdownOpen, setOptionsDropdownOpen] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [renameCategoryId, setRenameCategoryId] = useState<string | null>(null); // New state to track renaming

  const handleRename = (categoryId: string) => {
    setRenameCategoryId(categoryId);
  };

  const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCategories = categories.map((cat) =>
      cat._id === renameCategoryId ? { ...cat, name: event.target.value } : cat
    );
    setCategories(updatedCategories);
  };

  const handleRenameBlur = () => {
    setRenameCategoryId(null);
  };

  const handleCategoryChange = (categoryId: string, newName?: string) => {
    // Check if the category is in edit mode
    if (isEditing === categoryId && newName) {
      // Handle your update logic here
      console.log(`Updating category name to ${newName}`);
    }

    setIsEditing(null); // Exit edit mode
    localStorage.setItem("selectedCategoryId", categoryId);
    setSelectedCategoryId(categoryId);
    setMoreOptionsCategoryId(null);
    const selectedCategory = categories.find((cat) => cat._id === categoryId);
    onCategoryChange(selectedCategory);
  };

  const groupCategories = (categories: Category[]) => {
    const groupedCategories: { [group: string]: Category[] } = {};

    categories.forEach((cat) => {
      const group = cat.group || 'UNGROUPED';
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



  const toggleGroup = (group: string) => {
    setExpandedGroups((prevExpandedGroups) => ({
      ...prevExpandedGroups,
      [group]: !prevExpandedGroups[group],
    }));
  };

  const showMoreOptions = (categoryId: string) => {
    setMoreOptionsCategoryId(categoryId);
    setOptionsDropdownOpen(categoryId);
  };

  const hideMoreOptions = () => {
    setMoreOptionsCategoryId(null);
    setOptionsDropdownOpen(null);
  };

  const groupedCategories = groupCategories(categories);

  return (
    <div className="p-4">
      <div className="space-y-2">
        {Object.entries(groupedCategories).map(([groupName, groupCategories]) => (
          <div key={groupName}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleGroup(groupName)}
            >
              <div className="text-xs opacity-25 text-gray-100 font-bold py-2">{groupName.toUpperCase()}</div>
              <FontAwesomeIcon className="ml-2 text-sm opacity-25 text-gray-100 font-bold" icon={expandedGroups[groupName] ? faChevronUp : faChevronDown} />
            </div>

            {/* Render categories within the group, conditionally based on group's expanded state */}
            {expandedGroups[groupName] && (
              <div className="ml-4">
                {groupCategories.map((cat) => (
                  <div key={cat._id} className="relative">
                    {renameCategoryId === cat._id ? ( // Render input field if in rename mode
                      <input
                        className="w-full mb-2"
                        type="text"
                        value={cat.name}
                        onChange={handleRenameChange}
                        onBlur={handleRenameBlur}
                        autoFocus
                      />
                    ) : (
                      <div
                        className={`text-sm py-2 rounded cursor-pointer overflow-hidden whitespace-nowrap overflow-ellipsis ${cat._id === selectedCategoryId
                          ? "p-2 bg-opacity-25 bg-gray-100 text-white"
                          : "hover:bg-gray-100 p-2 hover:bg-opacity-10 text-white"
                          }`}
                        onClick={() => handleCategoryChange(cat._id)}
                      >
                        {cat.name.charAt(0).toUpperCase() + cat.name.slice(1).toLowerCase()}
                        {cat._id === selectedCategoryId && (
                          <div className="absolute top-0 right-0 bottom-0">
                            <div className="options-dots rounded py-2 shadow-md bg-gray-500 px-4">
                              <FontAwesomeIcon icon={faEllipsisH} onClick={() => showMoreOptions(cat._id)} />
                            </div>
                            <OptionsDropdown
                              categoryId={cat._id}
                              isOpen={isOptionsDropdownOpen === cat._id}
                              onClose={() => hideMoreOptions()}
                              onRename={() => handleRename(cat._id)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}