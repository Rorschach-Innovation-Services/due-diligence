// components/QuestionItemList.tsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div className="p-4">
      <h2 className="text-sm font-bold mb-2">
        {selectedCategory ? `Category: ${selectedCategory.name}` : "Category"}
      </h2>

      <div className="space-y-4">
        {selectedCategory?.questions.map((question: Question) => (
          <div key={question.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div className="cursor-pointer" onClick={() => handleQuestionClick(question.id)}>
                <p className="">{question.title}</p>
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
              <div className="mt-2 p-4 bg-gray-200 border border-gray-300 rounded">
                <p>{question.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
