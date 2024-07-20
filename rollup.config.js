import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'build/bundle.js'
  },
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write('build/bundle.css');
      }
    }),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production
    }),
    !production && serve(),
    !production && livereload('build'),
    production && terser()
  ],
  watch: {
    clearScreen: false
  }
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;
        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  };
}
