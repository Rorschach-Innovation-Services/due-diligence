// components/AddQuestionButton.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PlusIcon } from "@/icons/PlusIcon";

interface AddQuestionButtonProps {
    onClick: () => void;
}

const AddQuestionButton: React.FC<AddQuestionButtonProps> = ({ onClick }) => {
    return (
        <div
            className="flex inline-block items-center cursor-pointer hover:text-blue-600 focus:outline-none focus:ring focus:border-blue-300 my-4"
            onClick={onClick}
            style={{ fontStyle: "italic", color: "blue" }}
        >
            <PlusIcon className="mr-2" />
            <p
                className="italic"
                style={{ color: "blue" }}
            >
                Add Question
            </p>
        </div>
    );
};

export default AddQuestionButton;
