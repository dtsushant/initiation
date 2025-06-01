import baseConfig from "../eslint.config.js";

export default [
  ...baseConfig,
  {
    ignores: ["./public/sw.js"],
  },
];
