"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server code
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const participant_routes_1 = __importDefault(require("./routes/participant.routes"));
const school_route_1 = __importDefault(require("./routes/school.route"));
const options_routes_1 = __importDefault(require("./routes/options.routes"));
dotenv_1.default.config();
// Create server
const app = (0, express_1.default)();
// Trust proxy
app.set('trust proxy', 1);
// Define allowed origins for React/Vite frontend
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
].filter((origin) => !!origin);
// Middleware
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/auth', school_route_1.default);
app.use('/participants', participant_routes_1.default);
app.use('/options', options_routes_1.default);
app.get('/', (req, res) => {
    res.status(200).send('Server is running!');
});
// Connnect MongoDB and start server
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}
mongoose_1.default
    .connect(MONGO_URI, { dbName: 'team_registration' })
    .then(() => {
    console.log('Connected to MongoDB database');
    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
