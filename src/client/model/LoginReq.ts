'use strict';
import * as models from './models';

export interface LoginReq {
  phone:string;
  rnd:string;
  pwd:string;
}
