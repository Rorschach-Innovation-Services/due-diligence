import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMinus, faPlus, faSave } from "@fortawesome/free-solid-svg-icons";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/Delete";
import AddQuestionButton from "@/buttons/AddQuestionButton";

interface Question {
  id: string;
  title: string;
  contents: string[];
}

interface Category {
  id: string;
  name: string;
  questions: Array<Question>;
}

interface QuestionItemProps {
  question: Question;
  expandedQuestionIds: string[];
  textareaValues: { [key: string]: string[] | undefined }; // Update the type here
  setExpandedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  setTextareaValues: React.Dispatch<React.SetStateAction<{ [key: string]: string[] | undefined }>>; // Update the type here
}


interface QuestionItemProps {
  question: Question;
  expandedQuestionIds: string[];
  textareaValues: { [key: string]: string[] | undefined };
  setExpandedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  setTextareaValues: React.Dispatch<React.SetStateAction<{ [key: string]: string[] | undefined }>>;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  expandedQuestionIds,
  textareaValues,
  setExpandedQuestionIds,
  setTextareaValues,
}) => {
  const [editMode, setEditMode] = useState(false);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  const handleTextareaBlur = () => {
    setEditMode(false);

    // Update textareaValues with the latest content
    setTextareaValues((prevValues) => ({
      ...prevValues,
      [question.id]: question.contents.map((_, i) => (prevValues[question.id]?.[i] || '')),
    }));
  };

  useEffect(() => {
    console.log('textareaValues[question.id]:', textareaValues);
  }, [textareaValues]);

  return (
    <>
      {question.contents.map((content, index) => (
        
        <div key={index} className={`flex items-start justify-start mt-2 relative p-4 ${editMode ? 'bg-gray-100' : 'bg-blue-50'} border ${editMode ? 'border-gray-500' : 'border-blue-500'} rounded text-sm`} style={{ width: "100%" }}>
          <div className="mr-2 cursor-pointer" onClick={handleEditClick}>
            <EditIcon className={`text-${editMode ? 'gray' : 'blue'}-500`} />
          </div>
          <textarea
            className={`flex-1 outline-none border-none bg-transparent resize-none ${editMode ? ' focus:border-gray-500' : ''}`}
            value={(textareaValues[question.id] || [])[index] || ''}
            readOnly={!editMode || !expandedQuestionIds.includes(question.id)}
            onChange={(e) => {
              const newTextareaValues = { ...textareaValues };
              newTextareaValues[question.id] = newTextareaValues[question.id] || []; // Ensure the array exists

              // Use type assertion to tell TypeScript that the value is not undefined
              if (newTextareaValues[question.id]) {
                (newTextareaValues[question.id] as string[])[index] = e.target.value;
                setTextareaValues(newTextareaValues);
              }
            }}
            rows={expandedQuestionIds.includes(question.id) ? 3 : 1}
            style={{ marginRight: "8px" }}
            onBlur={handleTextareaBlur}
          />
          
          {expandedQuestionIds.includes(question.id) && (
            <div className="absolute top-0 right-0 mr-1 mt-1 cursor-pointer" onClick={() => handleEditClick()}>
              <DeleteIcon className="text-gray-400 hover:text-red-400" />
            </div>
          )}
        </div>
      ))}
    </>
  );
};


