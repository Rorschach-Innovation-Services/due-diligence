// components/QuestionCategoryList.tsx
import { useState } from "react";

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

interface QuestionCategoryListProps {
  onCategoryChange: (selectedCategory: any) => void;
}

export default function QuestionCategoryList({ onCategoryChange }: QuestionCategoryListProps) {
  const categories: Category[] = [
    {
      id: '1',
      name: 'QUESTIONS RELATING TO THE UCT’S OVERALL GOVERNANCE STRUCTURE & GENERAL GOVERNANCE ISSUES',
      questions: [
        {
          id: '1',
          title: 'What is the legal status of the organisation? Or: Does the organization have a written constitution and defined governance and executive functions including an organizational structure? Or: Please confirm the legal status of the organisation, how it is registered and with whom? And/or: Please provide a legal document on the formation of the organisation, and any written rules agreeing to the running of the organization.',
          content: 'The University of Cape Town (UCT) is a university incorporated in accordance with the Higher Education Act, 101 of 1997, and the statute of UCT, promulgated under Government Notice No. 1199 of 20 September 2002, as amended by: Government Notice 259 of 26 February 2004, Government Notice 476 of 20 May 2005, Government Notice 748 of 27 August 2010, and Government Notice 408 of 23 May 2012.1 ',
        },
        {
          id: '2',
          title: 'Question 2',
          content: 'Dolor sit amet...',
        },
      ],
    },
    {
      id: '2',
      name: 'Questions relating specifically to the governance of the research enterprise at UCT',
      questions: [
        {
          id: '1',
          title: 'How are you?',
          content: 'Nothing to say.... i i i do not want to talk',
        },
        {
          id: '2',
          title: 'How many?',
          content: 'Thousands and thousands of them',
        },
      ],
    },
  ];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string) => {
    const selectedCategory = categories.find((cat) => cat.id === categoryId);
    setSelectedCategoryId(categoryId);
    onCategoryChange(selectedCategory); // Pass the selected category object
  };

  return (
    <div className="p-4">
      <h2 className="text-l font-bold mb-2">Categories</h2>

      <div className="space-y-2">
        {categories.map((cat: Category) => (
          <div
            key={cat.id}
            className={`px-4 text-xs py-2 rounded ${cat.id === selectedCategoryId ? 'bg-gray-300' : 'bg-gray-200'}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>
    </div>
  );
}
