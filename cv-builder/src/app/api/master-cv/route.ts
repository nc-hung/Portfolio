import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const profileId = searchParams.get('profileId');
    
    // Build where clause
    const whereClause: any = {};
    if (profileId) whereClause.profileId = profileId;

    const blocks = await prisma.masterCVBlock.findMany({
      where: whereClause,
      orderBy: [{ createdAt: 'desc' }, { category: 'asc' }, { variant: 'asc' }]
    });
    return NextResponse.json({ success: true, data: blocks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, variant, content, keywords, language, profileId } = body;
    
    const block = await prisma.masterCVBlock.create({
      data: {
        category, 
        variant, 
        content: typeof content === 'string' ? content : JSON.stringify(content), 
        keywords, 
        language,
        profileId: profileId || undefined
      }
    });

    return NextResponse.json({ success: true, data: block });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, content, keywords, variant } = body;
    
    const block = await prisma.masterCVBlock.update({
      where: { id },
      data: {
        content: typeof content === 'string' ? content : JSON.stringify(content),
        keywords,
        variant
      }
    });

    return NextResponse.json({ success: true, data: block });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
