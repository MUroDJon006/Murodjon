import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Data Store
  let jobs = [
    { id: "1", title: "Frontend Developer", salary: "$80k - $120k", location: "Remote", type: "Full-time", experience: "Mid-level", description: "Join our dynamic team building modern web applications.", requirements: ["React", "TypeScript", "Tailwind CSS"], category: "tech", isBeginner: true, isMilitary: false },
    { id: "2", title: "Marketing Specialist", salary: "$60k - $90k", location: "New York, NY", type: "Full-time", experience: "Entry-level", description: "Help us grow our brand presence across digital channels.", requirements: ["SEO", "Content Writing", "Social Media"], category: "marketing", isBeginner: true, isMilitary: true },
    { id: "3", title: "Data Analyst", salary: "$90k - $130k", location: "San Francisco, CA", type: "Full-time", experience: "Senior", description: "Analyze complex datasets to drive business decisions.", requirements: ["SQL", "Python", "Tableau"], category: "data", isBeginner: false, isMilitary: false },
  ];

  let courses = [
    { id: "1", name: "Full Stack Web Development", price: "$499", duration: "6 months", outcome: "Software Engineer", category: "tech" },
    { id: "2", name: "Digital Marketing Masterclass", price: "$299", duration: "3 months", outcome: "Marketing Manager", category: "marketing" },
  ];

  let universities = [
    { 
      id: "1", 
      name: "Tech Institute of Technology", 
      location: "Silicon Valley",
      faculties: ["Engineering", "Science"],
      majors: ["Computer Science", "Data Science"], 
      careerOutcomes: ["Software Engineer", "Data Scientist"], 
      salaryExpectations: "$100k+",
      exams: ["IELTS 6.5", "SAT 1200"]
    },
    { 
      id: "2", 
      name: "Global Business School", 
      location: "London, UK",
      faculties: ["Business", "Economics"],
      majors: ["Business Admin", "Marketing"], 
      careerOutcomes: ["Business Analyst", "Marketing Director"], 
      salaryExpectations: "$80k+",
      exams: ["IELTS 7.0", "GMAT 600"]
    },
  ];

  let careers = [
    { 
      id: "1", 
      name: "Software Engineering", 
      description: "Building and maintaining software systems.", 
      learningPath: "Learn HTML/CSS -> JavaScript -> React -> Node.js",
      relatedCourses: ["1"],
      universities: ["1"],
      salaryRange: "$70k - $200k",
      relatedJobs: ["1", "3"]
    }
  ];

  // API Routes
  app.get("/api/jobs", (req, res) => res.json(jobs));
  app.post("/api/jobs", (req, res) => {
    const newJob = { ...req.body, id: Date.now().toString() };
    jobs.push(newJob);
    res.status(201).json(newJob);
  });

  app.get("/api/courses", (req, res) => res.json(courses));
  app.post("/api/courses", (req, res) => {
    const newCourse = { ...req.body, id: Date.now().toString() };
    courses.push(newCourse);
    res.status(201).json(newCourse);
  });

  app.get("/api/universities", (req, res) => res.json(universities));
  app.post("/api/universities", (req, res) => {
    const newUni = { ...req.body, id: Date.now().toString() };
    universities.push(newUni);
    res.status(201).json(newUni);
  });

  app.get("/api/careers", (req, res) => res.json(careers));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
