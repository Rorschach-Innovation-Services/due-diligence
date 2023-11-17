import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { EditIcon } from "@/icons/EditIcon";
import { DeleteIcon } from "@/icons/Delete";

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

interface QuestionItemListProps {
  selectedCategory: Category | null;
}

export default function QuestionItemList({ selectedCategory }: QuestionItemListProps) {
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);
  const [collapseAll, setCollapseAll] = useState(false);

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
    setExpandedQuestionIds(collapseAll ? [] : selectedCategory?.questions.map(q => q.id) || []);
  };

  return (
    <div className="p-4">
      <div className="flex">
        <h2 className="text-sm font-bold px-4 py-2 rounded bg-gray-200 mb-5">
          {selectedCategory ? `${selectedCategory.name}` : "Category"}
        </h2>
        <p
          className="text-gray-400 text-sm cursor-pointer ml-auto"
          onClick={handleToggleCollapseAll}
        >
          {collapseAll ? "Collapse All" : "Expand All"}
        </p>
      </div>

      <div className="space-y-4">
        {selectedCategory?.questions.map((question: Question) => (
          <div key={question.id} className="bg-white border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-start cursor-pointer" onClick={() => handleQuestionClick(question.id)}>
                {expandedQuestionIds.includes(question.id) && (
                  <div className="mr-2 cursor-pointer">
                    <EditIcon className="text-gray-400" />
                  </div>
                )}
                <p className="text-sm">{question.title}</p>


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
              <div className="flex items-start justify-start mt-2 relative p-4 bg-blue-50 border border-blue-500 rounded text-sm">
                <div className="mr-2 cursor-pointer">
                    <EditIcon className="text-blue-400" />
                  </div>
                <p>{question.content}</p>
                {expandedQuestionIds.includes(question.id) && (
                  <div className=" absolute top-0 right-0 mr-1 mt-1 cursor-pointer">
                    <DeleteIcon className="text-red-400" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
