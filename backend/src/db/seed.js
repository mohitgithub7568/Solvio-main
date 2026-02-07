import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";
import connectDB from "../db/connectDB.js";

// Test user data
const testUsers = [
  {
    name: "John Doe",
    email: "john@test.com",
    password: "password123",
    image: "https://ui-avatars.com/api/?name=John+Doe&size=200",
    resume: "",
  },
  {
    name: "Jane Smith",
    email: "jane@test.com",
    password: "password123",
    image: "https://ui-avatars.com/api/?name=Jane+Smith&size=200",
    resume: "",
  },
  {
    name: "Mike Johnson",
    email: "mike@test.com",
    password: "password123",
    image: "https://ui-avatars.com/api/?name=Mike+Johnson&size=200",
    resume: "",
  },
  {
    name: "Sarah Williams",
    email: "sarah@test.com",
    password: "password123",
    image: "https://ui-avatars.com/api/?name=Sarah+Williams&size=200",
    resume: "",
  },
  {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    image: "",
    resume: "",
  },
];

// Test company data
const testCompanies = [
  {
    name: "TechCorp Solutions",
    email: "hr@techcorp.com",
    password: "company123",
    image: "https://ui-avatars.com/api/?name=TechCorp&size=200&background=0D8ABC&color=fff",
  },
  {
    name: "Digital Innovators",
    email: "careers@digitalinnovators.com",
    password: "company123",
    image: "https://ui-avatars.com/api/?name=Digital+Innovators&size=200&background=FF6B6B&color=fff",
  },
  {
    name: "StartupHub Inc",
    email: "jobs@startuphub.com",
    password: "company123",
    image: "https://ui-avatars.com/api/?name=StartupHub&size=200&background=4ECDC4&color=fff",
  },
  {
    name: "Global Enterprises",
    email: "recruitment@globalenterprises.com",
    password: "company123",
    image: "https://ui-avatars.com/api/?name=Global+Enterprises&size=200&background=FFD93D&color=000",
  },
  {
    name: "Creative Studios",
    email: "hiring@creativestudios.com",
    password: "company123",
    image: "https://ui-avatars.com/api/?name=Creative+Studios&size=200&background=6C5CE7&color=fff",
  },
];

// Test job categories and levels
const jobCategories = [
  "Programming",
  "Design",
  "Marketing",
  "Sales",
  "Management",
  "Data Science",
  "Customer Support",
  "Finance",
];

const jobLevels = ["Beginner", "Intermediate", "Experienced", "Expert"];

const locations = [
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "Seattle, WA",
  "Boston, MA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Remote",
  "Denver, CO",
  "Miami, FL",
];

// Sample job templates
const jobTemplates = [
  {
    title: "Senior Full Stack Developer",
    category: "Programming",
    level: "Expert",
    description: "We are seeking a highly skilled Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies like React, Node.js, and MongoDB. Strong problem-solving skills and experience with cloud platforms are essential.",
    salary: 120000,
  },
  {
    title: "UI/UX Designer",
    category: "Design",
    level: "Intermediate",
    description: "Looking for a creative UI/UX Designer to craft beautiful and intuitive user experiences. You should have a strong portfolio showcasing your design thinking process and proficiency in Figma, Adobe XD, or similar tools.",
    salary: 85000,
  },
  {
    title: "Digital Marketing Manager",
    category: "Marketing",
    level: "Experienced",
    description: "Join our marketing team as a Digital Marketing Manager. You'll develop and execute comprehensive digital marketing strategies, manage campaigns across multiple channels, and analyze performance metrics to drive growth.",
    salary: 95000,
  },
  {
    title: "Data Scientist",
    category: "Data Science",
    level: "Expert",
    description: "We need a Data Scientist who can extract insights from complex datasets. Strong knowledge of Python, machine learning algorithms, and statistical analysis is required. Experience with TensorFlow or PyTorch is a plus.",
    salary: 130000,
  },
  {
    title: "Junior Frontend Developer",
    category: "Programming",
    level: "Beginner",
    description: "Great opportunity for a Junior Frontend Developer to grow their skills. You'll work with React and modern JavaScript to build responsive web applications under the guidance of senior developers.",
    salary: 65000,
  },
  {
    title: "Sales Executive",
    category: "Sales",
    level: "Intermediate",
    description: "Seeking an enthusiastic Sales Executive to drive revenue growth. You'll be responsible for identifying new business opportunities, building client relationships, and closing deals. Previous B2B sales experience preferred.",
    salary: 75000,
  },
  {
    title: "Product Manager",
    category: "Management",
    level: "Experienced",
    description: "Looking for an experienced Product Manager to lead product development from concept to launch. You'll work cross-functionally with engineering, design, and marketing teams to deliver exceptional products.",
    salary: 110000,
  },
  {
    title: "Customer Support Specialist",
    category: "Customer Support",
    level: "Beginner",
    description: "Join our customer support team to help our users succeed. Excellent communication skills and a patient, helpful attitude are essential. Training will be provided.",
    salary: 45000,
  },
  {
    title: "Backend Developer",
    category: "Programming",
    level: "Intermediate",
    description: "We're hiring a Backend Developer with strong expertise in Node.js, Express, and database design. You'll build scalable APIs and work on system architecture.",
    salary: 95000,
  },
  {
    title: "Graphic Designer",
    category: "Design",
    level: "Intermediate",
    description: "Creative Graphic Designer needed to create stunning visual content for digital and print media. Proficiency in Adobe Creative Suite is required.",
    salary: 70000,
  },
  {
    title: "Financial Analyst",
    category: "Finance",
    level: "Experienced",
    description: "Seeking a Financial Analyst to provide insights into financial performance and help drive strategic decisions. Strong Excel skills and financial modeling experience required.",
    salary: 90000,
  },
  {
    title: "DevOps Engineer",
    category: "Programming",
    level: "Expert",
    description: "Experienced DevOps Engineer needed to manage our cloud infrastructure and CI/CD pipelines. Experience with AWS, Docker, and Kubernetes is essential.",
    salary: 125000,
  },
];

