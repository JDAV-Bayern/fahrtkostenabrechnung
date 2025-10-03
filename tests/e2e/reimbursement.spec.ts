import { readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse';
import { expect, test } from './fixtures';
import { TransportExpenseInput } from './poms';

const COURSE_DETAILS = {
  code: 'B123GA',
  name: 'Sicherheitskurs Alpin',
} as const;

const PARTICIPANT = {
  givenName: 'Max',
  familyName: 'Mustermann',
  zipCode: '80331',
  city: 'München',
  iban: 'DE44500105175407324931',
} as const;

// 80km with 2 passengers. 15ct per km = 12€
const CAR_TRIP: TransportExpenseInput = {
  mode: 'car' as const,
  origin: 'München',
  destination: 'Ingolstadt',
  distance: 80,
  passengers: ['Maria Musterfrau', 'Peter Beispiel'],
};

// 15€ ticket cost with BC50 -> 110% reimbursement = 16.50€
const PUBLIC_TRANSPORT_TRIP: TransportExpenseInput = {
  mode: 'public' as const,
  origin: 'München',
  destination: 'Ingolstadt',
  discount: 'BC50',
  price: 15,
};

// Plan trip = 14,50€
const PUBLIC_TRANSPORT_PLAN_TRIP: TransportExpenseInput = {
  mode: 'plan' as const,
  origin: 'München',
  destination: 'Ingolstadt',
};

// Bike = 13ct per km = 10.40€
const BIKE__TRIP: TransportExpenseInput = {
  mode: 'bike' as const,
  origin: 'München',
  destination: 'Ingolstadt',
  distance: 80,
};

const totalExpectedRefund = (
  (10.4 + //bike
    14.5 + //plan
    16.5 + //public transport
    12) * //car
  2
)
  .toFixed(2)
  .replace('.', ',');

test.describe('Reimbursement workflow', () => {
  test('completes course reimbursement end-to-end', async ({
    page,
    courseStepPage,
    participantStepPage,
    expensesStepPage,
    overviewStepPage,
  }) => {
    await courseStepPage.goto();
    await courseStepPage.clearPersistedForm();
    await expect(page).toHaveURL(/\/kurs$/);
    await expect(courseStepPage.courseCodeInput).toBeVisible();

    await courseStepPage.fill(COURSE_DETAILS);
    await courseStepPage.continue();
    await expect(page).toHaveURL(/\/teilnehmer_in$/);

    await participantStepPage.fillParticipant(PARTICIPANT);
    await participantStepPage.selectSection('Aachen');
    await participantStepPage.continue();
    await expect(page).toHaveURL(/\/auslagen$/);

    await expensesStepPage.addTransportExpense('Hinfahrt', BIKE__TRIP);
    await expensesStepPage.addTransportExpense(
      'Hinfahrt',
      PUBLIC_TRANSPORT_PLAN_TRIP,
    );
    await expensesStepPage.addTransportExpense(
      'Hinfahrt',
      PUBLIC_TRANSPORT_TRIP,
    );
    await expensesStepPage.addTransportExpense('Hinfahrt', CAR_TRIP);
    await expensesStepPage.completeReturnTrip();

    await expect(page.locator('app-expense-card')).toHaveCount(8);
    await expect(expensesStepPage.subtotal).toContainText('€');
    await expect(expensesStepPage.subtotal).toContainText(
      `${totalExpectedRefund}`,
    );

    await expensesStepPage.continue();
    await expect(page).toHaveURL(/\/zusammenfassung$/);

    await expect(
      page.getByRole('heading', { name: 'Zusammenfassung' }),
    ).toBeVisible();
    await expect(page.getByText(COURSE_DETAILS.name)).toBeVisible();
    await expect(
      page.getByText(`${PARTICIPANT.givenName} ${PARTICIPANT.familyName}`),
    ).toBeVisible();

    const receiptName = `Beleg-${Date.now()}-${Math.random().toString(16).slice(2)}.pdf`;
    const receiptPath = join(tmpdir(), receiptName);
    const attachmentPdf = await PDFDocument.create();
    const attachmentPage = attachmentPdf.addPage([300, 200]);
    attachmentPage.drawText(
      'OePNV Ticket 9b3ea5f2-e43b-44d0-83f3-e2d97dfff065',
      { x: 24, y: 120, size: 18 },
    );
    const attachmentBytes = await attachmentPdf.save();
    await writeFile(receiptPath, attachmentBytes);

    await overviewStepPage.uploadReceipt(receiptPath);
    const uploadedReceipt = overviewStepPage.receiptList.filter({
      hasText: receiptName,
    });
    await expect(uploadedReceipt).toHaveCount(1);

    const download = await overviewStepPage.downloadPdf();
    expect(download.suggestedFilename()).toMatch(
      /Fahrtkostenabrechnung_B123GA_Mustermann\.pdf/,
    );

    const downloadPath = await download.path();

    let pdfBuffer: Buffer;
    if (downloadPath) {
      pdfBuffer = await readFile(downloadPath);
    } else {
      const stream = await download.createReadStream();
      expect(stream).not.toBeNull();
      const chunks: Buffer[] = [];
      for await (const chunk of stream!) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      pdfBuffer = Buffer.concat(chunks);
    }

    const pdfContents = await pdfParse(pdfBuffer);
    expect(pdfContents.text).toContain(COURSE_DETAILS.name);
    expect(pdfContents.text).toContain(
      `${PARTICIPANT.givenName} ${PARTICIPANT.familyName}`,
    );
    expect(pdfContents.text).toContain('Fahrtkostenabrechnung');
    expect(pdfContents.text).toContain(totalExpectedRefund);
    expect(pdfContents.text).toContain(
      PARTICIPANT.iban.replace(/(.{4})/g, '$1 '),
    );
    expect(pdfContents.text).toContain(COURSE_DETAILS.code);
    expect(pdfContents.text).toContain(
      'OePNV Ticket 9b3ea5f2-e43b-44d0-83f3-e2d97dfff065',
    );

    await expect(
      page.getByRole('heading', { name: 'Schon fast fertig 🎉' }),
    ).toBeVisible();
  });
});
