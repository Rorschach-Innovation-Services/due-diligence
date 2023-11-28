
import {GroupModel} from '@/models/category';
import connectToDatabase from '@/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

connectToDatabase();

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { searchParams } = new URL(req.url as string);
    const id = searchParams.get('groupId');
    const name = searchParams.get('groupName'); // Added line to get groupName

    if (id) {
      // Fetch a single group by ID
      const group = await GroupModel.findOne({ _id: id });

      if (!group) {
        return Response.json({ error: 'Group not found' });
      }

      return Response.json({ group });
    } else if (name) {
      // Fetch a single group by name
      const group = await GroupModel.findOne({ name });

      if (!group) {
        return Response.json({ error: 'Group not found' });
      }

      return Response.json({ group });
    } else {
      // Fetch all categories from the database
      const groups = await GroupModel.find({}, { name: 1, _id: 1 });
      return Response.json({ groups });
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
    console.log(dataToInsert)

    // Create a new group in the database
    const result = await GroupModel.create(valueToJson);

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
    const group = await GroupModel.findOne({ name: groupId });
    group.name = name

    // Check if the group is not found
    if (!group) {
      return Response.json({ error: 'group not found' });
    }

  
    // Save the updated group
    const updatedGroup = await group.save();

    return Response.json({ updatedGroup });
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
    const group = await GroupModel.findOne({ name: groupId });

    // Delete the group
    await group.deleteOne();

    // Check if the group is not found
    if (!group) {
      return Response.json({ error: 'group not found' });
    }

    // Save the updated group
    // const updatedgroup = await group.save();

    return Response.json({ group });
  } catch (error) {
    console.error('Error updating question:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}

