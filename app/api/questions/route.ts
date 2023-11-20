import CategoryModel from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


connectToDatabase();


export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');

    // Ensure categoryId is provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID is required' });
    }

    const { title, contents } = req.body;

    // Find the category by ID
    const category = await CategoryModel.findOne({ id: categoryId });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // Create a new question
    const newQuestion = {
      id: generateUniqueId(), // Assume you have a function to generate a unique ID
      title,
      contents,
    };

    // Add the new question to the category
    category.questions.push(newQuestion);

    // Save the updated category
    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error creating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}


export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    // const { , questionId } = req.query;
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    const questionId = searchParams.get('questionId');
    // const { title, contents } = req.body;

    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    console.log('Received request body:', valueToJson);

    const { title, contents } = valueToJson
    // console.log("BODY IS",req.body)

    // Check if categoryId and questionId are provided
    if (!categoryId || !questionId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ id: categoryId });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // Find the index of the question in the category's questions array
    const questionIndex = category.questions.findIndex((q: { _id: string | string[]; }) => q._id === questionId);

    // Check if the question is not found
    if (questionIndex === -1) {
      return Response.json({ error: 'Question not found in the category' });
    }

    // Update the question's title and contents
    category.questions[questionIndex].title = title;
    category.questions[questionIndex].contents = contents;

    // Save the updated category
    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error updating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

function generateUniqueId() {
  throw new Error('Function not implemented.');
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');
    const questionId = searchParams.get('questionId');

    // Ensure categoryId and questionId are provided
    if (!categoryId || !questionId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ id: categoryId });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // Find the index of the question in the category's questions array
    const questionIndex = category.questions.findIndex((q: { _id: string | string[]; }) => q._id === questionId);

    // Check if the question is not found
    if (questionIndex === -1) {
      return Response.json({ error: 'Question not found in the category' });
    }

    // Remove the question from the category
    category.questions.splice(questionIndex, 1);

    // Save the updated category
    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error deleting question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}


// Assuming "CREATE" corresponds to creating a new question
export async function CREATE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');

    // Ensure categoryId is provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID is required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ id: categoryId });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // Create a new question with empty title and content
    const newQuestion = {
      id: generateUniqueId(), // Assume you have a function to generate a unique ID
      title: '',
      contents: [],
    };

    // Add the new question to the category
    category.questions.push(newQuestion);

    // Save the updated category
    const updatedCategory = await category.save();

    return Response.json({ updatedCategory });
  } catch (error) {
    console.error('Error creating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