export default function QuestionItemList({ selectedCategory }: { selectedCategory: Category | null }) {
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);
  const [collapseAll, setCollapseAll] = useState(false);

  const [textareaValues, setTextareaValues] = useState<{ [key: string]: string[] | undefined }>({});

  // const [textareaValues, setTextareaValues] = useState<{ [key: string]: string }>({});
  const [titleValues, setTitleValues] = useState<{ [key: string]: string }>({});
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [focusedQuestion, setFocusedQuestion] = useState<string | null>(null); // Updated
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Collapse all questions when the selected category changes
    setExpandedQuestionIds([]);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      const initialValues: { [key: string]: string[] } = {};

      selectedCategory.questions.forEach((question) => {
        initialValues[question.id] = question.contents.map((content) => content);
      });



      const initialTitleValues = selectedCategory.questions.reduce((acc, question) => {
        acc[question.id] = question.title;
        return acc;
      }, {} as { [key: string]: string });

      console.log("Selected Category",selectedCategory)
      console.log("Initial Content values",initialValues)

      console.log("Initial Title values",initialTitleValues)

      setTextareaValues(initialValues);
      setTitleValues(initialTitleValues);
    }
  }, [selectedCategory]);



 


  const handleQuestionClick = (questionId: string) => {
    setExpandedQuestionIds([questionId]); // Set the expanded question ids to only the clicked question
    setFocusedQuestion(null); // Reset focused question
  };

  const handleToggleCollapseAll = () => {
    setCollapseAll(!collapseAll);
    setExpandedQuestionIds(collapseAll ? [] : selectedCategory?.questions.map((q) => q.id) || []);
    setFocusedQuestion(null); // Reset focused question
  };

  const handleEditTitleClick = (questionId: string) => {
    setFocusedQuestion(questionId); // Set the currently focused question
    setEditTitleMode(true);
  };
  useEffect(() => {
    if (editTitleMode && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editTitleMode]);

  const handleTitleInputBlur = () => {
    setEditTitleMode(false);
  };
  return (
    <div className="p-4">
      <div className="flex">
        <h2 className="text-sm text-gray-500 font-bold px-4 py-2 rounded bg-gray-200 mb-5">
          {selectedCategory ? `${selectedCategory.name}` : "Category"}
        </h2>
      </div>

      <div className="space-y-4 relative">
        {/* ... (other code) */}
        {selectedCategory?.questions.map((question: Question) => (
          <div key={question.id} className="bg-white border p-4 rounded shadow">
            <div className="flex flex-3 justify-between items-center">
              <div className="flex w-full items-start ">
                {expandedQuestionIds.includes(question.id) ? (
                  <div className="mr-2 flex w-full cursor-pointer">
                    <div className="flex w-full items-start">
                      {editTitleMode && focusedQuestion === question.id ? (
                        <div className="mr-2 flex items-center cursor-pointer">
                          <FontAwesomeIcon
                            icon={faSave} // Assuming you have an icon for the tick, you can replace "faCheck" with the actual icon you want to use
                            className="mr-2 text-blue-500"
                          // onClick={() => handleSaveTitleClick(question.id)}
                          />
                        </div>
                      ) : (
                        <div className="mr-2 cursor-pointer" onClick={() => handleEditTitleClick(question.id)}>
                          <EditIcon className={`text-gray-300 text-bold`} />
                        </div>
                      )}

                      <textarea
                        className={`w-full text-sm outline-none outline-0 bg-transparent resize-none ${editTitleMode && focusedQuestion === question.id ? 'border-green-500 border-1' : ''
                          }`}
                        value={titleValues[question.id] || ""}
                        readOnly={!editTitleMode || !expandedQuestionIds.includes(question.id)}
                        onChange={(e) => {
                          setTitleValues((prevValues) => ({
                            ...prevValues,
                            [question.id]: e.target.value,
                          }));
                        }}
                        ref={textareaRef}
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
              {expandedQuestionIds.includes(question.id) ? (
                <FontAwesomeIcon
                  icon={faMinus}
                  className="text-gray-400 cursor-pointer"
                  onClick={() => handleQuestionClick(question.id)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPlus}
                  className="text-gray-400 cursor-pointer"
                  onClick={() => handleQuestionClick(question.id)}
                />
              )}
            </div>
            {expandedQuestionIds.includes(question.id) && (
              <QuestionItem
                question={question}
                expandedQuestionIds={expandedQuestionIds}
                textareaValues={textareaValues}
                setExpandedQuestionIds={setExpandedQuestionIds}
                setTextareaValues={setTextareaValues}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}






// Expand Multiple:

 // const handleQuestionClick = (questionId: string) => {
  //   setExpandedQuestionIds((prevIds) => {
  //     if (prevIds.includes(questionId)) {
  //       return prevIds.filter((id) => id !== questionId);
  //     } else {
  //       return [...prevIds, questionId];
  //     }
  //   });
  //   setFocusedQuestion(null); // Reset focused question
  // };