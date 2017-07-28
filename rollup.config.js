import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

import pkg from './package.json';
import summary from './summary';

export default {
  moduleName: pkg.title.replace(/\s/, ''),
  entry: "index.js",
  format: "umd",
  plugins: [
    babel({
      exclude: "node_modules/**" // only transpile our source code
    }),
    json()
  ],
  dest: "dist/bundle.js",
  sourceMap: true,
  banner: summary
};
