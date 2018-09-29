import Axios, {AxiosError, AxiosResponse} from 'axios';
import qs from 'querystring';
import {ApiObject, ApiResponse, AppConfig} from '../../../types';
import HttpMethod from '../bean/method';

/**
 * Created by wuhao on 2017/1/16.
 */
export default (apiObj: ApiObject, config: AppConfig, commonSettings: any) => {
  Axios.defaults.baseURL = config.basePath;
  const newObj = Object.assign({}, apiObj);
  const defineReq = (obj: any, options: any): ApiObject => {
    if (obj.url) {
      obj = Object.assign({}, obj, options);
      /**
       * 发送ajax请求
       * @param {object} settings
       * @param {object|array} params
       * @param {object} otherParams
       */
      obj.request = (params: object | [], otherParams: object | [], settings: any) =>
        request(Object.assign({}, settings, obj), params, otherParams);
      obj.req = (params: object | [],
                 otherParams: object | [], settings: any) => requestData(
        Object.assign({}, settings, obj), params, otherParams, false);
      obj.r = (params: object | [], otherParams: object | [], settings: any) => requestData(
        Object.assign({}, settings, obj), params, otherParams, true);
    }
    for (const property in obj) {
      if (obj.hasOwnProperty(property) && typeof obj[property] === 'object') {
        obj[property] = defineReq(obj[property], options);
      }
    }
    return obj;
  };
  const api = defineReq(newObj, commonSettings);
  const rest = (url: string, restParams: any[]) => {
    restParams.forEach((v) => {
      if (Array.isArray(v)) {
        url += '/' + v.join('/');
      } else {
        url += `/${v}`;
      }
    });
    return url;
  };

  /**
   * 设置请求参数
   * @param {object} obj
   * @param {object} params
   * @param {object} otherParams
   * @return {object} axios的ajax请求对象
   */
  const assignParams = (obj: any, params: object | [], otherParams: object | [] = {}) => {
    if (obj.isFormData && [HttpMethod.POST, HttpMethod.PUT].indexOf(obj.method) >= 0) {
      obj.data = qs.stringify(params);
      if (Object.keys(otherParams).length > 0) {
        obj.url = `${obj.url}?${qs.stringify(otherParams)}`;
      }
    } else if ([HttpMethod.GET, HttpMethod.DELETE].indexOf(obj.method) >= 0) {
      if (Object.keys(otherParams).length > 0) {
        obj.url = `${obj.url}?${qs.stringify(Object.assign({}, params, otherParams))}`;
      } else {
        obj.url = `${obj.url}?${qs.stringify(params)}`;
      }
    } else {
      obj.data = params;
      if (Object.keys(otherParams).length > 0) {
        obj.url = `${obj.url}?${qs.stringify(otherParams)}`;
      }
    }
    return obj;
  };

  const requestData = (obj: any, params: object | [], otherParams: object | [], pure: boolean) => {
    const p = request(obj, params, otherParams);
    // @ts-ignore
    return Promise.resolve(p).then((v: AxiosResponse<ApiResponse<any>>) => {
      return new Promise((resolve, reject) => {
        if (v.data.code === 0) {
          if (pure) {
            resolve(v.data.data);
          } else {
            resolve(v.data);
          }
        } else {
          if (config.defaultErrorHandler) {
            const handleResult = config.defaultErrorHandler(v.data);
            if (handleResult) {
              return;
            }
          }
          reject(v.data);
        }
      });
    }).catch((err: AxiosError) => new Promise((resolve, reject) => {
      if (config.requestErrorHandler) {
        const handleResult = config.requestErrorHandler(err);
        if (handleResult) {
          return;
        }
      }
      reject({
        code: err.response ? err.response.status : -1,
        msg: err.toString()
      });
    }));
  };

  const request = (obj: any, params: object | [], otherParams: object | []) => {
    obj.url = obj.url + config.pathSuffix;
    if (obj.method === null || obj.method === undefined) {
      obj.method = HttpMethod.GET;
    }
    if (params) {
      if (Array.isArray(params)) {
        obj.url = rest(obj.url, params);
        if (otherParams) {
          /**
           * ajax请求
           * @param {object} obj
           * @param {object|array} params
           * @param {object} otherParams
           */
          obj = assignParams(obj, otherParams);
        }
      } else {
        obj = assignParams(obj, params, otherParams);
      }
    }
    const p = Axios.request(obj);
    return Promise.resolve(p).then((v: AxiosResponse<ApiResponse<any>>) => new Promise((resolve) => {
      if (config.defaultErrorHandler) {
        if (v.data.code !== 0) {
          const handleResult = config.defaultErrorHandler(v.data);
          if (handleResult) {
            return;
          }
        }
      }
      resolve(v);
    })).catch((err: AxiosError) => new Promise((resolve, reject) => {
      if (config.requestErrorHandler) {
        const handleResult = config.requestErrorHandler(err);
        if (handleResult) {
          return;
        }
      }
      reject(err);
    }));
  };
  return api;
};

