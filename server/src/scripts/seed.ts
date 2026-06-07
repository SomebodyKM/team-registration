import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { School } from '../models/school.model';
import { JobTitle } from '../models/jobTitle.model';
import { Sport } from '../models/sport.model';

dotenv.config();

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

const seedDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD;

    if (!MONGO_URI || !DEFAULT_PASSWORD) {
      throw new Error('Missing MONGO_URI or DEFAULT_PASSWORD');
    }
    await mongoose.connect(MONGO_URI, { dbName: 'team_registration' });
    console.log('Connected to Database for seeding...');

    // Clear existing collections to start fresh
    await School.deleteMany({});
    await JobTitle.deleteMany({});
    await Sport.deleteMany({});
    console.log('Cleared existing schools, job titles, and sports.');

    // Hash password for schools
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    // Map over the mock data and inject the required fields
    const schoolsToInsert = mockSchools.map((school) => ({
      ...school,
      password: hashedPassword,
      isFirstLogin: true,
    }));

    // Insert into the database
    await School.insertMany(schoolsToInsert);
    await JobTitle.insertMany(mockJobTitles);
    await Sport.insertMany(mockSports);

    console.log(`Successfully seeded:`);
    console.log(`- ${schoolsToInsert.length} Schools`);
    console.log(`- ${mockJobTitles.length} Job Titles`);
    console.log(`- ${mockSports.length} Sports`);

    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
