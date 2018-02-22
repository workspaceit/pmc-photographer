


export class OauthCredential {
  access_token: string;
  token_type:string;
  refresh_token:string;
  expires_in:number;
  scope:string;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
