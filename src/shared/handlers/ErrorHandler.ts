import { AppError } from './AppError';

export const ErrorHandler = async (err: any) => {
  throw new AppError(`Error due to: ${err.message}`, err.status);
};
