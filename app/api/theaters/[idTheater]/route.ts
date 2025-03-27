// page/api/movies/[idMovie]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

// app/api/theaters/[idTheater]/route.ts

// ...

/**
 * @swagger
 * /api/theaters/[idTheater]:
 *   get:
 *     description: Returns a specific theater
 *     responses:
 *       200:
 *         description: Finds a specific theater
 *   put:
 *     description: Modifies a specific theater
 *     responses:
 *       201:
 *         description: Theater successfully modified
 *   delete:
 *     description: deletes a specific theater
 *     responses:
 *       204:
 *         description: Theater successfully deleted
 */

export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idTheater } = params;
    if (!ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid theater ID', error: 'ID format is incorrect' });
    }
    
    const theater = await db.collection('theaters').findOne({ _id: new ObjectId(idTheater) });
    
    if (!theater) {
      return NextResponse.json({ status: 404, message: 'Theater not found', error: 'No theater found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { theater } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}



export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params;

    if (!idTheater || !ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid or missing idTheater' });
    }

    const body = await request.json();

    const theaterField = {
      location : {
        ...body.location?.address,
        ...body.location?.city
      },
      updatedAt: new Date()
    };

    const updateTheater = await db.collection('theaters').findOneAndUpdate(
      { _id: new ObjectId(idTheater) },
      { $set: theaterField }, // Met à jour uniquement les champs fournis
      { returnDocument: 'after' } // Retourne le document mis à jour
    );

    if (!updateTheater) {
      return NextResponse.json({ status: 404, message: 'Theater not found' });
    }

    return NextResponse.json({ status: 201, data: {updateTheater }});
  } catch (error: any) {
    console.error('MongoDB Update Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {

  try {

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idTheater } = params; // Récupère l'id du movie depuis l'URL

    if (!idTheater || !ObjectId.isValid(idTheater)) {
      return NextResponse.json({ status: 400, message: 'Invalid or missing movieId' });
    }

    const result = await db.collection('theaters').deleteOne({ _id: new ObjectId(idTheater) });
  

  return NextResponse.json({ status: 204, result, message: 'Theater deleted successfully' })

  } catch (error: any) {
    console.error('MongoDB Delete Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
