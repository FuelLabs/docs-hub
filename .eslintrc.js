const config = require("@fuels/eslint-config")
const nextConfig = require("eslint-config-next")

module.exports = {
  ...config,
  extends: [...config.extends, "plugin:@next/next/recommended"],
  plugins: [
    ...config.plugins,
    ...nextConfig.plugins.filter((f) => f !== "import"),
  ],
  rules: {
    ...config.rules,
    ...Object.fromEntries(
      Object.entries(nextConfig.rules).filter(([key]) => key !== "import/order")
    ),
  },
  overrides: [
    {
      files: ["src/imports.ts", "src/lib/api.ts"],
      rules: {
        "import/no-unresolved": "off",
      },
    },
  ],
}
