
import CategoryModel from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

connectToDatabase();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const id = searchParams.get('id');

    if (id) {
      // Fetch a single category by ID
      const category = await CategoryModel.findOne({ _id: id }, { _id: 0 });

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

// Endpoint for adding a new category: /api/category
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse the request body
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    console.log('Received request body:', valueToJson);

    const { id, name, questions, group } = valueToJson;
    const dataToInsert = { id, name, questions, group };

    // Create a new category in the database
    const result = await CategoryModel.create(dataToInsert);

    // Return the added category
    return Response.json({ message: 'Category added successfully', data: result });
  } catch (error) {
    // Handle errors
    console.error('Error adding category:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}