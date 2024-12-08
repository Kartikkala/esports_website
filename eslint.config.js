export default [
  {
    files: ["**/*.js", "**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      import: require("eslint-plugin-import"),
    },
    rules: {
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "always", // Enforce .js extension for JavaScript files
          ts: "always", // Do not enforce .ts extension for TypeScript files
        },
      ],
    },
  },
];
