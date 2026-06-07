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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const school_model_1 = require("../models/school.model");
const jobTitle_model_1 = require("../models/jobTitle.model");
const sport_model_1 = require("../models/sport.model");
dotenv_1.default.config();
// Mock Data
const mockSchools = [
    { schoolName: 'Banqiao Senior High School' },
    { schoolName: 'Sanchong Senior High School' },
    { schoolName: 'Zhonghe Senior High School' },
    { schoolName: 'Xinzhuang Senior High School' },
    { schoolName: 'Tamsui Senior High School' },
    { schoolName: 'Xindian Senior High School' },
    { schoolName: 'Shulin Senior High School' },
    { schoolName: 'Yingge Vocational High School' },
    { schoolName: 'Ruifang Industrial High School' },
    { schoolName: 'Jinshan High School' },
];
const mockJobTitles = [
    { titleName: 'Athlete' },
    { titleName: 'Head Coach' },
    { titleName: 'Assistant Coach' },
    { titleName: 'Team Manager' },
    { titleName: 'Medical Staff' },
];
const mockSports = [
    { sportName: '100m Sprint' },
    { sportName: '200m Sprint' },
    { sportName: '400m Sprint' },
    { sportName: '800m Run' },
    { sportName: '1500m Run' },
    { sportName: '5000m Run' },
    { sportName: '110m Hurdles' },
    { sportName: '4x100m Relay' },
    { sportName: '4x400m Relay' },
    { sportName: 'High Jump' },
    { sportName: 'Long Jump' },
    { sportName: 'Triple Jump' },
    { sportName: 'Pole Vault' },
    { sportName: 'Shot Put' },
    { sportName: 'Discus Throw' },
    { sportName: 'Javelin Throw' },
    { sportName: 'Swimming - 50m Freestyle' },
    { sportName: 'Swimming - 100m Freestyle' },
    { sportName: 'Table Tennis - Singles' },
    { sportName: 'Badminton - Singles' },
];
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;
        if (!MONGO_URI || !DEFAULT_PASSWORD) {
            throw new Error('Missing MONGO_URI or DEFAULT_PASSWORD');
        }
        yield mongoose_1.default.connect(MONGO_URI, { dbName: 'team_registration' });
        console.log('Connected to Database for seeding...');
        // Clear existing collections to start fresh
        yield school_model_1.School.deleteMany({});
        yield jobTitle_model_1.JobTitle.deleteMany({});
        yield sport_model_1.Sport.deleteMany({});
        console.log('Cleared existing schools, job titles, and sports.');
        // Hash password for schools
        const hashedPassword = yield bcrypt_1.default.hash(DEFAULT_PASSWORD, 12);
        // Map over the mock data and inject the required fields
        const schoolsToInsert = mockSchools.map((school) => (Object.assign(Object.assign({}, school), { password: hashedPassword, isFirstLogin: true })));
        // Insert into the database
        yield school_model_1.School.insertMany(schoolsToInsert);
        yield jobTitle_model_1.JobTitle.insertMany(mockJobTitles);
        yield sport_model_1.Sport.insertMany(mockSports);
        console.log(`Successfully seeded:`);
        console.log(`- ${schoolsToInsert.length} Schools`);
        console.log(`- ${mockJobTitles.length} Job Titles`);
        console.log(`- ${mockSports.length} Sports`);
        process.exit();
    }
    catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
});
seedDatabase();
