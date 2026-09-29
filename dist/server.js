"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
require("dotenv").config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use("/", auth_1.default);
mongoose_1.default.set("strictQuery", false);
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(port, () => console.log("Server Start", port));
})
    .catch(() => { });
