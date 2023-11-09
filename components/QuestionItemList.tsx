// components/QuestionItemList.tsx

import { useState } from "react";

interface Question {
  id: string;
  title: string;
  content: string;
}

export default function QuestionItemList({ questions }: { questions: Array<Question> }) {
  // const [expandedQuestionId, setExpandedQuestionId] = useState(null);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Questions</h2>

      <div className="space-y-2">
        {questions.map((question: Question) => (
          <div key={question.id} className="border p-4 rounded shadow">
            <h3 className="font-bold">{question.title}</h3>
            {question.content}
          </div>
        ))}
      </div>
    </div>
  );
}
