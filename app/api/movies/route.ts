import { NextResponse } from 'next/server';
import { Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// app/api/movies/route.ts

// ...

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Returns movies
 *     responses:
 *       200:
 *         description: Lists all movies on the platform
 *   post:
 *     description: Creates a movie
 *     responses:
 *       201:
 *         description: Movie successfully created
 */


export async function GET(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const movies = await db.collection('movies').find({}).limit(10).toArray();
    
    return NextResponse.json(
	    { status: 200, data: movies }
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

    const newMovie = {
      _id: new ObjectId(),
      plot: body.plot,
      genres: body.genres || null,
      cast: body.cast,
      directors: body.directors,
      //createdAt: new Date()
    };
    
    const create = await db.collection('movies').insertOne(newMovie);
    
    return NextResponse.json({ status: 201, data: { id: create.insertedId, movie: newMovie }});
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });

  }
}

