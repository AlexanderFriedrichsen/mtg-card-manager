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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const auth_1 = require("./middleware/auth");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Simple health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Test database connection
app.get('/db-test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Just count the cards to test DB connection
        const count = yield prisma.card.count();
        res.json({ status: 'ok', message: 'Database connection successful', cardCount: count });
    }
    catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
}));
// Protected route example
app.get('/protected', auth_1.authMiddleware, (req, res) => {
    res.json({ status: 'ok', message: 'You accessed a protected route' });
});
exports.default = app;
