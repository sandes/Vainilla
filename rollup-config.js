//import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: "src/precodigo.js",
    output: {
      banner: "/*Precodigo lang js*/",
      format: "umd",
      file: "lib/precodigo.js",
      name: "precodigo"
    },
    //plugins: [ buble({namedFunctionExpressions: false}) ]
    plugins: [commonjs()]
  },

];
