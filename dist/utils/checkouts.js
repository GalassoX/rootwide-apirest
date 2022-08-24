"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterNameValid = exports.usernameValid = exports.emailValid = void 0;
const emailValid = (email) => {
    if (!email)
        return false;
    return email.toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};
exports.emailValid = emailValid;
const usernameValid = (username) => {
    if (!username)
        return false;
    return !username.includes(' ') && username.length > 3 && !username.includes('#') && !username.includes('%');
};
exports.usernameValid = usernameValid;
const characterNameValid = (name) => {
    var _a;
    const match = name.match(/[A-Z]+?[a-z]{1,}/g);
    return ((_a = match === null || match === void 0 ? void 0 : match.at(0)) === null || _a === void 0 ? void 0 : _a.length) == name.length;
};
exports.characterNameValid = characterNameValid;
