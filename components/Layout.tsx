// components/Layout.tsx
'use client';
import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import QuestionCategoryList from "./QuestionCategoryList";
import QuestionItemList from "./QuestionItemList";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);

  const handleCategoryChange = (category: any) => {
    setSelectedCategory(category);
  };

  return (
    <div className="flex bg-gray-900">
      {/* Sidebar */}
      <aside className="hidden md:block md:w-64 bg-white border-r border-gray-300">
        {/* profile */}
        <QuestionCategoryList onCategoryChange={handleCategoryChange} />
        {/* links */}
      </aside>

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="p-6 flex-1 bg-gray-100 overflow-y-auto">
          {/* Page content */}
          {selectedCategory? <QuestionItemList selectedCategory={selectedCategory} /> : 
            <div>
              Introduction Content
            </div>
          }
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
