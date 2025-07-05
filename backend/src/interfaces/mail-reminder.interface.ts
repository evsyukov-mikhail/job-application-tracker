export interface MailReminder {
  readonly userId: string;
  readonly date: Date;
  readonly subject: string;
  readonly text: string;
}