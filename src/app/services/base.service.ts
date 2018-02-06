import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class BaseService {

  API_URL = environment.apiUrl;

  constructor() { }

}
