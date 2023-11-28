
import { CategoryModel } from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

connectToDatabase();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single category by ID
      const category = await CategoryModel.findOne({ _id: id }, { _id: 0 }).populate('group', 'name');
      console.log(category)

      if (!category) {
        return Response.json({ error: 'Category not found' });
      }

      return Response.json({ category });
    } else {
      // Fetch all categories from the database
      const categories = await CategoryModel.find({}, { id: 1, name: 1, group: 1, _id: 1 });
      return Response.json({ categories });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

// Endpoint for adding a new category: /api/categories
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse the request body
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    console.log('Received request body:', valueToJson);

    const { id, name, questions, group } = valueToJson;
    // console.log("Group id is",group);
    const dataToInsert = { id, name, questions, group, lastedited: new Date().toISOString(), };

    // // Add the new question to the category
    // category.questions.push(newQuestion);

    // Create a new category in the database
    const category = await CategoryModel.create(dataToInsert);

    // Return the added category
    return Response.json({ category });
  } catch (error) {
    // Handle errors
    console.error('Error adding category:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const categoryId = searchParams.get('categoryId');

    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { name } = valueToJson


    // Check if categoryId and questionId are provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });
    category.name = name

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }


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

    // Check if categoryId and questionId are provided
    if (!categoryId) {
      return Response.json({ error: 'Category ID and Question ID are required' });
    }

    // Find the category by ID
    const category = await CategoryModel.findOne({ _id: categoryId });

    // Delete the category
    await category.deleteOne();


    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }



    // if (!category.group) {
    //   category.group = null;
    // }

    // const updatedCategory = await category.save();

    return Response.json({ category });
  } catch (error) {
    console.error('Error updating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

