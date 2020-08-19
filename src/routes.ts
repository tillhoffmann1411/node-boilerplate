import { UsersRoutes } from './routes/users.routes';
import { RefreshTokenRoutes } from './routes/refresh-token.routes';


export const routes = [
  new UsersRoutes('/users'),
  new RefreshTokenRoutes('/refresh-token'),
];