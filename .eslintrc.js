module.exports = {
    env: {
        node: true,     // ✔ require, module OK
        jest: true,     // ✔ test, expect, describe OK
        es2021: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: "latest"
    },
    rules: {
        complexity: ["error", 5],
        "no-unused-vars": "warn"
    }
};