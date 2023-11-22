import CategoryModel from "@/models/category";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { searchParams } = new URL(req.url as string);
        const categoryId = searchParams.get('categoryId');
        const questionId = searchParams.get('questionId');
        const lastedited = searchParams.get('lastedited');
    //   console.log("Cat ID:", searchParams)
  
      // Ensure categoryId is provided
      if (!categoryId) {
        return Response.json({ error: 'Category ID is required' });
      }
  
      // Find the category by ID
      const category = await CategoryModel.findOne({ _id: categoryId });
  
      // Check if the category is not found
      if (!category) {
        return Response.json({ error: 'Category not found' });
      }
  
      // Create a new question with empty title and content
    //   const newQuestion = {
    //     id: "none", // Assume you have a function to generate a unique ID
    //     title: '',
    //     contents: [],
    //     lastedited: new Date().toISOString(),
    //   };

    let question
    if (lastedited) {

        question = category.questions.find((q: {
          lastedited: string; _id: string | string[];
        }) => q.lastedited == lastedited);
  
        console.log("resp", question)
      } else {
        console.log("Cate....", questionId)
        question = category.questions.find((q: { _id: string | string[]; }) => q._id == questionId);
      }

  
  
      // Add the new question to the category
      question.contents.push("");
  
      // Save the updated category
      const updatedCategory = await category.save();
  
      const questions = await fetchQuestions(categoryId);
  
      console.log("New Question:", question)
  
      return Response.json({ updatedCategory });
    } catch (error) {
      console.error('Error creating question:', error);
      return Response.json({ error: 'Internal Server Error' });
    }
  }
  
  const fetchQuestions = async (categoryId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories?id=${categoryId}`);
      const data = await response.json();
      return data?.category?.questions || [];
    } catch (error) {
      console.error("Error fetching questions:", error);
      return [];
    }
  };