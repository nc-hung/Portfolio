import { parsePdfTemplate } from './src/lib/template-parser';
import fs from 'fs';

async function test() {
  try {
    const buffer = Buffer.from(""); // Empty buffer for testing basic import
    console.log("Testing parsePdfTemplate import and basic execution...");
    const result = await parsePdfTemplate(buffer);
    console.log("Result:", result);
  } catch (e) {
    console.error("FAILED with:", e);
  }
}

test();
