// eslint-disable-next-line no-undef
module.exports = {
	env: { es2021: true },
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		emitDecoratorMetadata: true
	},
	plugins: ['@typescript-eslint'],
	rules: {
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				tabWidth: 4,
				useTabs: true,
				semi: true,
				bracketSpacing: true,
				printWidth: 125,
				trailingComma: 'none',
				arrowParens: 'always',
				endOfLine: 'lf'
			}
		],
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				fixStyle: 'separate-type-imports'
			}
		],
		'@typescript-eslint/no-explicit-any': 'error',
		'@typescript-eslint/no-unused-vars': 'error',
		indent: 'off',
		'linebreak-style': ['error', 'unix'],
		semi: ['error', 'always'],
		'no-duplicate-imports': 'error'
	},
	ignorePatterns: ['dist']
};
