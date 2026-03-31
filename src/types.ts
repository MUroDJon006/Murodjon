export type UserRole = 'user' | 'super_admin' | 'job_admin' | 'course_admin' | 'university_admin';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  createdAt: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface Job {
  id: string;
  title: string;
  salary: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  category: string;
  isBeginner: boolean;
  isMilitary: boolean;
}

export interface Course {
  id: string;
  name: string;
  price: string;
  duration: string;
  outcome: string;
  category: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  faculties: string[];
  majors: string[];
  careerOutcomes: string[];
  salaryExpectations: string;
  exams: string[];
}

export interface Career {
  id: string;
  name: string;
  description: string;
  learningPath: string;
  relatedCourses: string[];
  universities: string[];
  salaryRange: string;
  relatedJobs: string[];
}
