"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const plugin_1 = require("./plugin");
const recommended_1 = __importDefault(require("./configs/recommended"));
const typescript_1 = __importDefault(require("./configs/typescript"));
const pluginLegacy = {
    rules: plugin_1.plugin.rules,
    configs: {
        recommended: {
            plugins: ["solid"],
            env: {
                browser: true,
                es6: true,
            },
            parserOptions: recommended_1.default.languageOptions.parserOptions,
            rules: recommended_1.default.rules,
        },
        typescript: {
            plugins: ["solid"],
            env: {
                browser: true,
                es6: true,
            },
            parserOptions: {
                sourceType: "module",
            },
            rules: typescript_1.default.rules,
        },
        "flat/recommended": recommended_1.default,
        "flat/typescript": typescript_1.default,
    },
};
module.exports = pluginLegacy;
