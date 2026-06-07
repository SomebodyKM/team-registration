"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const school_controller_1 = __importDefault(require("../controllers/school.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const schoolRouter = (0, express_1.Router)();
schoolRouter.post('/login', school_controller_1.default.loginSchool);
schoolRouter.post('/setup-password', auth_middleware_1.protect, school_controller_1.default.setupNewPassword);
exports.default = schoolRouter;
