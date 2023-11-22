import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/Delete";
import AddQuestionButton from "@/buttons/AddQuestionButton";
import AddAnswerButton from "@/buttons/AddAnswerButton";
import $ from 'jquery';

interface Question {
  _id: string;
  title: string;
  contents: string[];
}

interface QuestionItemProps {
  question: Question;
  expandedQuestionIds: string[];
  textareaValues: { [key: string]: string[] | undefined };
  setExpandedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  setTextareaValues: React.Dispatch<React.SetStateAction<{ [key: string]: string[] | undefined }>>;
  contentEditMode: { [key: string]: number | null };
  setContentEditMode: React.Dispatch<React.SetStateAction<{ [key: string]: number | null }>>;
  onDeleteQuestion: (questionId: string) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  expandedQuestionIds,
  textareaValues,
  setExpandedQuestionIds,
  setTextareaValues,
  contentEditMode,
  setContentEditMode,
  onDeleteQuestion,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleUniversalEditClick = () => {
    // Toggle edit mode for title and all content items in the current question
    setContentEditMode((prevEditModes) => {
      const currentEditMode = prevEditModes[question._id];
      const newEditModes = {
        ...prevEditModes,
        [question._id]: currentEditMode === null ? 0 : null, // Toggle between null and 0
      };

      return newEditModes;
    });
  };

  const handleDeleteClick = async () => {
    // Call the passed function to handle the deletion
    onDeleteQuestion(question._id);
  };

  const handleTextareaBlur = () => {
    // Update textareaValues with the latest content
    setTextareaValues((prevValues) => ({
      ...prevValues,
      [question._id]: question.contents.map((_, i) => (prevValues[question._id]?.[i] || "")),
    }));
  };

  useEffect(() => {
    // Focus on the textarea when entering edit mode
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [contentEditMode, question._id]);

  return (
    <>
      <button onClick={handleUniversalEditClick} className="italic text-xs text-blue-400 font-bold inline-flex items-center mb-2">
        <FontAwesomeIcon icon={faPlus} className="mr-1" />
        <span>Edit All</span>
      </button>

      {question.contents.map((content, index) => (
        <div
          key={index}
          className={`flex items-start justify-start mt-2 relative p-4 ${contentEditMode[question._id] === index ? "bg-gray-100" : "bg-blue-50"
            } border ${contentEditMode[question._id] === index ? "border-gray-500" : "border-blue-500"
            } rounded text-sm`}
          style={{ width: "100%" }}
        >
          <div className="mr-2 cursor-pointer">
            <EditIcon className={`text-${contentEditMode[question._id] === index ? "gray" : "blue"}-500`} />
          </div>
          <textarea
            ref={textareaRef}
            className={`flex-1 outline-none border-none bg-transparent resize-none ${contentEditMode[question._id] === index ? " focus:border-gray-500" : ""
              }`}
            value={(textareaValues[question._id] || [])[index] || ""}
            readOnly={contentEditMode[question._id] === null}
            onChange={(e) => {
              const newTextareaValues = { ...textareaValues };
              newTextareaValues[question._id] = newTextareaValues[question._id] || [];

              if (newTextareaValues[question._id]) {
                (newTextareaValues[question._id] as string[])[index] = e.target.value;
                setTextareaValues(newTextareaValues);
              }
            }}
            rows={expandedQuestionIds.includes(question._id) ? 3 : 1}
            style={{ marginRight: "8px" }}
            onBlur={handleTextareaBlur}
          />
        </div>
      ))}

      <button
        onClick={() => {
          
        }}
        className="italic text-xs text-blue-400 font-bold inline-flex items-center mt-2"
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1" />
        <span>New Answer</span>
      </button>

      <div className="w-full flex justify-end">
        <button onClick={handleDeleteClick} className="hover:bg-red-400 hover:text-white text-sm text-red-500 bg-white font-bold py-1 px-2 rounded border-solid border-2 border-red-500 inline-flex items-center">
          <DeleteIcon className="mr-2" />
          <span>Delete Question</span>
        </button>
      </div>
    </>
  );
};

export default QuestionItem;
