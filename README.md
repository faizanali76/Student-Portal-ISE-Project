# MyPortal - Student Management System

A comprehensive web-based portal for managing students, teachers, and courses with role-based dashboards and real-time data management.

## 🚀 Features

### 👨‍🎓 Student Portal
- **Dashboard**: View GPA, attendance percentage, and enrolled courses
- **Course Enrollment**: Browse and enroll in available courses
- **Attendance Tracking**: View attendance history and statistics
- **Results & Grades**: Check assessment marks, weighted scores, and final grades
- **Notifications**: Receive important updates and announcements

### 👨‍🏫 Teacher Portal
- **Dashboard**: Overview of assigned courses and student performance
- **Mark Attendance**: Record student attendance for each class
- **Upload Marks**: Enter and manage assessment marks (quizzes, assignments, midterms, finals)
- **Course Management**: View enrolled students and course statistics
- **Attendance Trends**: Visualize attendance patterns over time

### 👨‍💼 Admin Portal
- **Dashboard**: System-wide statistics and recent activity
- **User Management**: Add and manage students and teachers
- **Course Management**: Create courses and assign them to teachers
- **Batch Operations**: Handle multiple users and courses efficiently

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: [Vercel](https://vercel.com/)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd myPortal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase database**
   
   Run the SQL schema provided in `docs/schema.md` in your Supabase SQL editor to create all necessary tables.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
myPortal/
├── app/
│   ├── actions/           # Server actions for data operations
│   │   ├── student-actions.ts
│   │   ├── teacher-actions.ts
│   │   ├── course-actions.ts
│   │   └── dashboard-actions.ts
│   ├── admin/             # Admin dashboard pages
│   ├── student/           # Student dashboard pages
│   ├── teacher/           # Teacher dashboard pages
│   └── login/             # Authentication page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── sidebar.tsx       # Navigation sidebar
├── utils/
│   └── supabase/         # Supabase client configuration
├── docs/                 # Documentation
│   └── schema.md         # Database schema
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses the following main tables:
- `profiles` - User profiles with role information
- `students` - Student-specific data (roll number, batch, etc.)
- `teachers` - Teacher-specific data (employee ID, department, etc.)
- `courses` - Course information and assessment weightages
- `enrollments` - Student course enrollments
- `attendance` - Attendance records
- `assessments` - Assessment definitions
- `student_marks` - Individual student marks

For detailed schema, see `docs/schema.md`.

## 🔐 Authentication & Roles

The system supports three user roles:
- **Student**: Access to personal dashboard, courses, and results
- **Teacher**: Manage courses, attendance, and marks
- **Admin**: Full system access and user management

Role-based access control is implemented using Supabase RLS (Row Level Security) policies.

## 🎨 Key Features Explained

### Grade Calculation
- Supports multiple assessment types: Quizzes, Assignments, Midterms, Finals
- Configurable weightages per course
- Individual assessment weights calculated automatically
- Final grade assigned only when all marks are uploaded

### Attendance System
- Teachers mark attendance by course and date
- Students view attendance history and percentage
- Attendance trends visualized with charts

### User Management
- Automated user creation with role assignment
- Campus-specific roll number generation for students
- Employee ID generation for teachers

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The `main` branch is automatically deployed to production.

## 👥 Team Collaboration

### Branch Strategy
- `main` - Production branch (connected to Vercel)
- `teacher-branch` - Teacher-related features
- `student-branch` - Student-related features

### Working on Features
Each team member can work on their respective branch without affecting production:
```bash
git checkout -b your-branch-name
# Make changes
git add .
git commit -m "Your commit message"
git push origin your-branch-name
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🐛 Known Issues

- Ensure all environment variables are properly set
- Database migrations should be run manually in Supabase
- First-time users must be created via Supabase Auth dashboard

## 📄 License

This project is developed as part of an academic assignment.

## 👨‍💻 Contributors

- **Faizan Ali** - Main Branch & Integration & Admin Portal Features
- **Rafay** - Teacher Portal Features
- **Meer** - Student Portal Features

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database and Auth by [Supabase](https://supabase.com/)
