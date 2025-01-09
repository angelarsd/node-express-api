import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node, // Usamos las variables globales de Node.js
    },
  },
  pluginJs.configs.recommended, // Usar las configuraciones recomendadas de ESLint
  {
    // Configuración específica para Prettier
    extends: ["plugin:prettier/recommended"], // Extiende la configuración recomendada de Prettier
    plugins: ["prettier"], // Activa el plugin de Prettier
    rules: {
      "prettier/prettier": "error", // Marca como error cualquier problema de formato
    },
  },
];
