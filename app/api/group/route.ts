
import {GroupModel} from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

connectToDatabase();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const id = searchParams.get('groupId');

    if (id) {
      // Fetch a single group by ID
      const group = await GroupModel.findOne({ _id: id });

      

      if (!group) {
        return Response.json({ error: 'Group not found' });
      }

      return Response.json({ group });
    } else {
      // Fetch all categories from the database
      const categories = await GroupModel.find({}, { id: 1, name: 1, group: 1, _id: 1 });
      return Response.json({ categories });
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching group:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

// Endpoint for adding a new group: /api/group
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Parse the request body
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    console.log('Received request body:', valueToJson);

    const { name } = valueToJson;
    const dataToInsert = { name };

    // Create a new group in the database
    const result = await GroupModel.create(dataToInsert);

    // Return the added group
    return Response.json({ message: 'Group added successfully', data: result });
  } catch (error) {
    // Handle errors
    console.error('Error adding group:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}
export async function PUT(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const groupId = searchParams.get('groupId');
    
    let passedValue = await new Response(req.body).text();
    let valueToJson = JSON.parse(passedValue);
    const { name } = valueToJson


    // Check if groupId and questionId are provided
    if (!groupId) {
      return Response.json({ error: 'group ID and Question ID are required' });
    }

    // Find the group by ID
    const group = await GroupModel.findOne({ _id: groupId });
    group.name = name

    // Check if the group is not found
    if (!group) {
      return Response.json({ error: 'group not found' });
    }

  
    // Save the updated group
    const updatedgroup = await group.save();

    return Response.json({ updatedgroup });
  } catch (error) {
    console.error('Error updating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

export async function DELETE(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const groupId = searchParams.get('groupId');
    
    // Check if groupId and questionId are provided
    if (!groupId) {
      return Response.json({ error: 'group ID and Question ID are required' });
    }

    // Find the group by ID
    const group = await GroupModel.findOne({ _id: groupId });

    // Delete the group
    await group.deleteOne();

    // Check if the group is not found
    if (!group) {
      return Response.json({ error: 'group not found' });
    }

    
  
    // Save the updated group
    const updatedgroup = await group.save();

    return Response.json({ updatedgroup });
  } catch (error) {
    console.error('Error updating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

