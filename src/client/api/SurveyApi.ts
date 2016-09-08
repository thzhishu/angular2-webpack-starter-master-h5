/**
 * 车门店 API
 * 前后端交互协议, 遵循以下约定:   1. 所有api都属于无状态接口   2. 除了/user/login,/_*_/sms,/user/register,/user/updatePwd接口，其他接口都要登录之后才能操作   3. 登录成功之后，后端每次都把token和shopId(当前门店)置入header,回传服务端   4. 客户端请求参数分两种:       1. 以form方式提交，可以附带store、pageNumber、pageSize参数       2. 以json方式提交，务必附带store、pageNumber、pageSize属性，如果没有值，为null   5. 服务端返回统一的json， 格式如下:       {        meta:{         code: 状态码         link: 链接         limit: 每页多少条         total:  总共多少条         current: 当前页         method: 方法         parameters: {  客户端的请求参数          startDate:开始时间          endDate:结束时间          ........:xxxx(请求参数都会在meta里面)                    },         store: { 客户端专用，保存交互状态的对象                  }         }        data:{ // 保存的数据，可能是array, object          object          list<object>          jsonArray        }        error:{           code:xxxxx (子状态码)           message:xxxxx        }       }            6. 公共状态(meta->code)约定如下:              500:             服务端处理失败， 返回json中存在error, meta对象， 不一定存在data对象          200:             成功， 返回json中有meta， data对象， 不存在error对象          401:             认证失败，用户的token过期或者token错误， 客户端需要引导用户重新登录          403:             授权失败， 一般出现在用户访问没有权限的资源, 返回json中存在error, meta对象          400:             参数错误,  客户端提交的参数不正确, 返回json中存在error, meta对象                 7. error的子状态码， 开发人员可以自行约定
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Http, Headers, RequestOptionsArgs, Response, URLSearchParams} from '@angular/http';
import {Injectable, Optional} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as models from '../model/models';
import 'rxjs/Rx';

import { Cookie } from 'services';  //tobeplus 缓存注入 header

/* tslint:disable:no-unused-variable member-ordering */

'use strict';

@Injectable()
export class SurveyApi {
  protected basePath = '/api/v1';
  public defaultHeaders: Headers = new Headers();

  constructor(protected http: Http, @Optional() basePath: string) {
    if (basePath) {
      this.basePath = basePath;
    }
  }

  /**
   * 加载问卷，默认一次加载所有页，以后如果有逻辑，建议客户端实现或服务端提供显示、隐藏某些题的接口
   *
   * @param url 问卷的url
   */
  public surveyLoadUrlGet(url: string, extraHttpRequestParams?: any): Observable<models.SurveyResponse> {
    const path = this.basePath + '/survey/load/{url}'
      .replace('{' + 'url' + '}', String(url));

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    // verify required parameter 'url' is not null or undefined
    if (url === null || url === undefined) {
      throw new Error('Required parameter url was null or undefined when calling surveyLoadUrlGet.');
    }
    let requestOptions: RequestOptionsArgs = {
      method: 'GET',
      headers: headerParams,
      search: queryParameters
    };

    return this.http.request(path, requestOptions)
      .map((response: Response) => {
        if (response.status === 204) {
          return undefined;
        } else {
          return response.json();
        }
      });
  }

  /**
   * 提交问卷数据， 可以单题提交， 可以多题提交
   *
   * @param url 问卷的url
   * @param payload 答案的array json
   */
  public surveyUrlSubmitPost(url: string, payload: models.SurveySubmitRequest, extraHttpRequestParams?: any): Observable<models.SurveySubmitResponse> {
    const path = this.basePath + '/survey/{url}/submit'
      .replace('{' + 'url' + '}', String(url));

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header

    headerParams.set('Content-Type', 'application/json');

    // verify required parameter 'url' is not null or undefined
    if (url === null || url === undefined) {
      throw new Error('Required parameter url was null or undefined when calling surveyUrlSubmitPost.');
    }
    // verify required parameter 'payload' is not null or undefined
    if (payload === null || payload === undefined) {
      throw new Error('Required parameter payload was null or undefined when calling surveyUrlSubmitPost.');
    }
    let requestOptions: RequestOptionsArgs = {
      method: 'POST',
      headers: headerParams,
      search: queryParameters
    };
    requestOptions.body = JSON.stringify(payload);

    return this.http.request(path, requestOptions)
      .map((response: Response) => {
        if (response.status === 204) {
          return undefined;
        } else {
          return response.json();
        }
      });
  }

}
