import { Meeting } from 'src/domain/meeting.model';

export const REIMBURSEMENT_MAIL_ADDRESS = 'lgs@jdav-bayern.de';

export interface ReimbursementMail {
  to: string;
  subject: string;
  body: string;
}

export function buildReimbursementMail(
  meeting: Meeting,
  givenName: string,
): ReimbursementMail {
  const title = meeting.type === 'course' ? meeting.code : meeting.name;
  // RFC 6068 requires CRLF line breaks in mailto bodies; bare LF is
  // mangled by some clients (e.g. Outlook).
  const body = [
    'Hallo liebe Landesgeschäftsstelle,',
    '',
    `anbei meine Fahrtkostenabrechnung für die Veranstaltung "${title}".`,
    '',
    'Vielen Dank und beste Grüße',
    '',
    givenName,
  ].join('\r\n');

  return {
    to: REIMBURSEMENT_MAIL_ADDRESS,
    subject: `Fahrtkostenabrechnung ${title}`,
    body,
  };
}

export function toMailtoHref({ to, subject, body }: ReimbursementMail): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
