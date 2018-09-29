'use strict';

import cssbeautify from 'cssbeautify';
// @ts-ignore
import {prettyPrint as html} from 'html';
import {js_beautify as jsBeautify} from 'js-beautify';

const clean = (data: any) => {
  if (~['"', '\''].indexOf(data[0]) &&
      ~['"', '\''].indexOf(data[data.length - 1]) &&
      data[0] === data[data.length - 1]
  ) {
    return data.substring(1, data.length - 1);
  }

  return data;
};

const beautify = (data: string, o: any) => {
  if (!data || !data.length) {
    return '';
  }

  data = clean(data.trim());

  switch (o.format) {
    case 'css':
      return cssbeautify(data, {
        autosemicolon: true,
        indent: '    '
      });
    case 'json':
      return jsBeautify(data, {
        indent_size: 2
      });
    case 'js':
      return jsBeautify(data, {
        indent_size: 4
      });
    case 'html':
    case 'xml':
      return html(data);
  }
};
export default beautify;

