module.exports = {
  root: true,

  env: {
    node: true,     // 🔥 Indique qu'on est dans Node.js (autorise require, module.exports)
    es2022: true,
  },

  parserOptions: {
    ecmaVersion: 2022,  // 🔥 Support moderne compatible Node 20
  },

  extends: [
    "eslint:recommended",
    "google",
  ],

  rules: {
    // ✅ On assouplit certaines règles Google trop strictes pour Firebase
    "no-restricted-globals": "off",
    "prefer-arrow-callback": "off",
    "quotes": "off",
    "indent": "off",
    "max-len": "off",
    "object-curly-spacing": "off",
    "comma-dangle": "off",
  },

  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
};
