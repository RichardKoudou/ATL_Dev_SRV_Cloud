// page/api/movies/[idMovie]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

// app/api/movies/[idMovie]/route.ts

// ...

/**
 * @swagger
 * /api/movies/[idMovie]:
 *   get:
 *     description: Returns movie
 *     responses:
 *       200:
 *         description: Finds a specific movie
 *   put:
 *     description: Modifies a movie
 *     responses:
 *       201:
 *         description: Movie successfully modified
 *   delete:
 *     description: deletes a movie
 *     responses:
 *       204:
 *         description: Movie successfully deleted
 */

export async function GET(request: Request, { params }: { params: { idMovie: any } }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { movie } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}



export async function PUT(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {

  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params;

    if (!idMovie || !ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid or missing movieId' });
    }

    const body = await request.json();

    const movieField = {
      plot: body.plot,
      genres: body.genres || null,
      cast: body.cast,
      directors: body.directors,
      updatedAt: new Date()
    };

    const updateMovie = await db.collection('movies').findOneAndUpdate(
      { _id: new ObjectId(idMovie) },
      { $set: movieField }, // Met à jour uniquement les champs fournis
      { returnDocument: 'after' } // Retourne le document mis à jour
    );

    if (!updateMovie) {
      return NextResponse.json({ status: 404, message: 'Movie not found' });
    }

    return NextResponse.json({ status: 201, data: {updateMovie }});
  } catch (error: any) {
    console.error('MongoDB Update Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

export async function DELETE(request: Request, { params }: { params: { idMovie: string } }): Promise<NextResponse> {

  try {

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const { idMovie } = params; // Récupère l'id du movie depuis l'URL

    if (!idMovie || !ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid or missing movieId' });
    }

    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(idMovie) });
  

  return NextResponse.json({ status: 204, result, message: 'Movie deleted successfully' })

  } catch (error: any) {
    console.error('MongoDB Delete Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}
