// components/AddQuestionButton.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PlusIcon } from "@/icons/PlusIcon";

interface AddQuestionButtonProps {
    onClick: () => void;
}

const AddAnswerButton: React.FC<AddQuestionButtonProps> = ({ onClick }) => {
    return (
        <div
            className="flex inline-block items-center text-xs cursor-pointer hover:text-blue-300 focus:outline-none focus:ring focus:border-blue-300 my-4"
            onClick={onClick}
            style={{ fontStyle: "italic", alignSelf:"right"}}
        >
            <PlusIcon className="mr-1 text-xs text-blue-300" />
            <p
                className="italic text-blue-300"
                // style={{ color: "blue" }}
            >
                New Answer
            </p>
        </div>
    );
};

export default AddAnswerButton;
