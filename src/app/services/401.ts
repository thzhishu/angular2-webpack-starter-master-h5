import {Injectable} from '@angular/core';
import {Http,ConnectionBackend,RequestOptions,RequestOptionsArgs,Request,Response} from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomHttp extends Http {
  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions) {
                console.log('CustomHttp');
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    console.log('request...');
    return super.request(url, options);
  }

  get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    console.log('get...');
    return super.get(url, options);
  }
}
