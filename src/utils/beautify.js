'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cssbeautify_1 = tslib_1.__importDefault(require("cssbeautify"));
const html_1 = require("html");
const js_beautify_1 = require("js-beautify");
const clean = (data) => {
    if (~['"', '\''].indexOf(data[0]) &&
        ~['"', '\''].indexOf(data[data.length - 1]) &&
        data[0] === data[data.length - 1]) {
        return data.substring(1, data.length - 1);
    }
    return data;
};
const beautify = (data, o) => {
    if (!data || !data.length) {
        return '';
    }
    data = clean(data.trim());
    switch (o.format) {
        case 'css':
            return cssbeautify_1.default(data, {
                autosemicolon: true,
                indent: '    '
            });
        case 'json':
            return js_beautify_1.js_beautify(data, {
                indent_size: 2
            });
        case 'js':
            return js_beautify_1.js_beautify(data, {
                indent_size: 4
            });
        case 'html':
        case 'xml':
            return html_1.prettyPrint(data);
    }
};
exports.default = beautify;
//# sourceMappingURL=beautify.js.map