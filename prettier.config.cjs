/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  bracketSpacing: true,
  semi: true,
  tabWidth: 2,
  jsxSingleQuote: false,
  overrides: [
    {
      files: '.prettierrc',
      options: { parser: 'json' },
    },
  ],
  plugins: ['prettier-plugin-tailwindcss'],
}
