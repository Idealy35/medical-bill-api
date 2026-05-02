module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true   // 🔥 IMPORTANT
    },
    extends: "eslint:recommended",
    rules: {
        complexity: ["error", 5],
        "max-depth": ["error", 3]
    }
};