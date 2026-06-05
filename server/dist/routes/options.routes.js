"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const options_controller_1 = __importDefault(require("../controllers/options.controller"));
const optionsRouter = (0, express_1.Router)();
optionsRouter.use(auth_middleware_1.protect);
optionsRouter.get('/job-titles', options_controller_1.default.getJobTitles);
optionsRouter.get('/sports', options_controller_1.default.getSports);
exports.default = optionsRouter;
