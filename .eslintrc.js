module.exports = {
  extends: ["plugin:vue/vue3-essential", "airbnb-base"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    // 自己配置的规则
    indent: [2, 2],
    "quotes": 0,
    "no-unused-vars": [
      2,
      {
        vars: "all", // "local",允许声明未使用变量
        args: "all", // 检查所有参数
      },
    ],
    "no-param-reassign": 0,
    "import/no-extraneous-dependencies": 0,
    "camelcase": 0,
    "import/prefer-default-export": 0,
    "object-curly-newline": 0
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        // 这里写覆盖vue文件的规则
        "no-unused-vars": [0],
      },
    },
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src/'],
          ['page', './src/page/'],
          ['comps', './src/components/'],
          ['utils', './src/utils/'],
          ['api', './src/api/']
        ],
      }
    }
  }
};
