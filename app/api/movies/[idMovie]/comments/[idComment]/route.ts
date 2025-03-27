// page/api/movies/[idMovie]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { comment } from 'postcss';

// app/api/movies/[idMovie]/route.ts

// ...

/**
 * @swagger
 * /api/movies/[idMovie]/comments/[idComment]:
 *   get:
 *     description: Returns a specific comment of a specific movie
 *     responses:
 *       200:
 *         description: Returns a specific comment on a specific movie
 *   put:
 *     description: Modifies a specific comment of a specific movie
 *     responses:
 *       201:
 *         description: comment successfully modified
 *   delete:
 *     description: deletes a specific comment on a specific movie
 *     responses:
 *       204:
 *         description: Comment successfully deleted
 */
export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
    try {
      const client: MongoClient = await clientPromise;
      const db: Db = client.db('sample_mflix');
      
      const { idComment } = params;
      if (!ObjectId.isValid(idComment)) {
        return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
      }
      
      const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });
      
      if (!comment) {
        return NextResponse.json({ status: 404, message: 'comments not found', error: 'No comment found with the given ID' });
      }
      
      return NextResponse.json({ status: 200, data: { comment } });
    } catch (error: any) {
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }
  
  export async function PUT(request: Request, { params }: { params: any}): Promise<NextResponse> {
  
    try {
      const client: MongoClient = await clientPromise;
      const db: Db = client.db('sample_mflix');
  
      const { idComment } = params;
  
      if (!idComment || !ObjectId.isValid(idComment)) {
        return NextResponse.json({ status: 400, message: 'Invalid or missing movieId' });
      }
  
      const body = await request.json();
  
      const commentField = {
        plot: body.plot,
        genres: body.genres || null,
        cast: body.cast,
        directors: body.directors,
        updatedAt: new Date()
      };
  
      const updateComment = await db.collection('comments').findOneAndUpdate(
        { _id: new ObjectId(idComment) },
        { $set: commentField }, // Met à jour uniquement les champs fournis
        { returnDocument: 'after' } // Retourne le document mis à jour
      );
  
      if (!updateComment) {
        return NextResponse.json({ status: 404, message: 'Comment not found' });
      }
  
      return NextResponse.json({ status: 201, data: {updateComment }});
    } catch (error: any) {
      console.error('MongoDB Update Error:', error);
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }
  
  export async function DELETE(request: Request, { params }: { params: any}): Promise<NextResponse> {
  
    try {
  
      const client: MongoClient = await clientPromise;
      const db: Db = client.db('sample_mflix');
  
      const { idComment } = params; // Récupère l'id du movie depuis l'URL
  
      if (!idComment || !ObjectId.isValid(idComment)) {
        return NextResponse.json({ status: 400, message: 'Invalid or missing movieId' });
      }
  
      const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });
    
  
    return NextResponse.json({ status: 204, result, message: 'Comments deleted successfully' })
  
    } catch (error: any) {
      console.error('MongoDB Delete Error:', error);
      return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
    }
  }
  