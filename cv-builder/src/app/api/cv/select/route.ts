import { NextResponse } from 'next/server';
import { selectLegoBlocks } from '@/lib/gemini';
import { masterCVBlocks } from '@/data/master-cv';

export async function POST(req: Request) {
  try {
    const { jdAnalysis, modelName } = await req.json();

    const jdDomain = jdAnalysis.domain || 'GENERAL';
    const filteredBlocks = masterCVBlocks.filter(block => 
      block.domain === jdDomain || block.domain === 'GENERAL'
    );

    const selection = await selectLegoBlocks(jdAnalysis, filteredBlocks, modelName);
    
    // Return full block data for selected IDs
    const selectedBlocks = filteredBlocks.filter(b => selection.selectedBlockIds.includes(b.id));

    return NextResponse.json({
      success: true,
      selectedBlocks,
      reasoning: selection.reasoning
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
