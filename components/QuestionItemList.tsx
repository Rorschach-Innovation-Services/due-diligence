import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
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
  onDeleteQuestion: (questionId: string) => void; // Added prop for handling question deletion
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  expandedQuestionIds,
  textareaValues,
  setExpandedQuestionIds,
  setTextareaValues,
  contentEditMode,
  setContentEditMode,
  onDeleteQuestion, // Added prop for handling question deletion

}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditClick = (contentIndex: number) => {
    setContentEditMode((prevEditModes) => {
      const currentEditMode = prevEditModes[question._id];

      // Toggle edit mode for the clicked content
      const newEditModes = {
        ...prevEditModes,
        [question._id]: currentEditMode === contentIndex ? null : contentIndex,
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
    if (textareaRef.current && contentEditMode[question._id] !== null) {
      textareaRef.current.focus();
    }
  }, [contentEditMode, question._id]);



  return (
    <>
      {question.contents.map((content, index) => (
        <div
          key={index}
          className={`flex items-start justify-start mt-2 relative p-4 ${contentEditMode[question._id] === index ? "bg-gray-100" : "bg-blue-50"
            } border ${contentEditMode[question._id] === index ? "border-gray-500" : "border-blue-500"
            } rounded text-sm`}
          style={{ width: "100%" }}
        >
          <div className="mr-2 cursor-pointer" onClick={() => handleEditClick(index)}>
            <EditIcon className={`text-${contentEditMode[question._id] === index ? "gray" : "blue"}-500`} />
          </div>
          <textarea
            ref={textareaRef}
            className={`flex-1 outline-none border-none bg-transparent resize-none ${contentEditMode[question._id] === index ? " focus:border-gray-500" : ""
              }`}
            value={(textareaValues[question._id] || [])[index] || ""}
            readOnly={
              contentEditMode[question._id] !== index
            }
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
          {expandedQuestionIds.includes(question._id) && (
            <div className="absolute top-0 right-0 mr-1 mt-1 cursor-pointer" onClick={() => handleEditClick(index)}>
              <DeleteIcon className="text-gray-400 hover:text-red-400" />
            </div>
          )}
        </div>
      ))}
      <button className="italic text-xs text-blue-400 font-bold inline-flex items-center">
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

interface Category {
  _id: string;
  name: string;
  questions: Array<Question>;
}

function QuestionItemList({ selectedCategory }: { selectedCategory: Category | null }) {
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);
  const [collapseAll, setCollapseAll] = useState(false);
  const [textareaValues, setTextareaValues] = useState<{ [key: string]: string[] | undefined }>({});
  const [titleValues, setTitleValues] = useState<{ [key: string]: string }>({});
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [focusedQuestion, setFocusedQuestion] = useState<string | null>(null);
  const [contentEditMode, setContentEditMode] = useState<{ [key: string]: number | null }>({});
  const [questionsFromDb, setQuestionsFromDb] = useState<Array<Question>>([]);
  const [newQuestion, setNewQuestion] = useState("");




  useEffect(() => {
    // Fetch questions from the database based on the selected category's id
    const fetchQuestions = async () => {
      try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?id=${selectedCategory?._id}&sort={_id: -1}`);
        const data = await response.json();

        console.log("SOrted Qs", data)


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

      // console.log("Questions from Database", questionsFromDb);
      // console.log("Initial Content values", initialValues);
      // console.log("Initial Title values", initialTitleValues);

      setTextareaValues(initialValues);
      setTitleValues(initialTitleValues);
    }
  }, [questionsFromDb]);


  const handleQuestionClick = (questionId: string) => {
    setExpandedQuestionIds((prevIds) => {
      if (prevIds.includes(questionId)) {
        // If the clicked question is already expanded, collapse it
        return [];
      } else {
        // If the clicked question is not expanded, collapse all others and expand it
        return [questionId];
      }
    });
    setFocusedQuestion(null); // Reset focused question
  };

  const handleToggleCollapseAll = () => {
    setCollapseAll(!collapseAll);
    setExpandedQuestionIds(collapseAll ? [] : questionsFromDb.map((q) => q._id) || []);
    setFocusedQuestion(null); // Reset focused question
  };

  const handleEditTitleClick = (questionId: string) => {
    setFocusedQuestion(questionId); // Set the currently focused question
    setEditTitleMode(true);
  };

  const handleTitleInputBlur = () => {
    setEditTitleMode(false);
  };

  const handleNewQuestionClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();


        console.log("AFter Adding:", data);
        const newQuestion = data.newQuestion;
        if (newQuestion) {
          // Update the state with the new question
          setQuestionsFromDb((prevQuestions) => [...prevQuestions, newQuestion]);
          setExpandedQuestionIds((prevIds) => [...prevIds, newQuestion._id]);

          console.log("Lastedited =", newQuestion.lastedited);
          
        //   {
        //     "id": "none",
        //     "title": "",
        //     "contents": [],
        //     "lastedited": 1700593198440
        // }

          const newQUestionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}`, {
            method: 'GET',
          });
          console.log("Question data =", newQUestionResponse);
          
          if (newQUestionResponse.ok) {
            const info = await newQUestionResponse.json();
            // console.log("Question data =", info);
            
            // console.log("New ID", newQuestion.lastedited)
            setNewQuestion(newQuestion.lastedited);
          }
          
          // You may also handle other state updates or UI changes as needed
        } else {
          console.error('Invalid response format:', data);
        }

        // You may also handle other state updates or UI changes as needed
      } else {
        console.error('Failed to create a new question:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating a new question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    console.log("Delete ID", newQuestion)

    
    try {

      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}&questionId=${questionId}`
      if (newQuestion){
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions?categoryId=${selectedCategory?._id}&lastedited=${newQuestion}`
      }

      console.log(url)
      const response = await fetch( url, {
        method: 'DELETE',
      });

      console.log("resp = ", response)

      if (response.ok) {
        const data = await response.json();

        // Assuming the response includes the updated category data
        const updatedCategory = data.updatedCategory;

        console.log("AFter Delete:", data);

        // Update the state with the updated category data
        setQuestionsFromDb(updatedCategory.questions);
        setExpandedQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));

        setNewQuestion("") // reset the state after delete;

      } else {
        console.error('Failed to delete the question:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting the question:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex">
        <h2 className="text-l text-blue-900 font-bold px-4 py-2 rounded bg-blue-100 mb-5" style={{ width: "100%" }}>
          {selectedCategory ? `${selectedCategory.name}` : "Category"}
        </h2>
      </div>

      <div className="space-y-4 relative">
        <button onClick={handleNewQuestionClick} className="bg-gray-300 hover:bg-gray-400 text-sm text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          <span>New Question</span>
        </button>
        {questionsFromDb.slice()
          .sort((a, b) => b._id.localeCompare(a._id))
          .map((question: Question) => (
            <div key={question._id} className="bg-white border p-4 rounded shadow">
              <div className="flex flex-3 justify-between items-center">
                <div className="flex w-full items-start ">
                  {expandedQuestionIds.includes(question._id) ? (
                    <div className="mr-2 flex w-full cursor-pointer">
                      <div className="flex w-full items-start">
                        {editTitleMode && focusedQuestion === question._id ? (
                          <div className="mr-2 flex items-center cursor-pointer">
                            <FontAwesomeIcon icon={faSave} className="mr-2 text-blue-500" />
                          </div>
                        ) : (
                          <div className="mr-2 cursor-pointer" onClick={() => handleEditTitleClick(question._id)}>
                            <EditIcon className={`text-gray-300 text-bold`} />
                          </div>
                        )}

                        <textarea
                          className={`w-full text-sm outline-none outline-0 bg-transparent resize-none ${editTitleMode && focusedQuestion === question._id ? "border-green-500 border-1" : ""
                            }`}
                          value={titleValues[question._id] || ""}
                          readOnly={!editTitleMode || !expandedQuestionIds.includes(question._id)}
                          onChange={(e) => {
                            setTitleValues((prevValues) => ({
                              ...prevValues,
                              [question._id]: e.target.value,
                            }));
                          }}
                          rows={3}
                          style={{ marginRight: "8px" }}
                          onBlur={handleTitleInputBlur}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm">{question.title}</p>
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
                  onDeleteQuestion={handleDeleteQuestion} // Pass the deletion handler
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default QuestionItemList;
