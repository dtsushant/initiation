import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    tailwindcss(), 
    autoprefixer(),
  ],
}
