import { Download } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

/**
 * Reads a downloaded PDF and extracts its text content.
 */
export async function readPdf(
  download: Download,
): Promise<{ buffer: Buffer; text: string }> {
  const buffer = await readFile(await download.path());
  const { text } = await new PDFParse({ data: buffer }).getText();
  return { buffer, text };
}
