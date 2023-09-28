export class EmailMasker {
  static mask(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = `${username.substring(0, 3)}...${username.slice(
      -2,
    )}`;
    return `${maskedUsername}@${domain}`;
  }
}
