import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      include: {
        job: true,
        cv: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { jobId, cvId, status = 'SAVED', notes = '' } = await req.json();
    
    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }

    // Create a new application entry
    const application = await prisma.application.create({
      data: {
        jobId,
        cvId: cvId || undefined,
        status,
        notes,
        nextAction: 'Prepare for application'
      },
      include: {
        job: true
      }
    });
    
    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    console.error("Application create error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, nextAction, nextActionDate, notes } = await req.json();
    
    const application = await prisma.application.update({
      where: { id },
      data: { 
        status, 
        nextAction, 
        nextActionDate: nextActionDate ? new Date(nextActionDate) : undefined, 
        notes 
      }
    });
    
    return NextResponse.json({ success: true, data: application });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
