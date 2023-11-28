import { CategoryModel } from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';



connectToDatabase();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    const lastedited = searchParams.get('lastedited');
    const questionId = "none"; // Recently added question will have a none ID

    // Ensure categoryId and questionId are provided
    if (!categoryId || !questionId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });



    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    let question
    if (lastedited) {
      // Find the question by lastedited in the category's questions array
      question = category.questions.find((q: {
        lastedited: string; id: string;
      }) => q.lastedited == lastedited);
    } else {
      // Find the question by ID in the category's questions array
      question = category.questions.find((q: { id: string; }) => q.id == questionId);
    }

    // Check if the question is not found
    if (!question) {
      return Response.json({ error: 'Question not found in the category' });
    }

    return Response.json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { , questionId } = req.query;
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    const questionId = searchParams.get('questionId');
    const lastedited = searchParams.get('lastedited');
    // const { title, contents } = req.body;

    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    console.log('Received request body:', valueToJson);

    const { title, contents } = valueToJson
    // console.log("BODY IS",req.body)

    // Check if categoryId and questionId are provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });

    console.log("Category is", category)

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    let questionIndex

    if (lastedited) {

      questionIndex = category.questions.findIndex((q: { lastedited: string; _id: string | string[]; }) => q.lastedited == lastedited);

      console.log("resp", questionIndex)
    } else {
      console.log("Cate....", questionId)
      questionIndex = category.questions.findIndex((q: { _id: string | string[]; }) => q._id == questionId);
    }

    // Check if the question is not found
    if (questionIndex === -1) {
      return Response.json({ error: 'Question not found in the category' });
    }

    // Update the question's title and contents
    category.questions[questionIndex].title = title;
    category.questions[questionIndex].contents = contents;

    if (!category.group) {
      category.group = null;
    }

    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error updating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}


export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    const questionId = searchParams.get('questionId');
    const lastedited = searchParams.get('lastedited');

    // Ensure categoryId and questionId are provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }


    // Find the index of the question in the category's questions array

    let questionIndex

    if (lastedited) {

      questionIndex = category.questions.findIndex((q: {
        lastedited: string; _id: string | string[];
      }) => q.lastedited == lastedited);

      console.log("resp", questionIndex)
    } else {
      console.log("Cate....", questionId)
      questionIndex = category.questions.findIndex((q: { _id: string | string[]; }) => q._id == questionId);
    }

    // Check if the question is not found
    if (questionIndex === -1) {
      return Response.json({ error: 'Question not found in the category' });
    }

    // Remove the question from the category
    category.questions.splice(questionIndex, 1);

    if (!category.group) {
      category.group = null;
    }

    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error deleting question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}


// Assuming "POST" corresponds to creating a new question
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    console.log("Cat ID:", searchParams)

    // Ensure categoryId is provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID is required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });

    console.log("Category is", category)

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // Create a new question with empty title and content
    const newQuestion = {
      id: "none", // Assume you have a function to generate a unique ID
      title: '',
      contents: [],
      lastedited: new Date().toISOString(),
    };


    // Add the new question to the category
    category.questions.push(newQuestion);

    if (!category.group) {
      category.group = null;
    }

    const updatedCategory = await category.save();

    const questions = await fetchQuestions(categoryId);

    console.log("New Question:", newQuestion)

    return Response.json({ newQuestion });
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