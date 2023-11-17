// components/OptionsDropdown.tsx
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faPencilAlt, faTrash, faShare } from "@fortawesome/free-solid-svg-icons";

interface OptionsDropdownProps {
  categoryId: string;
  isOpen: boolean;
  onOptionClick: (option: string, categoryId: string) => void;
  onClose: () => void;
}

const OptionsDropdown = ({ categoryId, isOpen, onOptionClick, onClose }: OptionsDropdownProps) => {
  const handleOptionClick = (option: string) => {
    onOptionClick(option, categoryId);
    onClose(); // Close the options after clicking an option
  };

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
    <div className="options-dropdown absolute top-0 right-0 mt-2 mr-2 z-30" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col bg-white border rounded shadow">
        <div
          className="hover:bg-gray-200 p-2 rounded cursor-pointer"
          onClick={() => handleOptionClick("Share")}
        >
          <FontAwesomeIcon icon={faShare} className="text-gray-500 mr-2" />
          Share
        </div>
        <div
          className="hover:bg-gray-200 p-2 rounded cursor-pointer"
          onClick={() => handleOptionClick("Rename")}
        >
          <FontAwesomeIcon icon={faPencilAlt} className="text-gray-500 mr-2" />
          Rename
        </div>
        <div
          className="hover:bg-gray-200 p-2 rounded cursor-pointer"
          onClick={() => handleOptionClick("Edit")}
        >
          <FontAwesomeIcon icon={faEllipsisH} className="text-gray-500 mr-2" />
          Edit
        </div>
      </div>
    </div>
  );
};

export default OptionsDropdown;
