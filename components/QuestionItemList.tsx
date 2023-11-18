import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/Delete";
import AddQuestionButton from "@/buttons/AddQuestionButton";

interface Question {
  id: string;
  title: string;
  content: string;
}

interface Category {
  id: string;
  name: string;
  questions: Array<Question>;
}

interface QuestionItemProps {
  question: Question;
  expandedQuestionIds: string[];
  textareaValues: { [key: string]: string };
  setExpandedQuestionIds: React.Dispatch<React.SetStateAction<string[]>>;
  setTextareaValues: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  expandedQuestionIds,
  textareaValues,
  setExpandedQuestionIds,
  setTextareaValues,
}) => {
  const [editMode, setEditMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditClick = () => {
    setEditMode(!editMode);
  };

  useEffect(() => {
    if (editMode && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [editMode]);

  const handleTextareaBlur = () => {
    setEditMode(false);
  };

  return (
    <div className={`flex items-start justify-start mt-2 relative p-4 ${editMode ? 'bg-green-50' : 'bg-blue-50'} border ${editMode ? 'border-green-500' : 'border-blue-500'} rounded text-sm`} style={{ width: "100%" }}>
      <div className="mr-2 cursor-pointer" onClick={handleEditClick}>
        <EditIcon className={`text-${editMode ? 'gray' : 'blue'}-500`} />
      </div>
      <textarea
        ref={textareaRef}
        className={`flex-1 outline-none border-none bg-transparent resize-none ${editMode ? 'focus:ring focus:border-green-300' : ''}`}
        value={textareaValues[question.id] || ""}
        readOnly={!editMode || !expandedQuestionIds.includes(question.id)}
        onChange={(e) => setTextareaValues((prevValues) => ({ ...prevValues, [question.id]: e.target.value }))}
        rows={expandedQuestionIds.includes(question.id) ? 3 : 1}
        style={{ marginRight: "8px" }}
        onBlur={handleTextareaBlur}
      />
      {expandedQuestionIds.includes(question.id) && (
        <div className="absolute top-0 right-0 mr-1 mt-1 cursor-pointer">
          <DeleteIcon className="text-gray-400 hover:text-red-400" />
        </div>
      )}
    </div>
  );
};

export default function QuestionItemList({ selectedCategory }: { selectedCategory: Category | null }) {
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);
  const [collapseAll, setCollapseAll] = useState(false);

  const [textareaValues, setTextareaValues] = useState<{ [key: string]: string }>({});
  const [titleValues, setTitleValues] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Collapse all questions when the selected category changes
    setExpandedQuestionIds([]);
  }, [selectedCategory]);

  const handleQuestionClick = (questionId: string) => {
    setExpandedQuestionIds((prevIds) => {
      if (prevIds.includes(questionId)) {
        // If the question is already expanded, collapse it
        return prevIds.filter((id) => id !== questionId);
      } else {
        // If the question is not expanded, expand it
        return [...prevIds, questionId];
      }
    });
  };

  const handleToggleCollapseAll = () => {
    setCollapseAll(!collapseAll);
    setExpandedQuestionIds(collapseAll ? [] : selectedCategory?.questions.map((q) => q.id) || []);
  };

  useEffect(() => {
    // Initialize the textarea values from the selected category's questions
    if (selectedCategory) {
      const initialValues = selectedCategory.questions.reduce((acc, question) => {
        acc[question.id] = question.content;
        acc[`${question.id}_title`] = question.title;
        return acc;
      }, {} as { [key: string]: string });
      setTextareaValues(initialValues);
      setTitleValues(initialValues);
    }
  }, [selectedCategory]);

  const QuestionTitleItem: React.FC<{ question: Question }> = ({ question }) => {
    const [editTitleMode, setEditTitleMode] = useState(false);
    const titleInputRef = useRef<HTMLTextAreaElement>(null);

    const handleEditTitleClick = () => {
      setEditTitleMode(true);
    };

    useEffect(() => {
      if (editTitleMode && titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }, [editTitleMode]);

    const handleTitleInputBlur = () => {
      setEditTitleMode(false);
    };

    return (
      <div className="flex w-full items-start">
        {expandedQuestionIds.includes(question.id) ? (
          <div className="mr-2 flex w-full cursor-pointer">
            <EditIcon className="mr-2 text-gray-400" onClick={handleEditTitleClick} />
            <textarea
              ref={titleInputRef}
              className={`w-full text-sm  outline-none border-none bg-transparent resize-none ${editTitleMode ? 'focus:ring focus:border-green-300' : ''}`}
              value={titleValues[question.id] || ""}
              readOnly={!editTitleMode || !expandedQuestionIds.includes(question.id)}
              onChange={(e) => {
                setTitleValues((prevValues) => ({
                  ...prevValues,
                  [question.id]: e.target.value,
                }));
              }}
              rows={3}
              style={{ marginRight: "8px" }}
              onBlur={handleTitleInputBlur}
            />
          </div>
        ) : (
          <p className="text-sm">{question.title}</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex">
        <h2 className="text-sm text-gray-500 font-bold px-4 py-2 rounded bg-gray-200 mb-5">
          {selectedCategory ? `${selectedCategory.name}` : "Category"}
        </h2>
      </div>

      <div className="space-y-4 relative">
        <p
          className="text-gray-400 text-xs absolute top-0 right-0 cursor-pointer "
          onClick={handleToggleCollapseAll}
        >
          {collapseAll ? "Collapse All" : "Expand All"}
        </p>
        <AddQuestionButton onClick={() => {}} />
        {selectedCategory?.questions.map((question: Question) => (
          <div key={question.id} className="bg-white border p-4 rounded shadow">
            <div className="flex flex-3 justify-between items-center">
              <QuestionTitleItem question={question} />
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