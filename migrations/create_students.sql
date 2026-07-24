-- migrations/create_students.sql
-- สร้างตาราง students
CREATE TABLE IF NOT EXISTS students (
  student_id SERIAL PRIMARY KEY,
  student_name TEXT NOT NULL
);
