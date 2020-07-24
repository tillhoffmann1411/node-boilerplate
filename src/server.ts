import App from './app';
import { routes } from './routes';

const app = new App(routes);

app.start();