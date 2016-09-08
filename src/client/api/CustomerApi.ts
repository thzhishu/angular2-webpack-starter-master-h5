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
export class CustomerApi {
    protected basePath = '/api/v1';
    public defaultHeaders : Headers = new Headers();

    constructor(protected http: Http, @Optional() basePath: string) {
        if (basePath) {
            this.basePath = basePath;
        }
    }

    /**
     * 删除顾客信息
     * 根据顾客id删除顾客
     * @param customerId 顾客id
     */
    public customerCustomerIdDeleteDelete (customerId: string, extraHttpRequestParams?: any ) : Observable<models.CommonResponse> {
        const path = this.basePath + '/customer/{customerId}/delete'
            .replace('{' + 'customerId' + '}', String(customerId));

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        // verify required parameter 'customerId' is not null or undefined
        if (customerId === null || customerId === undefined) {
            throw new Error('Required parameter customerId was null or undefined when calling customerCustomerIdDeleteDelete.');
        }
        let requestOptions: RequestOptionsArgs = {
            method: 'DELETE',
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
     * 根据用户id返回顾客信息
     * 根据用户id返回顾客信息
     * @param customerId 用户id
     */
    public customerCustomerIdGet (customerId: string, extraHttpRequestParams?: any ) : Observable<models.CustomerResponse> {
        const path = this.basePath + '/customer/{customerId}'
            .replace('{' + 'customerId' + '}', String(customerId));

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        // verify required parameter 'customerId' is not null or undefined
        if (customerId === null || customerId === undefined) {
            throw new Error('Required parameter customerId was null or undefined when calling customerCustomerIdGet.');
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
     * 根据顾客id获取顾客详情和历史生意记录
     *
     * @param customerId 顾客id
     * @param pageNumber 当前页
     * @param pageSize 分页大小
     */
    public customerHistoryCustomerIdGet (customerId: string, pageNumber?: number, pageSize?: number, extraHttpRequestParams?: any ) : Observable<models.CustomerSearchResponse> {
        const path = this.basePath + '/customer/history/{customerId}'
            .replace('{' + 'customerId' + '}', String(customerId));

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        // verify required parameter 'customerId' is not null or undefined
        if (customerId === null || customerId === undefined) {
            throw new Error('Required parameter customerId was null or undefined when calling customerHistoryCustomerIdGet.');
        }
        if (pageNumber !== undefined) {
            queryParameters.set('pageNumber', String(pageNumber));
        }

        if (pageSize !== undefined) {
            queryParameters.set('pageSize', String(pageSize));
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
     * 根据顾客id获取顾客详情和历史生意记录
     *
     * @param pageNumber 当前页
     * @param pageSize 分页大小
     */
    public customerListGet (pageNumber?: number, pageSize?: number, extraHttpRequestParams?: any ) : Observable<models.CustomerListResponse> {
        const path = this.basePath + '/customer/list';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        if (pageNumber !== undefined) {
            queryParameters.set('pageNumber', String(pageNumber));
        }

        if (pageSize !== undefined) {
            queryParameters.set('pageSize', String(pageSize));
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
     * 新增或者顾客信息
     *
     * @param vehicleLicence 车牌号
     * @param id 顾客id，如果新用户，则为null，如果老用户，则update
     * @param mobile 手机号
     * @param vehicleFrame 车架号
     * @param name 客户姓名
     * @param birthYear 出生年份
     * @param gender 性别,0女，1男， 2其他
     * @param vehicleBrand 车品牌
     * @param vehicleModel 车型号
     * @param vehicleYear 购买年份
     * @param vehicleMiles 行驶里程
     */
    public customerSaveOrUpdatePost (vehicleLicence: string, id?: string, mobile?: string, vehicleFrame?: string, name?: string, birthYear?: number, gender?: number, vehicleBrand?: string, vehicleModel?: string, vehicleYear?: string, vehicleMiles?: string, extraHttpRequestParams?: any ) : Observable<models.CustomerResponse> {
        const path = this.basePath + '/customer/saveOrUpdate';

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        let formParams = new URLSearchParams();

        // verify required parameter 'vehicleLicence' is not null or undefined
        if (vehicleLicence === null || vehicleLicence === undefined) {
            throw new Error('Required parameter vehicleLicence was null or undefined when calling customerSaveOrUpdatePost.');
        }
        headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

        formParams.append('id',id);
        formParams.append('vehicleLicence',vehicleLicence);
        formParams.append('mobile',mobile);
        formParams.append('vehicleFrame',vehicleFrame);
        formParams.append('name',name);
        formParams.append('birthYear',String(birthYear));
        formParams.append('gender',String(gender));
        formParams.append('vehicleBrand',vehicleBrand);
        formParams.append('vehicleModel',vehicleModel);
        formParams.append('vehicleYear',vehicleYear);
        formParams.append('vehicleMiles',vehicleMiles);
        let requestOptions: RequestOptionsArgs = {
            method: 'POST',
            headers: headerParams,
            search: queryParameters
        };
        requestOptions.body = formParams.toString();

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
     * 根据手机号和车牌号检索用户， 分两种情况:  1. 客户端先读取返回结构的customers:array， 如果array.length&gt;0，则显示客户列表  2. 如果customers只有一个用户， 则显示单用户信息，并且读取histories显示交易明细
     *
     * @param phoneOrVehicleLicence 手机号or车牌号
     * @param pageNumber 当前页
     * @param pageSize 分页大小
     */
    public customerSearchPhoneOrVehicleLicenceGet (phoneOrVehicleLicence: string, pageNumber?: number, pageSize?: number, extraHttpRequestParams?: any ) : Observable<models.CustomerSearchResponse> {
        const path = this.basePath + '/customer/search/{phoneOrVehicleLicence}'
            .replace('{' + 'phoneOrVehicleLicence' + '}', String(phoneOrVehicleLicence));

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        // verify required parameter 'phoneOrVehicleLicence' is not null or undefined
        if (phoneOrVehicleLicence === null || phoneOrVehicleLicence === undefined) {
            throw new Error('Required parameter phoneOrVehicleLicence was null or undefined when calling customerSearchPhoneOrVehicleLicenceGet.');
        }
        if (pageNumber !== undefined) {
            queryParameters.set('pageNumber', String(pageNumber));
        }

        if (pageSize !== undefined) {
            queryParameters.set('pageSize', String(pageSize));
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
     * 根据车牌号返回用户信息
     * 如果有多辆车，返回当前车辆的信息，如果没有匹配车辆，则data是null
     * @param vehicleLicence 车牌号
     */
    public customerVehicleVehicleLicenceGet (vehicleLicence: string, extraHttpRequestParams?: any ) : Observable<models.CustomerResponse> {
        const path = this.basePath + '/customer/vehicle/{vehicleLicence}'
            .replace('{' + 'vehicleLicence' + '}', String(vehicleLicence));

        let queryParameters = new URLSearchParams();
        let headerParams = this.defaultHeaders;

        headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
        headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 headerheaderParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


        // verify required parameter 'vehicleLicence' is not null or undefined
        if (vehicleLicence === null || vehicleLicence === undefined) {
            throw new Error('Required parameter vehicleLicence was null or undefined when calling customerVehicleVehicleLicenceGet.');
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

}
