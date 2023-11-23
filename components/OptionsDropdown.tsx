// components/OptionsDropdown.tsx
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPencilAlt, faTrash, faShare } from "@fortawesome/free-solid-svg-icons";
import { DeleteIcon } from "@/icons/Delete";

interface OptionsDropdownProps {
  categoryId: string;
  isOpen: boolean;
  onClose: () => void;
  onRename: () => void;
}

const OptionsDropdown = ({ categoryId, isOpen, onClose, onRename }: OptionsDropdownProps) => {

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log("Click outside");
      const target = event.target as HTMLElement;

      if (!target.closest(".options-dropdown") && !target.closest(".options-dots")) {
        onClose();
      }
    };

    if (isOpen) {
      console.log("Adding event listener");
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      console.log("Removing event listener");
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="options-dropdown absolute top-0 right-0 mt-2 mr-2 z-30 divide-gray-100 rounded-lg shadow w-44 bg-gray-700" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col bg-gray-800 border rounded shadow">
        <div
          className="flex block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            onRename(); // Trigger renaming
            onClose();
          }}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="text-md text-white mr-2" />
          <p className="text-md">Rename</p>
        </div>
        <div
          className="flex block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => {
            onClose();
          }}
        >
          <DeleteIcon className="text-md text-red-500 mr-2"/>
          <p className="text-md text-red-500">Delete questions</p>
        </div>
      </div>
    </div>
  );
};

export default OptionsDropdown;