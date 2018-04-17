const host = "http://localhost:8080";
export const localEnv = {
  production: false,
  // URL of development API
  apiBaseUrl: host,
  apiUrl: host+'/auth/api',
  pictureUrl: host+'/common/',
  eventPhotoUrl: host+'/img/images/', // eventPhotoUrl: 'http://localhost:8080/event-images/web/',
  eventPhotoSharingUrl: host+'/img/social-sharing/',
  publicApiBaseUrl: host+'/public/api',



  // apiBaseUrl: 'http://163.53.151.3:8080',
  // apiUrl: 'http://163.53.151.3:8080/auth/api',
  // pictureUrl: 'http://163.53.151.3:8080/common/',
  // eventPhotoUrl: 'http://163.53.151.3:8080/img/images/',
  // publicApiBaseUrl: 'http://163.53.151.3:8080/public/api',

};
