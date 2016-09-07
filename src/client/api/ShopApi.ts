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
export class ShopApi {
    protected basePath = '/api/v1';
    public defaultHeaders : Headers = new Headers();

    constructor(protected http: Http, @Optional() basePath: string) {
        if (basePath) {
            this.basePath = basePath;
        }
    }

    /**
     * 批量注册门店
     *
     * @param payload product
     */
    public shopBatchSavePost (payload: Array<models.Shop>, extraHttpRequestParams?: any ) : Observable<models.ShopResponse> {
        const path = this.basePath + '/shop/batchSave';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
        headerParams.set('Content-Type', 'application/json');

        // verify required parameter 'payload' is not null or undefined
        if (payload === null || payload === undefined) {
            throw new Error('Required parameter payload was null or undefined when calling shopBatchSavePost.');
        }
        let requestOptions: RequestOptionsArgs = {
            method: 'POST',
            headers: headerParams,
            search: queryParameters
        };
        requestOptions.body = JSON.stringify(payload);

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {                     window.location.href = '/#/login';                     return undefined;                 } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {   alert('您离开时间过长,需要重新登录');                         window.location.href = '/#/login';                     return undefined;}                     return response.json();
                }
            });
    }

    /**
     * 逻辑删除门店，注意： 如果门店已经存在服务、员工、顾客， 则删除门店需要手机验证码.
     * 客户端做法:  1. 客户端调用此方法，如果返回值askForCode&#x3D;1, 则要求用户输入验证码，客户端再次调用delete方法  2. 客户端调用此方法，如果返回值askForCode&lt;&gt;1，说明删除成功 服务端做法:  1. 如果code为空， 判断该门店是否有服务、员工、顾客      1.1 如果有, 则返回 askForCode&#x3D;1， 不删除      1.2 如果没有， 直接删除  2. 如果code不为空， 验证是否合法， 以此决定是否删除
     * @param id 门店id
     * @param code 手机验证码
     */
    public shopDeleteDelete (id: string, code?: string, extraHttpRequestParams?: any ) : Observable<models.ShopResponseEx> {
        const path = this.basePath + '/shop/delete';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;
        let formParams = new URLSearchParams();

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
        headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling shopDeleteDelete.');
        }
        if (id !== undefined) {
            queryParameters.set('id', id);
        }

        if (code !== undefined) {
            queryParameters.set('code', code);
        }

        formParams.append('id', id);
        formParams.append('code', code);

        let requestOptions: RequestOptionsArgs = {
            method: 'DELETE',
            headers: headerParams,
            search: queryParameters
        };
        requestOptions.body = formParams.toString();

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {                     window.location.href = '/#/login';                     return undefined;                 } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {   alert('您离开时间过长,需要重新登录');                         window.location.href = '/#/login';                     return undefined;}                     return response.json();
                }
            });
    }

    /**
     * 发送删除门店验证码
     *
     * @param mobile 手机号
     * @param rnd 4位随机数， 客户端生成
     * @param sign 签名, md5(phone+rnd+salt)， 其中salt&#x3D;thzs0708, 不符合签名的请求一律返回错误
     */
    public shopDeleteSmsPost (mobile: string, rnd: string, sign: string, extraHttpRequestParams?: any ) : Observable<models.CommonResponse> {
        const path = this.basePath + '/shop/delete/sms';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header

        let formParams = new URLSearchParams();

        // verify required parameter 'mobile' is not null or undefined
        if (mobile === null || mobile === undefined) {
            throw new Error('Required parameter mobile was null or undefined when calling shopDeleteSmsPost.');
        }
        // verify required parameter 'rnd' is not null or undefined
        if (rnd === null || rnd === undefined) {
            throw new Error('Required parameter rnd was null or undefined when calling shopDeleteSmsPost.');
        }
        // verify required parameter 'sign' is not null or undefined
        if (sign === null || sign === undefined) {
            throw new Error('Required parameter sign was null or undefined when calling shopDeleteSmsPost.');
        }
        headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

        formParams.append('mobile',mobile);
        formParams.append('rnd',rnd);
        formParams.append('sign',sign);
        let requestOptions: RequestOptionsArgs = {
            method: 'POST',
            headers: headerParams,
            search: queryParameters
        };
        requestOptions.body = formParams.toString();

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {                     window.location.href = '/#/login';                     return undefined;                 } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {   alert('您离开时间过长,需要重新登录');                         window.location.href = '/#/login';                     return undefined;}                     return response.json();
                }
            });
    }

    /**
     * 获取我们的门店列表，用户凭证从http header读取
     *
     * @param token 用户的登录凭证
     */
    public shopMyshopGet (extraHttpRequestParams?: any ) : Observable<models.MyShopResponse> {
        const path = this.basePath + '/shop/myshop';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header

        let requestOptions: RequestOptionsArgs = {
            method: 'GET',
            headers: headerParams,
            search: queryParameters
        };

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {                     window.location.href = '/#/login';                     return undefined;                 } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {   alert('您离开时间过长,需要重新登录');                         window.location.href = '/#/login';                     return undefined;}                     return response.json();
                }
            });
    }

    /**
     * 注册新门店， 疑问总店标记， 店主标识， 分店或分支机构代码， 代码类型??
     *
     * @param payload product
     */
    public shopRegisterPost (payload: models.Shop, extraHttpRequestParams?: any ) : Observable<models.ShopResponse> {
        const path = this.basePath + '/shop/register';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
        headerParams.set('Content-Type', 'application/json');

        // verify required parameter 'payload' is not null or undefined
        if (payload === null || payload === undefined) {
            throw new Error('Required parameter payload was null or undefined when calling shopRegisterPost.');
        }
        let requestOptions: RequestOptionsArgs = {
            method: 'POST',
            headers: headerParams,
            search: queryParameters
        };
        requestOptions.body = JSON.stringify(payload);

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {                     window.location.href = '/#/login';                     return undefined;                 } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {   alert('您离开时间过长,需要重新登录');                         window.location.href = '/#/login';                     return undefined;}                     return response.json();
                }
            });
    }

    /**
     * 查询某个门店，用户凭证从http header读取
     *
     * @param token 用户的登录凭证
     * @param shopId 门店id
     */
    public shopShopIdGet (token: string, shopId: string, extraHttpRequestParams?: any ) : Observable<models.MyShopResponse> {
        const path = this.basePath + '/shop/{shopId}'
            .replace('{' + 'shopId' + '}', String(shopId));
        
        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header

        let requestOptions: RequestOptionsArgs = {
            method: 'GET',
            headers: headerParams,
            search: queryParameters
        };

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {
                    window.location.href = '/#/login';
                    return undefined;
                } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {
                        alert('您离开时间过长,需要重新登录');
                        window.location.href = '/#/login';
                        return undefined;
                    }
                    return response.json();
                }
            });
    }

    /**
     * 更新门店
     *
     * @param payload 更新的门店对象数组
     */
    public shopUpdatePost (payload: Array<models.Shop>, extraHttpRequestParams?: any ) : Observable<models.ShopResponse> {
        const path = this.basePath + '/shop/update';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
        headerParams.set('Content-Type', 'application/json');

        // verify required parameter 'payload' is not null or undefined
        if (payload === null || payload === undefined) {
            throw new Error('Required parameter payload was null or undefined when calling shopUpdatePost.');
        }
        let requestOptions: RequestOptionsArgs = {
            method: 'POST',
            headers: headerParams,
            search: queryParameters
        };
        requestOptions.body = JSON.stringify(payload);

        return this.http.request(path, requestOptions)
            .map((response: Response) => {
                if (response.status === 401||response.status === 403) {                     window.location.href = '/#/login';                     return undefined;                 } else if (response.status === 204) {
                    return undefined;
                } else {
                    if (response.json().meta&&response.json().meta.code === 401) {   alert('您离开时间过长,需要重新登录');                         window.location.href = '/#/login';                     return undefined;}                     return response.json();
                }
            });
    }



}
