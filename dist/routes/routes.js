"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../utils/validation");
const router = express_1.default.Router();
//Auth Routes
router.post("/auth/create-account", validation_1.validateEmail, validation_1.validatePassword, userController_1.createUser);
exports.default = router;
