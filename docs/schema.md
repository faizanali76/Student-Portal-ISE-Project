## db schema

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attendance_records (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  enrollment_id uuid NOT NULL,
  date date NOT NULL,
  status USER-DEFINED NOT NULL,
  marked_by uuid,
  marked_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT attendance_records_pkey PRIMARY KEY (id),
  CONSTRAINT attendance_records_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id),
  CONSTRAINT attendance_records_marked_by_fkey FOREIGN KEY (marked_by) REFERENCES public.teachers(id)
);
CREATE TABLE public.courses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  course_code text NOT NULL UNIQUE,
  course_name text NOT NULL,
  credits integer NOT NULL,
  department text,
  semester text,
  schedule text,
  teacher_id uuid,
  max_capacity integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT courses_pkey PRIMARY KEY (id),
  CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id)
);
CREATE TABLE public.enrollments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL,
  course_id uuid NOT NULL,
  enrollment_date date DEFAULT CURRENT_DATE,
  status USER-DEFINED DEFAULT 'active'::enrollment_status,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id),
  CONSTRAINT enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.marks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  enrollment_id uuid NOT NULL UNIQUE,
  quiz_marks numeric DEFAULT 0,
  quiz_max numeric DEFAULT 0,
  assignment_marks numeric DEFAULT 0,
  assignment_max numeric DEFAULT 0,
  midterm_marks numeric DEFAULT 0,
  midterm_max numeric DEFAULT 0,
  final_marks numeric DEFAULT 0,
  final_max numeric DEFAULT 0,
  total_marks numeric DEFAULT (((quiz_marks + assignment_marks) + midterm_marks) + final_marks),
  grade text,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT marks_pkey PRIMARY KEY (id),
  CONSTRAINT marks_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id),
  CONSTRAINT marks_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.teachers(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  related_course_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id),
  CONSTRAINT notifications_related_course_id_fkey FOREIGN KEY (related_course_id) REFERENCES public.courses(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  role USER-DEFINED NOT NULL DEFAULT 'student'::user_role,
  phone text,
  profile_picture_url text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.students (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  roll_number text NOT NULL UNIQUE,
  batch text,
  program text,
  enrollment_year integer,
  CONSTRAINT students_pkey PRIMARY KEY (id),
  CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.teachers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  employee_id text NOT NULL UNIQUE,
  department text,
  designation text,
  CONSTRAINT teachers_pkey PRIMARY KEY (id),
  CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);