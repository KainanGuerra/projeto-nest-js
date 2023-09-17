export class AppError {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly details?: Array<any>;

  constructor(message: string, status: number, details?: Array<any>) {
    this.message = message;
    this.statusCode = status;
    this.details = details;
  }
}
