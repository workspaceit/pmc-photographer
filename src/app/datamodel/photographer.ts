export class Photographer {

  id: number;
  fullName: string;
  phoneNumber: string;
  userName: string;
  email: string;
  profilePhoto: string;
  active: string;
  authorities = [];
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
