
import CategoryModel from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


connectToDatabase();
// Endpoint for fetching all categories: /api/categories
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all categories from the database
    const categories = await CategoryModel.find({}, {id: 1, name: 1, _id: 0});

    // Return the list of categories
    return Response.json({ categories });
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

    const { id, name, questions } = valueToJson;
    const dataToInsert = { id, name, questions };

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