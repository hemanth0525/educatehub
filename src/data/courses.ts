export type Course = {
  id: string;
  title: string;
  instructor: string;
  description: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  image: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    preview?: boolean;
  }[];
  resources?: {
    id: string;
    type: "transcript" | "notes" | "pdf";
    title: string;
    description: string;
    url?: string;
  }[];
};

export const courses: Course[] = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    instructor: "Sarah Johnson",
    description: "Learn the core concepts of web development, including HTML, CSS, and JavaScript. Build responsive websites from scratch and understand modern web development practices.",
    price: 49.99,
    rating: 4.8,
    students: 3245,
    duration: "12 hours",
    level: "Beginner",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    lessons: [
      { id: "1-1", title: "Introduction to HTML", duration: "45 min", preview: true },
      { id: "1-2", title: "Working with CSS", duration: "1 hour", preview: true },
      { id: "1-3", title: "JavaScript Basics", duration: "1.5 hours" },
      { id: "1-4", title: "Responsive Design", duration: "1 hour" },
      { id: "1-5", title: "Building Your First Website", duration: "2 hours" },
    ],
    resources: [
      { id: "1-r1", type: "transcript", title: "Introduction to HTML - Full Transcript", description: "Complete transcript of the HTML introduction video" },
      { id: "1-r2", type: "notes", title: "HTML & CSS Cheat Sheet", description: "Quick reference guide for HTML tags and CSS properties" },
      { id: "1-r3", type: "pdf", title: "Web Development Best Practices", description: "Comprehensive guide to modern web development standards" }
    ]
  },
  {
    id: "2",
    title: "The Complete UX/UI Design Bootcamp",
    instructor: "Alex Chen",
    description: "Master the art of user experience and interface design. Learn design principles, wireframing, prototyping, and how to create beautiful, functional designs that users love.",
    price: 69.99,
    rating: 4.9,
    students: 2187,
    duration: "20 hours",
    level: "Beginner",
    category: "Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2864&auto=format&fit=crop",
    lessons: [
      { id: "2-1", title: "Introduction to UX/UI", duration: "1 hour", preview: true },
      { id: "2-2", title: "User Research Methods", duration: "2 hours" },
      { id: "2-3", title: "Wireframing and Prototyping", duration: "3 hours" },
      { id: "2-4", title: "Design Systems", duration: "2.5 hours" },
      { id: "2-5", title: "User Testing", duration: "2 hours" },
    ],
    resources: [
      { id: "2-r1", type: "transcript", title: "Design Principles - Full Transcript", description: "Complete transcript of the design principles lecture" },
      { id: "2-r2", type: "notes", title: "UX Research Methodologies", description: "Detailed notes on user research approaches and techniques" },
      { id: "2-r3", type: "pdf", title: "Design System Components", description: "Visual guide to building consistent design systems" }
    ]
  },
  {
    id: "3",
    title: "Python Programming Masterclass",
    instructor: "Michael Brown",
    description: "Comprehensive Python course covering everything from basic syntax to advanced topics like machine learning. Perfect for beginners and those looking to expand their programming skills.",
    price: 59.99,
    rating: 4.7,
    students: 5432,
    duration: "25 hours",
    level: "Intermediate",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=2874&auto=format&fit=crop",
    lessons: [
      { id: "3-1", title: "Python Basics", duration: "2 hours", preview: true },
      { id: "3-2", title: "Data Structures and Algorithms", duration: "3 hours" },
      { id: "3-3", title: "Object-Oriented Programming", duration: "2.5 hours" },
      { id: "3-4", title: "Working with APIs", duration: "2 hours" },
      { id: "3-5", title: "Introduction to Machine Learning", duration: "4 hours" },
    ],
    resources: [
      { id: "3-r1", type: "transcript", title: "Python Fundamentals - Complete Transcript", description: "Word-by-word transcript of all Python basics videos" },
      { id: "3-r2", type: "notes", title: "Python Data Structures Guide", description: "Comprehensive notes on Python data structures with examples" },
      { id: "3-r3", type: "pdf", title: "Object-Oriented Programming in Python", description: "In-depth guide to OOP principles and implementation in Python" }
    ]
  },
  {
    id: "4",
    title: "iOS App Development with Swift",
    instructor: "Emily Zhang",
    description: "Learn to build iOS applications using Swift and Xcode. This course covers UI design, data persistence, networking, and publishing your app to the App Store.",
    price: 79.99,
    rating: 4.6,
    students: 1876,
    duration: "22 hours",
    level: "Intermediate",
    category: "Mobile Development",
    image: "https://images.unsplash.com/photo-1575313062580-e989d20ff0f7?q=80&w=2940&auto=format&fit=crop",
    lessons: [
      { id: "4-1", title: "Swift Programming Basics", duration: "3 hours", preview: true },
      { id: "4-2", title: "Building User Interfaces", duration: "4 hours" },
      { id: "4-3", title: "Data Persistence", duration: "2 hours" },
      { id: "4-4", title: "Networking and APIs", duration: "3 hours" },
      { id: "4-5", title: "Publishing to the App Store", duration: "1 hour" },
    ],
    resources: [
      { id: "4-r1", type: "transcript", title: "Swift Fundamentals - Video Transcripts", description: "Full transcripts of all Swift programming videos" },
      { id: "4-r2", type: "notes", title: "iOS UI Design Patterns", description: "Notes on best practices for iOS interface design" },
      { id: "4-r3", type: "pdf", title: "App Store Submission Guide", description: "Step-by-step guide to publishing your iOS app" }
    ]
  },
  {
    id: "5",
    title: "Advanced JavaScript and React",
    instructor: "David Wilson",
    description: "Take your JavaScript skills to the next level. Learn advanced JavaScript concepts and master React for building modern, scalable web applications.",
    price: 69.99,
    rating: 4.9,
    students: 2765,
    duration: "18 hours",
    level: "Advanced",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2940&auto=format&fit=crop",
    lessons: [
      { id: "5-1", title: "JavaScript ES6+ Features", duration: "2 hours", preview: true },
      { id: "5-2", title: "Asynchronous JavaScript", duration: "2 hours" },
      { id: "5-3", title: "React Fundamentals", duration: "3 hours" },
      { id: "5-4", title: "State Management", duration: "2.5 hours" },
      { id: "5-5", title: "Building a Full-Stack Application", duration: "4 hours" },
    ],
    resources: [
      { id: "5-r1", type: "transcript", title: "ES6+ Deep Dive - Full Transcript", description: "Complete transcript of advanced JavaScript lectures" },
      { id: "5-r2", type: "notes", title: "React Component Patterns", description: "Detailed notes on React component architecture" },
      { id: "5-r3", type: "pdf", title: "State Management Comparison", description: "Comprehensive guide comparing Redux, Context API, and other state solutions" }
    ]
  },
  {
    id: "6",
    title: "Data Science Essentials",
    instructor: "Laura Martinez",
    description: "Get started with data science using Python. Learn data analysis, visualization, and machine learning techniques to extract insights from real-world data.",
    price: 59.99,
    rating: 4.7,
    students: 3210,
    duration: "20 hours",
    level: "Intermediate",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
    lessons: [
      { id: "6-1", title: "Introduction to Data Science", duration: "1 hour", preview: true },
      { id: "6-2", title: "Data Cleaning and Preparation", duration: "3 hours" },
      { id: "6-3", title: "Data Visualization", duration: "2.5 hours" },
      { id: "6-4", title: "Statistical Analysis", duration: "3 hours" },
      { id: "6-5", title: "Machine Learning Fundamentals", duration: "4 hours" },
    ],
    resources: [
      { id: "6-r1", type: "transcript", title: "Data Science Fundamentals - Complete Transcript", description: "Full transcript of all data science lecture videos" },
      { id: "6-r2", type: "notes", title: "Python for Data Analysis", description: "Comprehensive notes on using Python's data science libraries" },
      { id: "6-r3", type: "pdf", title: "Statistical Methods Guide", description: "Reference guide for statistical analysis techniques" }
    ]
  },
];
