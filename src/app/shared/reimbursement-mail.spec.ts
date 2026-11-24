import { Meeting } from 'src/domain/meeting.model';
import {
  buildReimbursementMail,
  REIMBURSEMENT_MAIL_ADDRESS,
  toMailtoHref,
} from './reimbursement-mail';

const course: Meeting = { type: 'course', name: 'Kletterkurs', code: 'K-123' };
const committee: Meeting = {
  type: 'committee',
  name: 'Landesjugendleitung',
  location: 'München',
  time: { start: new Date(2025, 0, 1), end: new Date(2025, 0, 2) },
};

describe('buildReimbursementMail', () => {
  it('should address the Landesgeschäftsstelle', () => {
    expect(buildReimbursementMail(course, 'Max').to).toBe(
      REIMBURSEMENT_MAIL_ADDRESS,
    );
  });

  it('should use the course code for courses', () => {
    const mail = buildReimbursementMail(course, 'Max');
    expect(mail.subject).toBe('Fahrtkostenabrechnung K-123');
    expect(mail.body).toContain('"K-123"');
  });

  it('should use the meeting name for committees', () => {
    const mail = buildReimbursementMail(committee, 'Max');
    expect(mail.subject).toBe('Fahrtkostenabrechnung Landesjugendleitung');
    expect(mail.body).toContain('"Landesjugendleitung"');
  });

  it('should use CRLF line breaks and end with the given name', () => {
    const { body } = buildReimbursementMail(course, 'Max');
    expect(body).not.toMatch(/(?<!\r)\n/);
    expect(body.endsWith('\r\n\r\nMax')).toBe(true);
  });
});

describe('toMailtoHref', () => {
  it('should percent-encode subject and body with CRLF as %0D%0A', () => {
    const href = toMailtoHref({
      to: 'a@b.de',
      subject: 'Betreff & mehr',
      body: 'Zeile 1\r\nZeile 2',
    });
    expect(href).toBe(
      'mailto:a@b.de?subject=Betreff%20%26%20mehr&body=Zeile%201%0D%0AZeile%202',
    );
  });
});
