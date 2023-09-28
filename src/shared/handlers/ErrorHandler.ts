import { AppError } from './AppError';

export class ErrorHandler {
  async attributeError(err) {
    throw new AppError(`Error due to: ${err.message}`, err.status);
  }
}
