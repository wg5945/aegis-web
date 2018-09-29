"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const querystring_1 = tslib_1.__importDefault(require("querystring"));
const method_1 = tslib_1.__importDefault(require("../bean/method"));
exports.default = (apiObj, config, commonSettings) => {
    axios_1.default.defaults.baseURL = config.basePath;
    const newObj = Object.assign({}, apiObj);
    const defineReq = (obj, options) => {
        if (obj.url) {
            obj = Object.assign({}, obj, options);
            obj.request = (params, otherParams, settings) => request(Object.assign({}, settings, obj), params, otherParams);
            obj.req = (params, otherParams, settings) => requestData(Object.assign({}, settings, obj), params, otherParams, false);
            obj.r = (params, otherParams, settings) => requestData(Object.assign({}, settings, obj), params, otherParams, true);
        }
        for (const property in obj) {
            if (obj.hasOwnProperty(property) && typeof obj[property] === 'object') {
                obj[property] = defineReq(obj[property], options);
            }
        }
        return obj;
    };
    const api = defineReq(newObj, commonSettings);
    const rest = (url, restParams) => {
        restParams.forEach((v) => {
            if (Array.isArray(v)) {
                url += '/' + v.join('/');
            }
            else {
                url += `/${v}`;
            }
        });
        return url;
    };
    const assignParams = (obj, params, otherParams = {}) => {
        if (obj.isFormData && [method_1.default.POST, method_1.default.PUT].indexOf(obj.method) >= 0) {
            obj.data = querystring_1.default.stringify(params);
            if (Object.keys(otherParams).length > 0) {
                obj.url = `${obj.url}?${querystring_1.default.stringify(otherParams)}`;
            }
        }
        else if ([method_1.default.GET, method_1.default.DELETE].indexOf(obj.method) >= 0) {
            if (Object.keys(otherParams).length > 0) {
                obj.url = `${obj.url}?${querystring_1.default.stringify(Object.assign({}, params, otherParams))}`;
            }
            else {
                obj.url = `${obj.url}?${querystring_1.default.stringify(params)}`;
            }
        }
        else {
            obj.data = params;
            if (Object.keys(otherParams).length > 0) {
                obj.url = `${obj.url}?${querystring_1.default.stringify(otherParams)}`;
            }
        }
        return obj;
    };
    const requestData = (obj, params, otherParams, pure) => {
        const p = request(obj, params, otherParams);
        return Promise.resolve(p).then((v) => {
            return new Promise((resolve, reject) => {
                if (v.data.code === 0) {
                    if (pure) {
                        resolve(v.data.data);
                    }
                    else {
                        resolve(v.data);
                    }
                }
                else {
                    if (config.defaultErrorHandler) {
                        const handleResult = config.defaultErrorHandler(v.data);
                        if (handleResult) {
                            return;
                        }
                    }
                    reject(v.data);
                }
            });
        }).catch((err) => new Promise((resolve, reject) => {
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
    const request = (obj, params, otherParams) => {
        obj.url = obj.url + config.pathSuffix;
        if (obj.method === null || obj.method === undefined) {
            obj.method = method_1.default.GET;
        }
        if (params) {
            if (Array.isArray(params)) {
                obj.url = rest(obj.url, params);
                if (otherParams) {
                    obj = assignParams(obj, otherParams);
                }
            }
            else {
                obj = assignParams(obj, params, otherParams);
            }
        }
        const p = axios_1.default.request(obj);
        return Promise.resolve(p).then((v) => new Promise((resolve) => {
            if (config.defaultErrorHandler) {
                if (v.data.code !== 0) {
                    const handleResult = config.defaultErrorHandler(v.data);
                    if (handleResult) {
                        return;
                    }
                }
            }
            resolve(v);
        })).catch((err) => new Promise((resolve, reject) => {
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
//# sourceMappingURL=api_helper.js.map