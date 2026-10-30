import { expect, test } from './fixtures';
import { CourseStepPage, ParticipantStepPage } from './poms';

const COURSE = { code: 'B123GA', name: 'Sicherheitskurs Alpin' } as const;

const PARTICIPANT = {
  givenName: 'Max',
  familyName: 'Mustermann',
  zipCode: '80331',
  city: 'München',
  iban: 'DE44500105175407324931',
} as const;

const SWISS_IBAN = 'CH9300762011623852957';

async function startCourseForm(courseStepPage: CourseStepPage) {
  await courseStepPage.goto();
  await courseStepPage.clearPersistedForm();
}

async function fillParticipantStep(participantStepPage: ParticipantStepPage) {
  await participantStepPage.fillParticipant(PARTICIPANT);
  await participantStepPage.selectSection('Bamberg');
}

test.describe('Step guarding', () => {
  test('redirects deep links to the first step of an empty form', async ({
    page,
    courseStepPage,
  }) => {
    await startCourseForm(courseStepPage);

    await page.goto('/fahrtkosten/zusammenfassung');
    await expect(page).toHaveURL(/\/fahrtkosten\/kurs$/);
    await expect(courseStepPage.courseCodeInput).toBeVisible();
  });

  test('redirects deep links to the first invalid step', async ({
    page,
    courseStepPage,
    participantStepPage,
  }) => {
    await startCourseForm(courseStepPage);
    await courseStepPage.fill(COURSE);
    await courseStepPage.continue();
    await expect(page).toHaveURL(/\/fahrtkosten\/teilnehmer_in$/);

    // the participant step is still incomplete
    await page.goto('/fahrtkosten/zusammenfassung');
    await expect(page).toHaveURL(/\/fahrtkosten\/teilnehmer_in$/);

    // once all previous steps are valid the deep link is allowed
    await fillParticipantStep(participantStepPage);
    await page.goto('/fahrtkosten/auslagen');
    await expect(page).toHaveURL(/\/fahrtkosten\/auslagen$/);
  });

  test('redirects unknown steps to the first step', async ({
    page,
    courseStepPage,
  }) => {
    await startCourseForm(courseStepPage);

    await page.goto('/fahrtkosten/gibt-es-nicht');
    await expect(page).toHaveURL(/\/fahrtkosten\/kurs$/);
  });
});

test.describe('Step validation', () => {
  test('requires a valid course of JDAV Bayern', async ({
    page,
    courseStepPage,
  }) => {
    await startCourseForm(courseStepPage);
    await expect(courseStepPage.nextButton).toBeDisabled();

    await courseStepPage.fill({ code: 'J123', name: COURSE.name });
    await expect(page.getByText('Kurs des Bundesverbands')).toBeVisible();
    await expect(courseStepPage.nextButton).toBeDisabled();

    await courseStepPage.fill({ code: 'B12FB' });
    await courseStepPage.courseCodeInput.blur();
    await expect(
      page.getByText('Bitte gib eine gültige Kursnummer an.'),
    ).toBeVisible();
    await expect(courseStepPage.nextButton).toBeDisabled();

    await courseStepPage.fill({ code: COURSE.code });
    await expect(courseStepPage.nextButton).toBeEnabled();
  });

  test('requires a valid IBAN', async ({
    page,
    courseStepPage,
    participantStepPage,
  }) => {
    await startCourseForm(courseStepPage);
    await courseStepPage.fill(COURSE);
    await courseStepPage.continue();

    await fillParticipantStep(participantStepPage);
    await expect(participantStepPage.nextButton).toBeEnabled();
    // no BIC is needed for German IBANs
    await expect(participantStepPage.bicInput).toHaveCount(0);

    await participantStepPage.ibanInput.fill('DE44500105175407324932');
    await participantStepPage.ibanInput.blur();
    await expect(
      page.getByText('Bitte gib eine gültige IBAN ein.'),
    ).toBeVisible();
    await expect(participantStepPage.nextButton).toBeDisabled();

    await participantStepPage.ibanInput.fill(PARTICIPANT.iban);
    await expect(participantStepPage.nextButton).toBeEnabled();
  });

  test('requires a BIC for Swiss IBANs', async ({
    page,
    courseStepPage,
    participantStepPage,
  }) => {
    await startCourseForm(courseStepPage);
    await courseStepPage.fill(COURSE);
    await courseStepPage.continue();

    await fillParticipantStep(participantStepPage);
    await participantStepPage.ibanInput.fill(SWISS_IBAN);
    await expect(participantStepPage.bicInput).toBeVisible();
    await expect(participantStepPage.nextButton).toBeDisabled();

    await participantStepPage.bicInput.fill('UBS');
    await participantStepPage.bicInput.blur();
    await expect(
      page.getByText('Bitte gib eine gültige BIC ein.'),
    ).toBeVisible();
    await expect(participantStepPage.nextButton).toBeDisabled();

    await participantStepPage.bicInput.fill('UBSWCHZH80A');
    await expect(participantStepPage.nextButton).toBeEnabled();

    // switching back to a German IBAN removes the BIC again
    await participantStepPage.ibanInput.fill(PARTICIPANT.iban);
    await expect(participantStepPage.bicInput).toHaveCount(0);
    await expect(participantStepPage.nextButton).toBeEnabled();
  });

  test('requires a total above 0 €', async ({
    page,
    courseStepPage,
    participantStepPage,
    expensesStepPage,
    expensesExtraStepPage,
  }) => {
    await startCourseForm(courseStepPage);
    await courseStepPage.fill(COURSE);
    await courseStepPage.continue();
    await fillParticipantStep(participantStepPage);
    await participantStepPage.continue();

    // transport expenses are optional
    await expensesStepPage.continue();
    await expect(page).toHaveURL(/\/fahrtkosten\/auslagen-sonstiges$/);
    await expect(expensesExtraStepPage.totalRequiredError).toBeVisible();
    await expect(expensesExtraStepPage.nextButton).toBeDisabled();

    // the overview can not be reached via deep link either
    await page.goto('/fahrtkosten/zusammenfassung');
    await expect(page).toHaveURL(/\/fahrtkosten\/auslagen-sonstiges$/);

    await expensesExtraStepPage.addMaterialExpense({
      date: '2024-06-01',
      purpose: 'Parkgebühr',
      amount: 5,
    });
    await expect(expensesExtraStepPage.totalRequiredError).toHaveCount(0);
    await expect(expensesExtraStepPage.nextButton).toBeEnabled();
    await expensesExtraStepPage.continue();
    await expect(page).toHaveURL(/\/fahrtkosten\/zusammenfassung$/);
  });
});
