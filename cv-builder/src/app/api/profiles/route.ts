import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    let profiles = await prisma.profile.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Auto-seed if empty
    if (profiles.length === 0) {
      console.log("[API] No profiles found, seeding default...");
      const defaultProfile = await prisma.profile.create({
        data: { name: 'Hồ sơ mặc định' }
      });
      profiles = [defaultProfile];
    }

    return NextResponse.json({ success: true, data: profiles });
  } catch (error: any) {
    console.error("[API Profiles Error]:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, address, github, linkedin, website } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const profile = await prisma.profile.create({
      data: {
        name, email, phone, address, github, linkedin, website
      }
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
