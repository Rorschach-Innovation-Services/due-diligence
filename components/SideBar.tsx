// components/QuestionCategoryList.tsx
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { faChevronDown, faChevronUp, faEdit, faEllipsisH, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
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
  const [renameCategoryId, setRenameCategoryId] = useState<string | null>(null);
  const { user, error, isLoading } = useUser();
  const [loading, setLoading] = useState(true);
  const [groupedCategories, setGroupedCategories] = useState<{ [group: string]: Category[] }>({});

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const groupCategories = async (categories: Category[]) => {
    const groupedCategories: { [group: string]: Category[] } = {};

    for (let cat of categories) {
      let groupName = 'UNGROUPED';

      if (cat.group) {
        // Fetch group information from the API
        try {
          const response = await fetch(`/api/group?groupId=${cat.group}`); //cat.group = groupId
          const data = await response.json();
          console.log("Group data:", data)
          if (data.group && data.group.name) {
            groupName = data.group.name;
          }
        } catch (error) {
          console.error(`Error fetching group for category ${cat._id}:`, error);
        }
      }

      if (!groupedCategories[groupName]) {
        groupedCategories[groupName] = [];
      }
      groupedCategories[groupName].push(cat);
    }

    return groupedCategories;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data.categories || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadGroupedCategories = async () => {
      setLoading(true);
      const categoriesData = await fetch("/api/categories");
      const data = await categoriesData.json();
      const grouped = await groupCategories(data.categories);
      setGroupedCategories(grouped);
      setLoading(false);
    };

    loadGroupedCategories();
  }, []);

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

  const handleRenameKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await handleUpdateCategory(renameCategoryId!);
      setRenameCategoryId(null);
      setIsEditing(null); // Clear editing state after updating
    }
  };

  const handleUpdateCategory = async (categoryId: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/categories?categoryId=${categoryId}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categories.find((cat) => cat._id === categoryId)?.name, // Get the updated category name from state
        }),
      });

      console.log("CHECK:", categories.find((cat) => cat._id === categoryId))
      console.log(response)
      if (response.ok) {
        const data = await response.json();

        // Assuming the response includes the updated category data
        const updatedCategory = data.updatedCategory;

        console.log("After PUT:", data);

        // Update the state with the updated category data
        setCategories((prevCategories) =>
          prevCategories.map((cat) => (cat._id === categoryId ? updatedCategory : cat))
        );
      } else {
        console.error('Failed to update the category:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating the category:', error);
    }
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/categories?categoryId=${categoryId}`;

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();

        const updatedCategory = data.updatedCategory;

      } else {
        console.error('Failed to delete the question content:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting the question content:', error);
    }
  };

  return (
    <div className="p-4">
      {/* <button
        // onClick={handleNewAnswerClick}
        className="italic ml-4 text-xs text-blue-400 font-bold inline-flex items-center mt-2"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1" />
        <span>New Group</span>
      </button> */}
      <div className="space-y-2">
        {loading ? (
          <p>Loading...</p>
        ) : (
          Object.entries(groupedCategories).map(([groupName, groupCategories]) => (
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
                  <button
                    // onClick={handleNewAnswerClick}
                    className="italic text-xs text-green-400 font-bold inline-flex items-center mt-2"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    <span>Add Category</span>
                  </button>
                  {groupCategories.map((cat: Category) => (
                    <div key={cat._id} className="relative">
                      {renameCategoryId === cat._id ? ( // Render input field if in rename mode
                        <input
                          className="w-full mb-2"
                          type="text"
                          ref={inputRef}
                          value={cat.name}
                          onChange={handleRenameChange}
                          onBlur={handleRenameBlur}
                          onKeyPress={handleRenameKeyPress}
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
                          {cat._id === selectedCategoryId && user && (
                            <div className="absolute top-0 right-0 bottom-0">
                              <div className="options-dots rounded py-2 shadow-md bg-gray-500 px-4">
                                <FontAwesomeIcon icon={faEllipsisH} onClick={() => showMoreOptions(cat._id)} />
                              </div>
                              <OptionsDropdown
                                categoryId={cat._id}
                                isOpen={isOptionsDropdownOpen === cat._id}
                                onClose={() => hideMoreOptions()}
                                onRename={() => handleRename(cat._id)}
                                onDelete={() => handleDelete(cat._id)} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
