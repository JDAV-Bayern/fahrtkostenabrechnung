import { expect, test } from './fixtures';
import { readPdf } from './pdf';
import {
  CommitteeStepPage,
  DateTimeInput,
  ExpensesStepPage,
  ParticipantStepPage,
  TransportExpenseInput,
} from './poms';

const MEETING = {
  purpose: 'Landesjugendausschuss',
  location: 'Bamberg',
} as const;

// Three days: arrival (14 €), intermediate (28 €) and return (14 €)
const START: DateTimeInput = { date: '1.3.2025', time: '10:00' };
const END: DateTimeInput = { date: '3.3.2025', time: '18:00' };

const PARTICIPANT = {
  givenName: 'Max',
  familyName: 'Mustermann',
  zipCode: '80331',
  city: 'München',
  iban: 'DE44500105175407324931',
} as const;

// 230 km without passengers, 10 ct per km = 23 € per direction
const CAR_TRIP: TransportExpenseInput = {
  mode: 'car',
  origin: 'München',
  destination: 'Bamberg',
  distance: 230,
};

async function fillMeetingStep(
  committeeStepPage: CommitteeStepPage,
  start: DateTimeInput = START,
  end: DateTimeInput = END,
) {
  await committeeStepPage.goto();
  await committeeStepPage.clearPersistedForm();
  await committeeStepPage.fillMeetingDetails(MEETING);
  await committeeStepPage.setStart(start);
  await committeeStepPage.setEnd(end);
}

async function fillParticipantStep(participantStepPage: ParticipantStepPage) {
  await participantStepPage.fillParticipant(PARTICIPANT);
  await participantStepPage.selectSection('Bamberg');
  await participantStepPage.continue();
}

async function fillTransportStep(expensesStepPage: ExpensesStepPage) {
  await expensesStepPage.addTransportExpense('Hinfahrt', CAR_TRIP);
  await expensesStepPage.completeReturnTrip();
  await expensesStepPage.continue();
}

