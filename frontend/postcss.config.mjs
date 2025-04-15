import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import nesting from 'postcss-nesting';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    nesting,        // must be first
    tailwindcss,
    autoprefixer,
  ],
};