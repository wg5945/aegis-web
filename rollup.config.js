import TypeScript from 'rollup-plugin-typescript3';
import VuePlugin from 'rollup-plugin-vue';
import less from 'rollup-plugin-less-loader';

export default {
  input: 'src/index.ts',
  output: {
    name: 'AegisWeb',
    file: 'dist/index.js',
    format: 'umd'
  },
  plugins: [
    TypeScript(),
    VuePlugin(),
    less()
  ]
};

