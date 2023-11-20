// // interfaces.ts (or any appropriate file)
// export interface Question {
//   id: string;
//   title: string;
//   contents: string[];
// }

// export interface Category {
//   id: string;
//   name: string;
//   questions: Question[];
// }

// // useCategories.ts
// import { useState, useEffect } from "react";
// import { Category } from "./interfaces"; // Import the Category interface

// export function useCategories() {
//   const [categories, setCategories] = useState<Category[] | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("/api/category");
//         if (!response.ok) {
//           throw new Error("Error fetching categories");
//         }

//         const data = await response.json();
//         setCategories(data.data); // Assuming the data structure is in the expected format
//       } catch (error) {
//         setError("Error fetching categories");
//       }
//     };

//     fetchCategories();
//   }, []);

//   return { categories, error };
// }
