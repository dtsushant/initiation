"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldType = void 0;
var FieldType;
(function (FieldType) {
    FieldType["String"] = "string";
    FieldType["Number"] = "number";
    FieldType["Bool"] = "boolean";
    FieldType["Enum"] = "enum";
    FieldType["Object"] = "object";
    FieldType["ListOfString"] = "string[]";
    FieldType["ListOfNumber"] = "number[]";
    FieldType["ListOfObject"] = "object[]";
    FieldType["Date"] = "date";
    FieldType["List"] = "array";
})(FieldType || (exports.FieldType = FieldType = {}));
