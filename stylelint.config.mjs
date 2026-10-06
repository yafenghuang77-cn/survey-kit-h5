/** @type {import('stylelint').Config} */
export default {
  extends: "stylelint-config-standard",
  ignoreFiles: ["dist/**", "node_modules/**"],
  rules: {
    "no-empty-source": null,
    // 共享样式必须能通过微信 WXSS 编译。
    "selector-max-universal": 0,
    "media-feature-range-notation": "prefix",
  },
  overrides: [
    {
      files: ["**/*.less"],
      customSyntax: "postcss-less",
      rules: {
        "at-rule-no-unknown": [true, { ignoreAtRules: ["plugin"] }],
        // CSS value validation does not understand Less functions and expressions.
        "function-no-unknown": null,
        "declaration-property-value-no-unknown": null,
      },
    },
  ],
};
