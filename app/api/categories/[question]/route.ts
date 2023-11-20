import CategoryModel from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';


connectToDatabase();
// Endpoint for fetching all categories: /api/categories
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const id = searchParams.get('id');

    // Check if categoryId is not provided
    if (!id) {
      return Response.json({ error: 'Category ID is required' });
    }

    // Fetch a single category by ID
    const category = await CategoryModel.findOne({ id: id }, { _id: 0 });

    // Check if the category is not found
    if (!category) {
      return Response.json({ error: 'Category not found' });
    }

    // Return the list of categories
    return Response.json({ category });
  } catch (error) {
    // Handle errors
    console.error('Error fetching categories:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}