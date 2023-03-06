import contextmenu from 'v-contextmenu';
import 'v-contextmenu/dist/themes/default.css';
import auth from './auth';
import throttle from './throttle';
import positiveinteger from './positiveinteger';

export function registerGlobalDirectives(app) {
  app.use(contextmenu);
  app.directive('auth', auth);
  app.directive('throttle', throttle);
  app.directive('positiveinteger', positiveinteger);
}
