'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import 'react-quill/dist/quill.snow.css';
import { appEditMode } from "@/lib/storage";
import QuestionItem from "./Answers";
import { EditIcon } from "@/icons/EditIcon";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { DeleteIcon } from "@/icons/Delete";

interface Question {
  _id: string;
  title: string;
  contents: string[];
}

interface QuestionItemProps {
  // question: Question;
  // expandedQuestionIds: string[];
  // textareaValues: { [key: string]: string[] | undefined };
  // setExpandedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  // setTextareaValues: React.Dispatch<React.SetStateAction<{ [key: string]: string[] | undefined }>>;
  // contentEditMode: { [key: string]: number | null };
  // setContentEditMode: React.Dispatch<React.SetStateAction<{ [key: string]: number | null }>>;
  // onDeleteQuestion: (questionId: string) => void;
  // onUpdateQuestion: (questionId: string) => void;
  // onAddNewAnswer: (questionId: string) => void;
  // onDeleteContent: (questionId: string, contentIndex: number) => void;
  selectedCategory: Category | null;
  selectedCategoryName: string | null
}

interface Category {
  _id: string;
  name: string;
  questions: Array<Question>;
}

function QuestionItemList({ selectedCategory, selectedCategoryName }: QuestionItemProps) {
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);
  const [textareaValues, setTextareaValues] = useState<{ [key: string]: string[] | undefined }>({});
  const [titleValues, setTitleValues] = useState<{ [key: string]: string }>({});
  const [focusedQuestion, setFocusedQuestion] = useState<string | null>(null);
  const [contentEditMode, setContentEditMode] = useState<{ [key: string]: number | null }>({});
  const [questionsFromDb, setQuestionsFromDb] = useState<Array<Question>>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [editMode, setEditMode] = useState(false);
  const { user, error, isLoading } = useUser();
  
  
  
  const [localStorageCategoryName, setLocalStorageCategoryName] = useState<string | null>(
    localStorage.getItem("selectedCategoryName")
  );

  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  if (selectedCategory && selectedCategoryName ) {
    localStorage.setItem("selectedCategoryName", selectedCategoryName)
    // setLocalStorageCategoryName(selectedCategoryName)
  }

  const modules = {
    toolbar: [
      // [{ 'header': [1, 2, 3, 4, false] }],
      ['bold', 'italic'],
      // ['link', 'image'],
      // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      // ['blockquote', 'code-block'],
      // [{ 'script': 'sub' }, { 'script': 'super' }],
    ],
  };

  const formats = [
    // 'header',
    'bold', 'italic',
    // 'link', 'image',
    // 'list', 'bullet',
    // 'blockquote', 'code-block',
    // 'script', 'sub', 'script', 'super'
  ];

  const handleEditAllClick = () => {
    // Enable editing on all textareas, including the question title
    setContentEditMode((prevEditMode) => {
      const newEditMode: { [key: string]: number | null } = {};

      Object.keys(textareaValues).forEach((questionId) => {
        newEditMode[questionId] = prevEditMode[questionId] !== null ? null : 0;
      });

      // Toggle edit mode for the question title
      newEditMode.title = prevEditMode.title !== null ? null : 0;

      return newEditMode;
    });
    // setEditMode(!editMode);

    const updatedEditMode = !appEditMode();
    localStorage.setItem('editMode', JSON.stringify(updatedEditMode)); // Save to local storage
    // setFocusedQuestion(null);
    console.log("MODE:", updatedEditMode)
    // Set the currently focused question to null to reset the focus
    setFocusedQuestion(null);
  };

  useEffect(() => {
    // Fetch questions from the database based on the selected category's id
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?id=${selectedCategory?._id}&sort={_id: -1}`);
        const data = await response.json();

        console.log("Sorted Qs", data);

        // Assuming the data structure is similar to what you provided in the Postman response
        setQuestionsFromDb(data?.category?.questions || []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    if (selectedCategory?._id) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Collapse all questions when the selected category changes
    setExpandedQuestionIds([]);
  }, [selectedCategory]);

  useEffect(() => {
    if (questionsFromDb.length > 0) {
      const initialValues: { [key: string]: string[] } = {};

      questionsFromDb.forEach((question) => {
        initialValues[question._id] = question.contents.map((content) => content);
      });

      const initialTitleValues = questionsFromDb.reduce((acc, question) => {
        acc[question._id] = question.title;
        return acc;
      }, {} as { [key: string]: string });

      const storedExpandedQuestionIds = localStorage.getItem('expandedQuestionIds');
      if (storedExpandedQuestionIds) {
        setExpandedQuestionIds(JSON.parse(storedExpandedQuestionIds));
      } else {
        setExpandedQuestionIds([]);
      }

      setTextareaValues(initialValues);
      setTitleValues(initialTitleValues);
    }
  }, [questionsFromDb]);
  

  const handleQuestionClick = (questionId: string) => {
    setExpandedQuestionIds((prevIds) => {
      const newIds = prevIds.includes(questionId) ? [] : [questionId];
      localStorage.setItem('expandedQuestionIds', JSON.stringify(newIds));
      return newIds;
    });

    setFocusedQuestion(questionId);
  };

  const handleNewQuestionClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("RESponse:", response)

      if (response.ok) {
        const data = await response.json();

        console.log("After Adding:", data);
        const newQuestion = data.newQuestion;
        if (newQuestion) {
          // Update the state with the new question
          setQuestionsFromDb((prevQuestions) => [...prevQuestions, newQuestion]);
          setExpandedQuestionIds((prevIds) => [...prevIds, newQuestion._id]);

          console.log("Lastedited =", newQuestion.lastedited);

          const newQuestionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}`, {
            method: 'GET',
          });

          console.log("Question data =", newQuestionResponse);

          if (newQuestionResponse.ok) {
            const info = await newQuestionResponse.json();
            setNewQuestion(newQuestion.lastedited);
          }
        } else {
          console.error('Invalid response format:', data);
        }
      } else {
        console.error('Failed to create a new question:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating a new question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}&questionId=${questionId}`;
      if (newQuestion) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}&lastedited=${newQuestion}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the response includes the updated category data
        const updatedCategory = data.updatedCategory;

        console.log("After Delete:", data);

        // Update the state with the updated category data
        setQuestionsFromDb(updatedCategory.questions);
        setExpandedQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));

        setNewQuestion(""); // reset the state after delete;
      } else {
        console.error('Failed to delete the question:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting the question:', error);
    }
  };
  const handleUpdateQuestion = async (questionId: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}&questionId=${questionId}`;
      if (newQuestion) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}&lastedited=${newQuestion}`;
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleValues[questionId],
          contents: textareaValues[questionId] || [],
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the response includes the updated category data
        const updatedCategory = data.updatedCategory;

        console.log("After PUT:", data);

        // Update the state with the updated category data
        setQuestionsFromDb(updatedCategory.questions);
        setExpandedQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));

        setNewQuestion(""); // reset the state after delete;
      } else {
        console.error('Failed to update the question:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating the question:', error);
    }
  };

  const handleNewAnswer = async (questionId: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/answer?categoryId=${selectedCategory?._id}&questionId=${questionId}`;
      if (newQuestion) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/answer?categoryId=${selectedCategory?._id}&lastedited=${newQuestion}`;
      }
      const response = await fetch(url, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();

        console.log("DATA: ====", data)

        // Assuming the response includes the updated category data
        const updatedCategory = data.updatedCategory;

        console.log("After answer POST:", data);

        // Update the state with the updated category data
        setQuestionsFromDb(updatedCategory.questions);
        setExpandedQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));

        setNewQuestion(""); // reset the state after delete;
      } else {
        console.error('Failed to add new answer:', response.statusText);
      }
    } catch (error) {
      console.error('Error Adding new answer', error);
    }
  };

  const handleDeleteContent = async (questionId: string, contentIndex: number) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/answer?categoryId=${selectedCategory?._id}&questionId=${questionId}&contentIndex=${contentIndex}`;
      if (newQuestion) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/answer?categoryId=${selectedCategory?._id}&lastedited=${newQuestion}&questionId=${questionId}&contentIndex=${contentIndex}`;
      }

      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the response includes the updated question data
        const updatedQuestion = data.updatedCategory;

        setQuestionsFromDb(updatedQuestion.questions);
        setExpandedQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));

        setNewQuestion(""); // reset the state after delete;
      } else {
        console.error('Failed to delete the question content:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting the question content:', error);
    }
  };

  console.log("selectedCategoryName in QUestion:", selectedCategoryName);
  return (
    <div className="relative p-4 pt-0">
      {user && (
        <>
          <button onClick={handleEditAllClick} className={`mb-4 italic text-sm text-${appEditMode() ? "red" : "blue"}-400 font-bold inline-flex items-center`}>
            <FontAwesomeIcon className="mr-1" icon={appEditMode() ? faEyeSlash : faEye} />
            <span>{appEditMode() ? "Disable Edit" : "Enable Edit"}</span>
          </button>


          <div className="flex justify-end align-center mt-5 mb-5">
            <button onClick={handleNewQuestionClick} className=" bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>New Question</span>
            </button>
          </div>
        </>
      )
      }
      <div className="flex">
        <h2 className="text-l text-blue-900 font-bold px-4 py-2 rounded bg-blue-100 mb-5" style={{ width: "100%" }}>
          {selectedCategory ? `${localStorage.getItem("selectedCategoryName")}` : "Category"}
        </h2>
      </div>
      <div className="space-y-4 relative">
        {questionsFromDb.slice()
          .sort((a, b) => b._id.localeCompare(a._id))
          .map((question: Question) => (
            <div key={question._id} className="bg-white border p-4 rounded shadow">
              <div className="flex flex-3 justify-between items-center">
                <div className="flex w-full items-start ">
                  {expandedQuestionIds.includes(question._id) ? (
                    <div className="mr-2 flex w-full cursor-pointer">
                      <div className="flex w-full items-start">
                        {appEditMode() ? (<textarea
                          placeholder="Please enter the question..."
                          className={`w-full text-sm outline-none outline-0 bg-transparent resize-none ${appEditMode() ? "border-green-500 border-1" : ""
                            }`}
                          value={titleValues[question._id] || ""}
                          readOnly={!appEditMode()}
                          onChange={(e) => {
                            setTitleValues((prevValues) => ({
                              ...prevValues,
                              [question._id]: e.target.value,
                            }));
                          }}
                          rows={3}
                          style={{ marginRight: "8px" }}
                        // onBlur={handleTitleInputBlur}
                        />)
                          : (<p onClick={() => handleQuestionClick(question._id)} className="mb-2 cursor-pointer w-full text-sm">{question.title}</p>)}
                      </div>
                    </div>
                  ) : (
                    <p onClick={() => handleQuestionClick(question._id)} className="cursor-pointer w-full text-sm">{question.title}</p>
                  )}
                </div>
                {expandedQuestionIds.includes(question._id) ? (
                  <FontAwesomeIcon
                    icon={faMinus}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleQuestionClick(question._id)}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faPlus}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleQuestionClick(question._id)}
                  />
                )}
              </div>
              {expandedQuestionIds.includes(question._id) && (
                <QuestionItem
                  key={question.title}
                  question={question}
                  expandedQuestionIds={expandedQuestionIds}
                  textareaValues={textareaValues}
                  setExpandedQuestionIds={setExpandedQuestionIds}
                  setTextareaValues={setTextareaValues}
                  contentEditMode={contentEditMode}
                  setContentEditMode={setContentEditMode}
                  onDeleteQuestion={handleDeleteQuestion}
                  onUpdateQuestion={handleUpdateQuestion}
                  onAddNewAnswer={handleNewAnswer}
                  onDeleteContent={handleDeleteContent}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default QuestionItemList;