import jsPDF from 'jspdf';
import { degrees, PDFDocument } from 'pdf-lib';
import { fitImage, preprocessImage } from 'src/app/shared/image-processing';

const MIME_TYPE_IMAGE = /^image\/.+$/;
const MIME_TYPE_PDF = 'application/pdf';

const MAX_IMAGE_SIZE = 1920;
const PAGE_MARGIN = 10;

export async function createPdf(
  htmlElement: HTMLElement,
): Promise<ArrayBuffer> {
  const doc = new jsPDF({
    unit: 'pt',
    compress: true,
  });

  // Add mailto link
  doc.link(170, 57, 70, 10, {
    url: 'mailto:lgs@jdav-bayern.de',
  });

  // Add the form content
  await doc.html(htmlElement, {
    autoPaging: true,
  });

  return doc.output('arraybuffer');
}

export async function combinePdf(
  pdfData: ArrayBuffer,
  attachments: File[],
  subject: string,
): Promise<Blob> {
  const pdfDoc = await PDFDocument.load(pdfData);

  for (const file of attachments) {
    if (file.type === MIME_TYPE_PDF) {
      await addPdfPages(pdfDoc, file);
    } else if (file.type.match(MIME_TYPE_IMAGE)) {
      await addImage(pdfDoc, file);
    } else {
      throw new Error(`Unsupported attachment type: ${file.type}`);
    }
  }

  pdfDoc.setSubject(subject);

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: MIME_TYPE_PDF });
}

async function addImage(pdfDoc: PDFDocument, attachment: Blob) {
  if (!attachment.type.match(MIME_TYPE_IMAGE)) {
    throw new Error(`File type ${attachment.type} is not an image attachment`);
  }

  const processed = await preprocessImage(attachment, MAX_IMAGE_SIZE);

  const arrayBuffer = await processed.arrayBuffer();
  const image = await pdfDoc.embedJpg(arrayBuffer);

  const page = pdfDoc.addPage();

  const pageSize = {
    width: page.getWidth() - 2 * PAGE_MARGIN,
    height: page.getHeight() - 2 * PAGE_MARGIN,
  };

  const { scale, rotate } = fitImage(image.size(), pageSize);
  const { width, height } = image.scale(scale);

  if (rotate) {
    page.drawImage(image, {
      x: page.getWidth() / 2 + height / 2,
      y: page.getHeight() / 2 - width / 2,
      width,
      height,
      rotate: degrees(90),
    });
  } else {
    page.drawImage(image, {
      x: page.getWidth() / 2 - width / 2,
      y: page.getHeight() / 2 - height / 2,
      width,
      height,
    });
  }
}

async function addPdfPages(pdfDoc: PDFDocument, attachment: Blob) {
  if (attachment.type !== MIME_TYPE_PDF) {
    throw new Error(`File type ${attachment.type} is not a PDF attachment`);
  }

  const arrayBuffer = await attachment.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer);

  const pages = await pdfDoc.copyPages(srcDoc, srcDoc.getPageIndices());
  pages.forEach((page) => pdfDoc.addPage(page));
}
