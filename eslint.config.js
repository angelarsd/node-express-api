module.exports = [
  {
    files: ['*.js'],
    rules: {
      semi: ['error', 'always'], 
      // Exigir punto y coma al final de las declaraciones
      quotes: ['error', 'single'], // Usar comillas simples en lugar de dobles
      indent: ['error', 2], // Usar 2 espacios para la indentación
      'linebreak-style': ['error', 'unix'], 
      // Establecer salto de línea en estilo Unix (\n)
      'max-len': ['error', {code: 80, ignoreUrls: true, ignoreComments: false}],
      // Limitar la longitud de línea a 80 caracteres
      'prefer-const': 'error', // Usar `const` siempre que sea posible
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }], 
      // Evitar variables no usadas, excepto las que empiezan con _
      'no-console': 'warn', // Advertir sobre el uso de `console.log`
      'eqeqeq': ['error', 'always'], 
      // Requerir el uso de `===` en lugar de `==`
      'curly': ['error', 'all'], 
      // Requerir llaves en las estructuras de control
      'brace-style': ['error', '1tbs'], 
      // Estilo de llaves: 1 true brace style (estilo de una sola línea)
      'no-magic-numbers': 'off', 
      // Desactivar la regla sobre números mágicos (opcional, si no se desea)
      'space-infix-ops': 'error', 
      // Exigir un espacio alrededor de los operadores
      'template-curly-spacing': ['error', 'never'], 
      // Exigir un espacio dentro de las llaves de las plantillas literales
      'object-curly-newline': ['error', {
        'ObjectExpression': { 'multiline': true },
        'ObjectPattern': { 'multiline': true },
        'ImportDeclaration': { 'multiline': true },
        'ExportDeclaration': { 'multiline': true }
      }],
      'no-console': 'off', // Deshabilita la regla no-console
    }
  },
];