import {AxiosError, AxiosResponse} from 'axios';
import {DirectiveOptions} from 'vue';
import {RawLocation} from 'vue-router';
import methods from '../src/library/bean/method';

export interface MenuItemBean {
  children?: MenuItemBean[];
  icon: string;
  index: string;
  label: string;
  route?: RawLocation | string;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export interface ApiObject {
  defaultErrorHandler?: (data: ApiResponse<any>) => boolean;
  requestErrorHandler?: (err: AxiosError) => boolean;
}

export interface API {
  isFormData?: boolean;
  method: methods;
  req?: <T> (params?: any, params2?: any) => Promise<ApiResponse<T>>;
  request?: <T> (params?: any, params2?: any) => Promise<AxiosResponse<ApiResponse<T>>>;
  r?: <T> (params?: any, params2?: any) => Promise<T>;
  url: string;
}

export interface AppConfig {
  /**
   * 接口请求的基本路径
   */
  basePath: string;
  /**
   * 对接口请求错误进行全局处理（http响应正常(http的status为2xx)，返回的数据code非0）
   * @param data 接口响应数据
   * @return 已处理返回true，否则返回false，返回false会进入具体的业务错误处理
   */
  defaultErrorHandler: (data: ApiResponse<any>) => boolean;
  /**
   * 请求路径后缀（使用yapi mock时会用到，需要设置为/, 正常请求设置为空字符串）
   */
  pathSuffix: string;
  /**
   * http请求错误（响应状态非2xx, 3xx的）全局处理
   * @param err
   * @return 已处理返回true，否则返回false，返回false会进入具体的业务错误处理
   */
  requestErrorHandler: (err: AxiosError) => boolean;
}

interface TimeDirective extends DirectiveOptions {
}

interface CodeMirrorDirective extends DirectiveOptions {
}

export const time: TimeDirective;
export const codemirror: CodeMirrorDirective;


export declare function defineApi(apiObj: ApiObject, config: AppConfig, commonSettings: any): ApiObject;

export {methods as HttpMethods};

