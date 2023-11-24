'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromGroundWater, faEdit, faEye, faEyeSlash, faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { DeleteIcon } from "@/icons/Delete";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { appEditMode } from "@/lib/storage";
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
  onUpdateQuestion: (questionId: string) => void;
  onAddNewAnswer: (questionId: string) => void;
  onDeleteContent: (questionId: string, contentIndex: number) => void;
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
  onUpdateQuestion,
  onAddNewAnswer,
  onDeleteContent,
}) => {

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user, error, isLoading } = useUser();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link', 'image'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // ['blockquote', 'code-block'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'link', 'image',
    'list', 'bullet',
    // 'blockquote', 'code-block',
    'script', 'sub', 'script', 'super'
  ];

  const handleDeleteClick = async () => {
    // Call the passed function to handle the deletion
    onDeleteQuestion(question._id);
  };

  const handleContentDeleteClick = async (contentIndex: number) => {
    // Call the passed function to handle the deletion
    onDeleteContent(question._id, contentIndex);
  };

  const handleUpdateClick = async () => {
    // Call the passed function to handle the deletion
    onUpdateQuestion(question._id);
  };

  const handleNewAnswerClick = async () => {
    // Call the passed function to handle the deletion
    onAddNewAnswer(question._id);
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

      {question.contents.map((content, index) => (
        <div
          key={index}
          className={`mb-3 flex items-start justify-start mt-2 relative p-0 border-blue-500 ${appEditMode() ? "bg-gray-100" : "bg-blue-50"} border
            } rounded text-sm`}
          style={{ width: "100%" }}
        >
          {appEditMode() ? (
            <>
              <ReactQuill
                theme="snow"
                value={(textareaValues[question._id] || [])[index] || ""}
                onChange={(newContent) => {
                  const newTextareaValues = { ...textareaValues };
                  newTextareaValues[question._id] = newTextareaValues[question._id] || [];

                  const currentTextareaValues = newTextareaValues[question._id];
                  if (currentTextareaValues) {
                    currentTextareaValues[index] = newContent;
                    setTextareaValues(newTextareaValues);
                  }
                }}
                modules={modules}
                formats={formats}
                placeholder="Add answer..."
                style={{ height: '100%', width: "100%", fontSize: '14px' }}
              />
              {user &&(
                <div onClick={() => handleContentDeleteClick(index)} className="absolute top-0 right-0 mr-1 mt-1 cursor-pointer">
                <DeleteIcon className="text-gray-400 hover:text-red-400" />
              </div>
              )

              }
            </>
          ) : (
            <>
              <div className="p-4" dangerouslySetInnerHTML={{ __html: (textareaValues[question._id] || [])[index] || "no text..." }} />
            </>
          )}


        </div>
      ))}

      {appEditMode() &&
        <>
          <button
            onClick={handleNewAnswerClick}
            className="italic text-xs text-blue-400 font-bold inline-flex items-center mt-2"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            <span>New Answer</span>
          </button>
          <div className="w-full flex justify-end">
            <button onClick={handleUpdateClick} className="mr-2 hover:bg-green-400 hover:text-white text-sm text-green-500 bg-white font-bold py-1 px-2 rounded border-solid border-2 border-green-500 inline-flex items-center">
              <span>Save Changes</span>
            </button>
            <button onClick={handleDeleteClick} className="hover:bg-red-400 hover:text-white text-sm text-red-500 bg-white font-bold py-1 px-2 rounded border-solid border-2 border-red-500 inline-flex items-center">
              <DeleteIcon className="mr-2" />
              <span>Delete Question</span>
            </button>
          </div>
        </>
      }
    </>
  );
};

export default QuestionItem;