import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// app/api/movies/route.ts

// ...

/**
 * @swagger
 * /api/movies/[idMovie]/comments:
 *   get:
 *     description: Returns comments of a specific movie
 *     responses:
 *       200:
 *         description: Lists all comments of a specific movie
 *   post:
 *     description: Creates a comment
 *     responses:
 *       201:
 *         description: Comment successfully created
 */
export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const comments = await db.collection('comments').find({}).limit(10).toArray();
    
    return NextResponse.json(
        { status: 200, data: comments }
        );
  }
  catch (error: any) {
    return NextResponse.json(
        { status: 500, message: 'Internal Server Error', error: error.message }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
      const client: MongoClient = await clientPromise;
      const db: Db = client.db('sample_mflix');
  
      const body = await request.json();
  
      const newComment = {
        _id: new ObjectId(),
        name: body.name,
        email: body.email,
        movie_id: body.movie_id,
        text: body.text,
        createdAt: new Date()
      };
      
      const create = await db.collection('comments').insertOne(newComment);
      
      return NextResponse.json({ status: 201, data: { id: create.insertedId, movie: newComment }});
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  
    }
  }

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'PUT method is not supported' });
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json({ status: 405, message: 'Method Not Allowed', error: 'DELETE method is not supported' });
}