test.describe('Committee reimbursement workflow', () => {
  test('completes committee reimbursement with per diem end-to-end', async ({
    page,
    committeeStepPage,
    participantStepPage,
    expensesStepPage,
    expensesExtraStepPage,
    overviewStepPage,
  }, testInfo) => {
    await fillMeetingStep(committeeStepPage);
    // the overnight option only exists for meetings spanning two days
    await expect(committeeStepPage.overnightCheckbox).toHaveCount(0);
    await committeeStepPage.continue();
    await expect(page).toHaveURL(/\/fahrtkosten-gremium\/teilnehmer_in$/);

    await fillParticipantStep(participantStepPage);
    await expect(page).toHaveURL(/\/fahrtkosten-gremium\/auslagen$/);

    await expensesStepPage.addTransportExpense('Hinfahrt', CAR_TRIP);
    await expensesStepPage.completeReturnTrip();
    await expect(page.locator('jdav-transport-expense-card')).toHaveCount(2);
    await expect(expensesStepPage.subtotal).toContainText('46,00');
    await expensesStepPage.continue();
    await expect(page).toHaveURL(/\/fahrtkosten-gremium\/auslagen-sonstiges$/);

    // per diem is offered for every day of the meeting
    await expensesExtraStepPage.enablePerDiem();
    await expect(expensesExtraStepPage.foodCards).toHaveCount(3);
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '56,00',
    );

    // free breakfast reduces the intermediate day by 20% of 28 €
    await expensesExtraStepPage.toggleMealAllowance(1, 'breakfast');
    await expect(expensesExtraStepPage.foodCards.nth(1)).toContainText('22,40');
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '50,40',
    );
    await expect(expensesExtraStepPage.subtotal('Summe')).toContainText(
      '96,40',
    );
    await expensesExtraStepPage.continue();

    await expect(page).toHaveURL(/\/fahrtkosten-gremium\/zusammenfassung$/);
    await expect(page.getByText(MEETING.purpose)).toBeVisible();
    await expect(overviewStepPage.summaryRow('Fahrtkosten')).toContainText(
      '46,00',
    );
    await expect(overviewStepPage.summaryRow('Tagegeld')).toContainText(
      '50,40',
    );
    await expect(
      overviewStepPage.summaryRow('Erstattungsbetrag'),
    ).toContainText('96,40');
    // car trips need no receipts
    await expect(overviewStepPage.receiptDropArea).toHaveCount(0);

    const download = await overviewStepPage.downloadPdf();
    expect(download.suggestedFilename()).toBe(
      'Fahrtkostenabrechnung_Mustermann_20250301.pdf',
    );

    const pdf = await readPdf(download);
    await testInfo.attach('Fahrtkostenabrechnung.pdf', {
      body: pdf.buffer,
      contentType: 'application/pdf',
    });

    expect(pdf.text).toContain('Gremium');
    expect(pdf.text).toContain(MEETING.purpose);
    expect(pdf.text).toContain(MEETING.location);
    expect(pdf.text).toContain('Tagegeld');
    expect(pdf.text).toContain('50,40');
    expect(pdf.text).toContain('96,40');
    expect(pdf.text).toContain(
      `${PARTICIPANT.givenName} ${PARTICIPANT.familyName}`,
    );
    expect(pdf.text).toContain(PARTICIPANT.iban.replace(/(.{4})/g, '$1 '));

    await expect(
      page.getByRole('heading', { name: 'Schon fast fertig 🎉' }),
    ).toBeVisible();
  });

  test('pays per diem for arrival and return with an overnight stay', async ({
    committeeStepPage,
    participantStepPage,
    expensesStepPage,
    expensesExtraStepPage,
  }) => {
    // 18 hours spanning two days
    await fillMeetingStep(
      committeeStepPage,
      { date: '1.3.2025', time: '18:00' },
      { date: '2.3.2025', time: '12:00' },
    );
    await expect(committeeStepPage.overnightCheckbox).toBeVisible();
    await expect(committeeStepPage.overnightCheckbox).not.toBeChecked();
    await committeeStepPage.continue();
    await fillParticipantStep(participantStepPage);
    await fillTransportStep(expensesStepPage);

    // without overnight stay only a single day is paid
    await expensesExtraStepPage.enablePerDiem();
    await expect(expensesExtraStepPage.foodCards).toHaveCount(1);
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '14,00',
    );

    await committeeStepPage.goto();
    await committeeStepPage.setOvernight(true);
    await committeeStepPage.continue();
    await participantStepPage.continue();
    await expensesStepPage.continue();

    await expect(expensesExtraStepPage.foodCards).toHaveCount(2);
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '28,00',
    );
  });

  test('restores the form after a reload and clears it on delete', async ({
    page,
    committeeStepPage,
    participantStepPage,
    expensesStepPage,
    expensesExtraStepPage,
  }) => {
    await fillMeetingStep(committeeStepPage);
    await committeeStepPage.continue();
    await fillParticipantStep(participantStepPage);
    await fillTransportStep(expensesStepPage);

    await expensesExtraStepPage.enablePerDiem();
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '56,00',
    );

    await page.reload();

    // per diem settings and expenses survive the reload
    await expect(page).toHaveURL(/\/fahrtkosten-gremium\/auslagen-sonstiges$/);
    await expect(expensesExtraStepPage.foodCards).toHaveCount(3);
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '56,00',
    );
    await expect(expensesExtraStepPage.subtotal('Fahrkosten')).toContainText(
      '46,00',
    );

    // earlier steps are restored as well
    await committeeStepPage.goto();
    await expect(committeeStepPage.purposeInput).toHaveValue(MEETING.purpose);
    await expect(committeeStepPage.locationInput).toHaveValue(MEETING.location);
    await page.goto('/fahrtkosten-gremium/teilnehmer_in');
    await expect(participantStepPage.givenNameInput).toHaveValue(
      PARTICIPANT.givenName,
    );
    // the IBAN is displayed in groups of four
    await expect(participantStepPage.ibanInput).toHaveValue(
      'DE44 5001 0517 5407 3249 31',
    );

    await participantStepPage.clearPersistedForm();
    await expect(page).toHaveURL(/\/fahrtkosten-gremium\/reisedaten$/);
    await expect(committeeStepPage.purposeInput).toHaveValue('');

    await page.reload();
    await expect(committeeStepPage.purposeInput).toHaveValue('');
    await expect(committeeStepPage.locationInput).toHaveValue('');
    await expect(committeeStepPage.nextButton).toBeDisabled();
  });

  // Known bug: the date inputs emit the restored meeting time again after a
  // reload, which rebuilds the food expenses and resets the selected meals
  // (see ReimbursementControlService.updateFoodExpenses).
  // Remove `test.fail()` once fixed.
  test('keeps the selected meals after a reload', async ({
    page,
    committeeStepPage,
    participantStepPage,
    expensesStepPage,
    expensesExtraStepPage,
  }) => {
    test.fail();

    await fillMeetingStep(committeeStepPage);
    await committeeStepPage.continue();
    await fillParticipantStep(participantStepPage);
    await fillTransportStep(expensesStepPage);

    await expensesExtraStepPage.enablePerDiem();
    await expensesExtraStepPage.toggleMealAllowance(1, 'breakfast');
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '50,40',
    );

    await page.reload();

    await expect(expensesExtraStepPage.foodCards).toHaveCount(3);
    await expect(
      expensesExtraStepPage.mealCheckbox(1, 'breakfast'),
    ).toBeChecked({ timeout: 2000 });
    await expect(expensesExtraStepPage.subtotal('Tagegelder')).toContainText(
      '50,40',
    );
  });

  // Known bug: the expenses extra step is OnPush and reads the food form
  // without signals, so it is only re-rendered when a total changes. Without
  // transport costs it keeps showing "unter 8 Stunden" and offers no per diem,
  // and the participant cannot continue. Remove `test.fail()` once fixed.
  test('offers per diem without any transport expenses', async ({
    committeeStepPage,
    participantStepPage,
    expensesStepPage,
    expensesExtraStepPage,
  }) => {
    test.fail();

    await fillMeetingStep(committeeStepPage);
    await committeeStepPage.continue();
    await fillParticipantStep(participantStepPage);
    await expensesStepPage.continue();

    await expect(expensesExtraStepPage.enablePerDiemButton).toBeVisible({
      timeout: 2000,
    });
  });
});
