"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const school_model_1 = require("../models/school.model");
// Find a school by name and explicitly include the password field
const getSchoolByNameWithPassword = (schoolName) => __awaiter(void 0, void 0, void 0, function* () {
    return yield school_model_1.School.findOne({ schoolName }).select('+password');
});
// Find a school by its ID
const getSchoolById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield school_model_1.School.findById(id);
});
// Update the school's password and set isFirstLogin to false
const updatePassword = (id, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield school_model_1.School.findByIdAndUpdate(id, {
        password: hashedPassword,
        isFirstLogin: false,
    }, { new: true, runValidators: true });
});
exports.default = {
    getSchoolByNameWithPassword,
    getSchoolById,
    updatePassword,
};
