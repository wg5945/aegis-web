/**
 * Created by wuhao on 2016/11/23.
 */
import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/hint/javascript-hint';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/sql-hint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/nginx/nginx';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/sql/sql';
import 'codemirror/mode/yaml/yaml';
import 'codemirror/theme/3024-day.css';
import 'codemirror/theme/blackboard.css';
import {DirectiveOptions, VNode, VNodeDirective} from 'vue';
import '../style/idea-theme.less';
import beautify from '../utils/beautify';

const EDITOR_MAP: { [key: string]: CodeMirror.Editor } = {};
export default {
  bind(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    let config = {
      size: ['auto', 'auto']
    };
    if (vnode.data!.attrs && vnode.data!.attrs!.config) {
      config = vnode.data!.attrs!.config;
    }
    let value = binding.value || '';
    if (vnode.data!.attrs && vnode.data!.attrs!.hasOwnProperty('beautify')) {
      value = beautify(value, {format: 'json'});
    }
    const mode = vnode.data!.attrs ? (vnode.data!.attrs!.mode || 'application/ld+json') : 'application/ld+json';
    const defaultConfig = {
      autoCloseTags: true,
      autoMatchParens: true,
      column: 2000,
      extraKeys: {F3: 'autocomplete'},
      foldGutter: true,
      gutters: ['codeMirror-linenumbers', 'codeMirror-foldgutter'],
      lineNumbers: true,
      lineWrapping: false,
      mode: {name: mode, globalVars: true},
      readOnly: true,
      scanUp: true,
      tabSize: 2,
      theme: 'idea',
      value
    };
    const viewer = CodeMirror(el, Object.assign(defaultConfig, config));
    if (config.size) {
      viewer.setSize(config.size[0], config.size[1]);
    }
    if (vnode.data!.attrs && vnode.data!.attrs!.change) {
      viewer.on('change', () => {
        const content = viewer.getValue();
        vnode.data!.attrs!.change(content);
      });
    }
    const editorId = vnode.data!.attrs!['editor-id'];
    setEditor(editorId, viewer);
  },
  inserted(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    const editorId = vnode.data!.attrs!['editor-id'];
    getEditor(editorId).refresh();
  },
  update(el: HTMLElement, binding: VNodeDirective, vnode: VNode) {
    const editorId = vnode.data!.attrs!['editor-id'];
    const editor = getEditor(editorId);
    let value = binding.value;
    if (vnode.data!.attrs!.hasOwnProperty('beautify')) {
      value = beautify(value, {format: 'json'});
    }
    editor.setValue(value);
    editor.refresh();
  }
} as DirectiveOptions;

function getEditor(id: string): CodeMirror.Editor {
  return EDITOR_MAP[id];
}

function setEditor(editorId: string, viewer: CodeMirror.Editor) {
  EDITOR_MAP[editorId] = viewer;
}

