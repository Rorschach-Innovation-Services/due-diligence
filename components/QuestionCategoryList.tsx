// components/QuestionCategoryList.tsx
"use client";
import { useState } from "react";
import QuestionItemList from "./QuestionItemList";

interface QuestionCategoryListProps {
  onCategoryChange: (selectedCategory: any) => void;
}


export default function QuestionCategoryList({ onCategoryChange }: QuestionCategoryListProps){
    
  const categories = [
    {
      id: '1',
      name: 'Category 1',
      questions: [
        {
          id: '1',
          title: 'Question 1',
          content: 'Lorem ipsum...'
        },
        {
          id: '2',
          title: 'Question 2',
          content: 'Dolor sit amet...'
        }
      ]
    },
    {
      id: '2',
      name: 'Category 2',
      questions: [
        {
          id: '1',
          title: 'Question 1',
          content: 'How are you?'
        },
        {
          id: '2',
          title: 'Question 2',
          content: 'How many?'
        }
      ]
    }
  ];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  console.log(selectedCategory)
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    onCategoryChange(selectedCategory);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Categories</h2>

      <div className="space-y-2">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="px-4 py-2 rounded bg-gray-200"
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.name}
          </div>
        ))}
      </div>

      {/* <QuestionItemList questions={selectedCategory?.questions ?? []} /> */}
    </div>
  );
}