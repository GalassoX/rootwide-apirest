"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumeric = void 0;
const isNumeric = (number) => {
    return !isNaN(parseInt(number));
};
exports.isNumeric = isNumeric;
