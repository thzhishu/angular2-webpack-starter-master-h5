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
export class HApi {
  protected basePath = '/api/v1';
  public defaultHeaders: Headers = new Headers();

  constructor(protected http: Http, @Optional() basePath: string) {
    if (basePath) {
      this.basePath = basePath;
    }
  }

  /**
   * H5修改， 返回员工信息以及员工关联的门店ids
   *
   * @param token 凭证
   * @param employeeId 员工id
   */
  public employeeEmployeeIdGet(token: string, employeeId: string, extraHttpRequestParams?: any): Observable<models.EmployeeResponse> {
    const path = this.basePath + '/employee/{employeeId}'
      .replace('{' + 'employeeId' + '}', String(employeeId));

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    // verify required parameter 'token' is not null or undefined
    if (token === null || token === undefined) {
      throw new Error('Required parameter token was null or undefined when calling employeeEmployeeIdGet.');
    }
    // verify required parameter 'employeeId' is not null or undefined
    if (employeeId === null || employeeId === undefined) {
      throw new Error('Required parameter employeeId was null or undefined when calling employeeEmployeeIdGet.');
    }
    headerParams.set('token', token);

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
   * 新建员工
   *
   * @param name 姓名
   * @param code 技师编号
   * @param mobile 手机号
   * @param shopIds H5新加关联门店id，多个逗号分隔，服务端需要兼容pc和h5
   * @param codes H5新加技师编号，多个逗号分隔，服务端需要兼容pc和h5
   * @param type 1正式，2临时工
   */
  public employeeSavePost(name?: string, code?: string, mobile?: string, shopIds?: string, codes?: string, type?: string, extraHttpRequestParams?: any): Observable<models.EmployeeResponse> {
    const path = this.basePath + '/employee/save';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    let formParams = new URLSearchParams();

    headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

    formParams.append('name', name);
    formParams.append('code', code);
    formParams.append('mobile', mobile);
    formParams.append('shopIds', shopIds);
    formParams.append('codes', codes);
    formParams.append('type', type);
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
   * 新建员工
   *
   * @param id 员工id
   * @param name 姓名
   * @param shopIds H5新加关联门店id，多个逗号分隔，服务端需要兼容pc和h5
   * @param codes H5新加技师编号，多个逗号分隔，服务端需要兼容pc和h5
   * @param code 技师编号
   * @param mobile 手机号
   */
  public employeeUpdatePost(id?: string, name?: string, shopIds?: string, codes?: string, code?: string, mobile?: string, extraHttpRequestParams?: any): Observable<models.EmployeeResponse> {
    const path = this.basePath + '/employee/update';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    let formParams = new URLSearchParams();

    headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

    formParams.append('id', id);
    formParams.append('name', name);
    formParams.append('shopIds', shopIds);
    formParams.append('codes', codes);
    formParams.append('code', code);
    formParams.append('mobile', mobile);
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
   * 角色列表, H5新增， 后端做cache
   *
   * @param pageNumber 当前页
   * @param pageSize 分页大小
   */
  public roleListGet(pageNumber?: number, pageSize?: number, extraHttpRequestParams?: any): Observable<models.RoleListResponse> {
    const path = this.basePath + '/role/list';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


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
   * 创建子账号, H5新增
   *
   * @param mobile 手机号
   * @param password 密码
   * @param name 员工姓名，后端注意变更之后的同步
   * @param employeeId 员工id
   * @param roleIds 角色id，多角色用逗号分隔
   * @param shopIds 关联门店id, 用逗号分隔
   */
  public userAccountCreatePost(mobile: string, password: string, name?: string, employeeId?: number, roleIds?: string, shopIds?: string, extraHttpRequestParams?: any): Observable<models.CommonResponse> {
    const path = this.basePath + '/user/account/create';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    let formParams = new URLSearchParams();

    // verify required parameter 'mobile' is not null or undefined
    if (mobile === null || mobile === undefined) {
      throw new Error('Required parameter mobile was null or undefined when calling userAccountCreatePost.');
    }
    // verify required parameter 'password' is not null or undefined
    if (password === null || password === undefined) {
      throw new Error('Required parameter password was null or undefined when calling userAccountCreatePost.');
    }
    headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

    formParams.append('name', name);
    formParams.append('employeeId', String(employeeId));
    formParams.append('mobile', mobile);
    formParams.append('password', password);
    formParams.append('roleIds', roleIds);
    formParams.append('shopIds', shopIds);
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
   * 删除子账号, H5新增， 后端控制只有父账号能操作
   *
   * @param id 账号id
   */
  public userAccountIdDeleteDelete(id: number, extraHttpRequestParams?: any): Observable<models.CommonResponse> {
    const path = this.basePath + '/user/account/{id}/delete'
      .replace('{' + 'id' + '}', String(id));

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    // verify required parameter 'id' is not null or undefined
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling userAccountIdDeleteDelete.');
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
   * 获取子账号信息, H5新增， 后端控制只有父账号能操作
   *
   * @param id 账号id
   */
  public userAccountIdGet(id: number, extraHttpRequestParams?: any): Observable<models.UserAccountResponse> {
    const path = this.basePath + '/user/account/{id}'
      .replace('{' + 'id' + '}', String(id));

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    // verify required parameter 'id' is not null or undefined
    if (id === null || id === undefined) {
      throw new Error('Required parameter id was null or undefined when calling userAccountIdGet.');
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
   * 修改子账号, H5新增
   *
   * @param mobile 手机号
   * @param password 密码
   * @param id 子账号id
   * @param name 员工姓名，后端注意变更之后的同步, 后端控制只有父账号能操作
   * @param employeeId 员工id
   * @param roleIds 角色id，多角色用逗号分隔
   * @param shopIds 关联门店id, 用逗号分隔
   */
  public userAccountUpdatePost(mobile: string, password: string, id?: number, name?: string, employeeId?: number, roleIds?: string, shopIds?: string, extraHttpRequestParams?: any): Observable<models.CommonResponse> {
    const path = this.basePath + '/user/account/update';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    let formParams = new URLSearchParams();

    // verify required parameter 'mobile' is not null or undefined
    if (mobile === null || mobile === undefined) {
      throw new Error('Required parameter mobile was null or undefined when calling userAccountUpdatePost.');
    }
    // verify required parameter 'password' is not null or undefined
    if (password === null || password === undefined) {
      throw new Error('Required parameter password was null or undefined when calling userAccountUpdatePost.');
    }
    headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

    formParams.append('id', String(id));
    formParams.append('name', name);
    formParams.append('employeeId', String(employeeId));
    formParams.append('mobile', mobile);
    formParams.append('password', password);
    formParams.append('roleIds', roleIds);
    formParams.append('shopIds', shopIds);
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
   * 用户子账号列表, H5新增
   *
   * @param pageNumber 当前页
   * @param pageSize 分页大小
   */
  public userAccountsGet(pageNumber?: number, pageSize?: number, extraHttpRequestParams?: any): Observable<models.UserAccountListResponse> {
    const path = this.basePath + '/user/accounts';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


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
   * 用户登录
   * 用户通过手机号，密码，验证码登录车门店系统。返回结构的lastShopId是最近选中门店id,  登录之后要选中该门店, 2016-08 H5修改，添加返回角色和权限信息
   * @param mobile 登录手机号
   * @param password 登录密码
   * @param code 验证码
   */
  public userLoginPost(mobile: string, password: string, code: string, extraHttpRequestParams?: any): Observable<models.UserLoginResponse> {
    const path = this.basePath + '/user/login';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    let formParams = new URLSearchParams();

    // verify required parameter 'mobile' is not null or undefined
    if (mobile === null || mobile === undefined) {
      throw new Error('Required parameter mobile was null or undefined when calling userLoginPost.');
    }
    // verify required parameter 'password' is not null or undefined
    if (password === null || password === undefined) {
      throw new Error('Required parameter password was null or undefined when calling userLoginPost.');
    }
    // verify required parameter 'code' is not null or undefined
    if (code === null || code === undefined) {
      throw new Error('Required parameter code was null or undefined when calling userLoginPost.');
    }
    headerParams.set('Content-Type', 'application/x-www-form-urlencoded');

    formParams.append('mobile', mobile);
    formParams.append('password', password);
    formParams.append('code', code);
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
   * 我的账户, H5修改，添加权限之后， 额外返回角色列表
   *
   * @param token 用户的登录凭证
   */
  public userMeGet(token: string, extraHttpRequestParams?: any): Observable<models.MyAcountResponse> {
    const path = this.basePath + '/user/me';

    let queryParameters = new URLSearchParams();
    let headerParams = this.defaultHeaders;

    headerParams.set('token', Cookie.load('token')); //tobeplus 缓存注入 header
    headerParams.set('shopId', Cookie.load('shopId')); //tobeplus 缓存注入 header
    headerParams.set('clientType', Cookie.load('clientType')); //tobeplus 缓存注入 header


    // verify required parameter 'token' is not null or undefined
    if (token === null || token === undefined) {
      throw new Error('Required parameter token was null or undefined when calling userMeGet.');
    }
    headerParams.set('token', token);

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
