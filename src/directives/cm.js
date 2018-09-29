"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const codemirror_1 = tslib_1.__importDefault(require("codemirror"));
require("codemirror/addon/edit/closetag");
require("codemirror/addon/fold/brace-fold");
require("codemirror/addon/fold/foldcode");
require("codemirror/addon/fold/foldgutter");
require("codemirror/addon/fold/foldgutter.css");
require("codemirror/addon/fold/markdown-fold");
require("codemirror/addon/hint/javascript-hint");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/show-hint.css");
require("codemirror/addon/hint/sql-hint");
require("codemirror/lib/codemirror.css");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/nginx/nginx");
require("codemirror/mode/ruby/ruby");
require("codemirror/mode/sql/sql");
require("codemirror/mode/yaml/yaml");
require("codemirror/theme/3024-day.css");
require("codemirror/theme/blackboard.css");
require("../style/idea-theme.less");
const beautify_1 = tslib_1.__importDefault(require("../utils/beautify"));
const EDITOR_MAP = {};
exports.default = {
    bind(el, binding, vnode) {
        let config = {
            size: ['auto', 'auto']
        };
        if (vnode.data.attrs && vnode.data.attrs.config) {
            config = vnode.data.attrs.config;
        }
        let value = binding.value || '';
        if (vnode.data.attrs && vnode.data.attrs.hasOwnProperty('beautify')) {
            value = beautify_1.default(value, { format: 'json' });
        }
        const mode = vnode.data.attrs ? (vnode.data.attrs.mode || 'application/ld+json') : 'application/ld+json';
        const defaultConfig = {
            autoCloseTags: true,
            autoMatchParens: true,
            column: 2000,
            extraKeys: { F3: 'autocomplete' },
            foldGutter: true,
            gutters: ['codeMirror-linenumbers', 'codeMirror-foldgutter'],
            lineNumbers: true,
            lineWrapping: false,
            mode: { name: mode, globalVars: true },
            readOnly: true,
            scanUp: true,
            tabSize: 2,
            theme: 'idea',
            value
        };
        const viewer = codemirror_1.default(el, Object.assign(defaultConfig, config));
        if (config.size) {
            viewer.setSize(config.size[0], config.size[1]);
        }
        if (vnode.data.attrs && vnode.data.attrs.change) {
            viewer.on('change', () => {
                const content = viewer.getValue();
                vnode.data.attrs.change(content);
            });
        }
        const editorId = vnode.data.attrs['editor-id'];
        setEditor(editorId, viewer);
    },
    inserted(el, binding, vnode) {
        const editorId = vnode.data.attrs['editor-id'];
        getEditor(editorId).refresh();
    },
    update(el, binding, vnode) {
        const editorId = vnode.data.attrs['editor-id'];
        const editor = getEditor(editorId);
        let value = binding.value;
        if (vnode.data.attrs.hasOwnProperty('beautify')) {
            value = beautify_1.default(value, { format: 'json' });
        }
        editor.setValue(value);
        editor.refresh();
    }
};
function getEditor(id) {
    return EDITOR_MAP[id];
}
function setEditor(editorId, viewer) {
    EDITOR_MAP[editorId] = viewer;
}
//# sourceMappingURL=cm.js.map