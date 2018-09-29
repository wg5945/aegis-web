"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const createContent = (el, binding, vnode) => {
    const bindValue = binding.value;
    let text = '';
    const format = 'YYYY-MM-DD HH:mm:ss';
    let date;
    if (typeof bindValue === 'string') {
        const reg1 = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
        if (reg1.test(bindValue)) {
            date = moment_1.default(bindValue, 'YYYY-MM-DDTHH:mm:ss.sZ').toDate();
            date.setHours(date.getHours() + 8);
        }
        else {
            text = bindValue;
        }
    }
    else {
        const value = binding.value;
        date = new Date(value);
        if (!value) {
            text = '';
        }
        else {
            text = moment_1.default(value).format(format);
            if (vnode.data.attrs) {
                if (vnode.data.attrs.format) {
                    text = moment_1.default(value).format(vnode.data.attrs.format);
                }
            }
        }
    }
    if (vnode.data.attrs && (vnode.data.attrs['pretty-time'] === '' || vnode.data.attrs['pretty'] === '') && date) {
        const now = new Date();
        const nowTime = now.getTime();
        const difference = nowTime - date.getTime();
        if (difference > 0) {
            if (difference < 1000) {
                text = '刚刚';
            }
            else if (difference < 60 * 1000) {
                text = `${Math.floor(difference / 1000)}秒前`;
            }
            else if (difference < 60 * 1000 * 60) {
                text = `${Math.floor(difference / 1000 / 60)}分钟前`;
            }
            else if (now.getFullYear() === date.getFullYear()) {
                if (now.getMonth() === date.getMonth()
                    && now.getDay() === date.getDay()) {
                    text = moment_1.default(date).format('HH:mm:ss');
                }
                else {
                    text = moment_1.default(date).format('MM-DD HH:mm:ss');
                }
            }
        }
        else if (now.getFullYear() === date.getFullYear()) {
            if (now.getMonth() === date.getMonth()
                && now.getDay() === date.getDay()) {
                text = moment_1.default(date).format('HH:mm:ss');
            }
            else {
                text = moment_1.default(date).format('MM-DD HH:mm:ss');
            }
        }
    }
    el.innerHTML = text;
};
exports.default = {
    bind(el, binding, vnode) {
        createContent(el, binding, vnode);
    },
    update(el, binding, vnode) {
        createContent(el, binding, vnode);
    }
};
//# sourceMappingURL=time.js.map