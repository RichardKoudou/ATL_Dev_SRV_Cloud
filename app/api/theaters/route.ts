import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// app/api/theaters/route.ts

// ...

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     description: Returns theaters
 *     responses:
 *       200:
 *         description: Lists all theaters
 *   post:
 *     description: Creates a theaters
 *     responses:
 *       201:
 *         description: Theaters successfully created
 */


export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const theaters = await db.collection('theaters').find({}).limit(10).toArray();
    
    return NextResponse.json(
        { status: 200, data: theaters }
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

    const newTheaters = {
      _id: new ObjectId(),
      location : {
        ...body.location?.address,
        ...body.location?.city
      },
      createdAt: new Date()
    };
    
    const create = await db.collection('theaters').insertOne(newTheaters);
    
    return NextResponse.json({ status: 201, data: { id: create.insertedId, theaters: newTheaters }});
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });

  }
}

