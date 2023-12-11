import {CategoryModel} from "@/models/category";
// import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: Request) {
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
  
      if(!category.group) {
        category.group = null;
      }
      
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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    const questionId = searchParams.get('questionId');
    const contentIndex = searchParams.get('contentIndex');
    const lastedited = searchParams.get('lastedited');

    // Ensure categoryId, questionId, and contentIndex are provided
    if (!categoryId || contentIndex === null || contentIndex === undefined) {
      return Response.json({ error: 'Category ID, Question ID, and Content Index are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // console.log(categoryId, questionId, contentIndex, lastedited)
    // console.log(category)

    // Find the question in the category's questions array
    let question;

    if (lastedited) {
      question = category.questions.find((q: { lastedited: string; _id: string | string[] }) => q.lastedited === lastedited);
    } else {
      question = category.questions.find((q: { _id: string | string[] }) => q._id == questionId);
    //   console.log("No lastedited!")
    }

    // console.log(question)
    // Check if the question is not found
    if (!question) {
      return Response.json({ error: 'Question not found in the category' });
    }

    // Find the content item in the question's contents array
    const contentItem = question.contents[contentIndex];

    // Check if the content item is not found
    if (contentItem === undefined) {
      return Response.json({ error: 'Content item not found in the question' });
    }

    // Remove the content item from the question
    question.contents.splice(contentIndex, 1);

    if(!category.group) {
      category.group = null;
    }
    
    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error deleting question content:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