// Function to generate random date within last 30 days
const getRandomRecentDate = () => {
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  return Math.floor(Math.random() * (now - thirtyDaysAgo) + thirtyDaysAgo);
};

// Seed function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await JobApplication.deleteMany({});
    console.log("✅ Existing data cleared\n");

    // Seed Users
    console.log("👥 Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await Promise.all(
      testUsers.map(async (user) => {
        return await User.create({
          ...user,
          password: hashedPassword,
        });
      })
    );
    console.log(`✅ Created ${users.length} test users\n`);

    // Seed Companies
    console.log("🏢 Seeding companies...");
    const companyPassword = await bcrypt.hash("company123", 10);
    const companies = await Promise.all(
      testCompanies.map(async (company) => {
        return await Company.create({
          ...company,
          password: companyPassword,
        });
      })
    );
    console.log(`✅ Created ${companies.length} test companies\n`);

    // Seed Jobs (create 3-5 jobs per company)
    console.log("💼 Seeding jobs...");
    const jobs = [];
    for (const company of companies) {
      const numJobs = Math.floor(Math.random() * 3) + 3; // 3-5 jobs per company
      
      for (let i = 0; i < numJobs; i++) {
        const template = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
        const job = await Job.create({
          title: template.title,
          description: template.description,
          location: locations[Math.floor(Math.random() * locations.length)],
          level: template.level,
          salary: template.salary + Math.floor(Math.random() * 20000) - 10000, // Add some variation
          category: template.category,
          companyId: company._id,
          date: getRandomRecentDate(),
          visible: Math.random() > 0.1, // 90% visible, 10% hidden
        });
        jobs.push(job);
      }
    }
    console.log(`✅ Created ${jobs.length} test jobs\n`);

    // Seed Job Applications (random applications from users to jobs)
    console.log("📝 Seeding job applications...");
    const applications = [];
    const statuses = ["Pending", "Accepted", "Rejected"];
    
    // Each user applies to 2-5 random jobs
    for (const user of users) {
      const numApplications = Math.floor(Math.random() * 4) + 2; // 2-5 applications
      const appliedJobs = new Set();
      
      for (let i = 0; i < numApplications; i++) {
        let randomJob;
        do {
          randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        } while (appliedJobs.has(randomJob._id.toString()));
        
        appliedJobs.add(randomJob._id.toString());
        
        const application = await JobApplication.create({
          userId: user._id,
          companyId: randomJob.companyId,
          jobId: randomJob._id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          date: getRandomRecentDate(),
        });
        applications.push(application);
      }
    }
    console.log(`✅ Created ${applications.length} test applications\n`);

    // Summary
    console.log("=" .repeat(50));
    console.log("🎉 Database seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Companies: ${companies.length}`);
    console.log(`   - Jobs: ${jobs.length}`);
    console.log(`   - Applications: ${applications.length}\n`);
    
    console.log("🔑 Test Credentials:\n");
    console.log("📱 User Accounts:");
    console.log("   Email: john@test.com | Password: password123");
    console.log("   Email: jane@test.com | Password: password123");
    console.log("   Email: mike@test.com | Password: password123");
    console.log("   Email: sarah@test.com | Password: password123");
    console.log("   Email: test@example.com | Password: password123\n");
    
    console.log("🏢 Company Accounts:");
    console.log("   Email: hr@techcorp.com | Password: company123");
    console.log("   Email: careers@digitalinnovators.com | Password: company123");
    console.log("   Email: jobs@startuphub.com | Password: company123");
    console.log("   Email: recruitment@globalenterprises.com | Password: company123");
    console.log("   Email: hiring@creativestudios.com | Password: company123\n");
    console.log("=" .repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
