export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'expert' | 'admin';
  expertiseAreas?: string[]; // IDs of learning units the expert is qualified for
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
  authorId: string;
  views: number;
  rating: number;
  videoUrl?: string;
  materials?: string[];
  category?: string;
  learningUnitIds: string[]; // IDs of learning units this course belongs to
}

export interface Career {
  id: string;
  name: string;
  description: string;
  learningUnitIds: string[]; // IDs of learning units in this career
}

export interface LearningUnit {
  id: string;
  name: string;
  description: string;
  careerIds: string[]; // IDs of careers this unit belongs to
}

export interface Review {
  id: string;
  courseId: string;
  expertId: string;
  status: 'pending' | 'approved' | 'rejected';
  comment: string;
  createdAt: string;
}