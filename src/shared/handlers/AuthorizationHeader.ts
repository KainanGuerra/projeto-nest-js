import { AppError } from './AppError';

export const AuthorizationHeaders = {
  async authorizeUser(request: any) {
    const bearer = request.headers.authorization as string;
    if (!bearer) {
      throw new AppError('Auth token is missing', 401);
    }

    const token = bearer.split(' ')[1];
    const user = this.jwtService.decode(token);
    if (user) {
      request.user = user;
    } else {
      throw new AppError('Invalid auth token', 401);
    }
  },
  async innerAuthCheck(request: any) {
    const innerAuthToken = request.headers['inner-authorization'];

    if (!innerAuthToken) throw new AppError('Auth token is missing', 401);

    if (innerAuthToken === process.env.INNER_AUTH) {
    } else {
      throw new AppError('Invalid auth token', 401);
    }
  },
};
