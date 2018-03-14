

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {localEnv} from './local';

export const environment = {
  production: false,
  // URL of development API
    apiBaseUrl: localEnv.apiBaseUrl,
    apiUrl: localEnv.apiUrl,
    pictureUrl: localEnv.pictureUrl,
    eventPhotoUrl: localEnv.eventPhotoUrl, // eventPhotoUrl: 'http://localhost:8080/event-images/web/',
    publicApiBaseUrl: localEnv.publicApiBaseUrl,



/*  apiBaseUrl: 'http://163.53.151.3:8080',
  apiUrl: 'http://163.53.151.3:8080/auth/api',
  pictureUrl: 'http://163.53.151.3:8080/common/',
  eventPhotoUrl: 'http://163.53.151.3:8080/img/images/',
  publicApiBaseUrl: 'http://163.53.151.3:8080/public/api',*/

};
