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
  onCategoryNameChange: (selectedCategoryName: any) => void;
}

export default function QuestionCategoryList({ onCategoryChange, onCategoryNameChange }: QuestionCategoryListProps) {
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
  const [categoryEditName, setCategoryEditName] = useState<string | null>(null);
  const [categoryInEdit, setCategoryInEdit] = useState<Category | null>(null);


  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleRename = (categoryId: string) => {
    const categoryToEdit = categories.find((cat) => cat._id === categoryId);
    if (categoryToEdit) {
      setCategoryInEdit(categoryToEdit);
      setRenameCategoryId(categoryId);
    }
  };

  const handleRenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value directly, not the state
    setCategoryInEdit((prevCategory: Category | null) => ({
      ...prevCategory!,
      name: event.target.value,
      _id: prevCategory?._id || '', // Ensure _id is a string
    }));

  };


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

  const handleFinishRename = async () => {
    // Save updated name to the database
    if (categoryInEdit && categoryInEdit.name) {
      try {
        const categoryId = categoryInEdit._id;

        // Save the updated category to the database
        await handleUpdateCategory(categoryId, categoryInEdit.name); // Pass the updated name

        // Update the category in the state
        setCategories((prevCategories) =>
          prevCategories.map((cat) => (cat._id === categoryId ? categoryInEdit : cat))
        );

        console.log("Cat EDIT:", categoryInEdit.name)
        onCategoryNameChange(categoryInEdit.name)
        // if (categoryInEdit.name) {
        localStorage.setItem("selectedCategoryName", categoryInEdit.name);
        // }

        console.log("selectedCategory===", categoryInEdit.name, "===" ,localStorage.getItem("selectedCategoryName"))


        setRenameCategoryId(null);
      } catch (error) {
        console.error('Error finishing rename:', error);
      } finally {
        setCategoryInEdit(null);
        loadGroupedCategories(); // Fetch data after the update is completed
      }
    }
  };


  useEffect(() => {
    fetchData();
  }, []);



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
    // selectedCategory.name = localStorage.getItem("selectedCategoryName")

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

  const loadGroupedCategories = async () => {
    setLoading(true);
    const categoriesData = await fetch("/api/categories");
    const data = await categoriesData.json();
    console.log("Category data INIT:", data.categories)
    const grouped = await groupCategories(data.categories);
    setGroupedCategories(grouped);
    setLoading(false);
  };
  useEffect(() => {


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

  // const handleRenameKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (event.key === 'Enter') {
  //     await handleUpdateCategory(renameCategoryId!);
  //     setRenameCategoryId(null);
  //     setIsEditing(null); // Clear editing state after updating
  //   }
  // };

  const handleUpdateCategory = async (categoryId: string, newName: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/categories?categoryId=${categoryId}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the response includes the updated category data
        const updatedCategory = data.updatedCategory;

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
                <div className="text-xs opacity-50 text-blue-400 font-bold py-2">{groupName.toUpperCase()}</div>
                <FontAwesomeIcon className="ml-2 text-sm opacity-25 text-gray-100 font-bold" icon={expandedGroups[groupName] ? faChevronUp : faChevronDown} />
              </div>


              {/* Render categories within the group, conditionally based on group's expanded state */}
              {expandedGroups[groupName] && (
                <div className="ml-4">
                  <button
                    // onClick={handleNewAnswerClick}
                    className="italic text-xs opacity-50 text-green-400 font-bold inline-flex items-center mt-2"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-1" />
                    <span>Add Category</span>
                  </button>
                  {groupCategories.map((cat: Category) => (
                    <div key={cat._id} className="relative">
                      {renameCategoryId === cat._id ? (
                        <input
                          className="w-full mb-2"
                          type="text"
                          ref={inputRef}
                          value={categoryInEdit?.name || ''}
                          onChange={(e) => handleRenameChange(e)}
                          onBlur={handleRenameBlur}
                          onKeyPress={(e) => e.key === 'Enter' && handleFinishRename()} // Handle Enter key press
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
function loadCategoriesData() {
  throw new Error('Function not implemented.');
}

