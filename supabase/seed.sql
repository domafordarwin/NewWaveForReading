-- Seed sample data for testing

insert into public.users (email, name, user_type, birth_date, school_name, grade, is_active, password_hash)
values
  ('student1@example.com', 'Student One', 'STUDENT', '2010-03-15', 'Seoul Middle School', 2, true, 'ehrtjtoanfruf'),
  ('student2@example.com', 'Student Two', 'STUDENT', '2010-05-21', 'Seoul Middle School', 2, true, 'ehrtjtoanfruf'),
  ('student3@example.com', 'Student Three', 'STUDENT', '2009-11-02', 'Seoul Middle School', 3, true, 'ehrtjtoanfruf'),
  ('student4@example.com', 'Student Four', 'STUDENT', '2009-01-12', 'Seoul Middle School', 3, true, 'ehrtjtoanfruf'),
  ('student5@example.com', 'Student Five', 'STUDENT', '2008-07-18', 'Seoul Middle School', 4, true, 'ehrtjtoanfruf'),
  ('student6@example.com', 'Student Six', 'STUDENT', '2008-10-09', 'Seoul Middle School', 4, true, 'ehrtjtoanfruf'),
  ('student7@example.com', 'Student Seven', 'STUDENT', '2007-02-26', 'Seoul Middle School', 5, true, 'ehrtjtoanfruf'),
  ('student8@example.com', 'Student Eight', 'STUDENT', '2007-09-30', 'Seoul Middle School', 5, true, 'ehrtjtoanfruf'),
  ('student9@example.com', 'Student Nine', 'STUDENT', '2006-04-14', 'Seoul Middle School', 6, true, 'ehrtjtoanfruf'),
  ('student10@example.com', 'Student Ten', 'STUDENT', '2006-12-07', 'Seoul Middle School', 6, true, 'ehrtjtoanfruf'),
  ('teacher1@example.com', 'Teacher One', 'TEACHER', null, 'Seoul Middle School', null, true, 'ehrtjtoanfruf'),
  ('teacher2@example.com', 'Teacher Two', 'TEACHER', null, 'Seoul Middle School', null, true, 'ehrtjtoanfruf'),
  ('parent1@example.com', 'Parent One', 'PARENT', null, null, null, true, 'ehrtjtoanfruf'),
  ('parent2@example.com', 'Parent Two', 'PARENT', null, null, null, true, 'ehrtjtoanfruf'),
  ('admin1@example.com', 'Admin User', 'ADMIN', null, null, null, true, 'ehrtjtoanfruf');

insert into public.books (title, author, publisher, published_year, isbn, category, description, cover_image_url, difficulty_level)
values
  ('Animal Farm', 'George Orwell', 'Minumsa', 2003, '9788937460449', 'Classic', 'An allegory about power and corruption.', 'https://image.yes24.com/goods/9172/XL', 'MIDDLE'),
  ('The Little Prince', 'Antoine de Saint-Exupery', 'Munhakdongne', 2015, '9788954635950', 'Classic', 'A philosophical tale about life and relationships.', 'https://image.yes24.com/goods/24906982/XL', 'ELEMENTARY'),
  ('Sapiens', 'Yuval Noah Harari', 'Gimmyoung', 2015, '9788934972464', 'Humanities', 'A history of humankind and its future.', 'https://image.yes24.com/goods/23030284/XL', 'HIGH');

insert into public.topics (book_id, topic_text, topic_type, difficulty_level, keywords)
values
  (1, 'Analyze how power corruption unfolds in Animal Farm.', 'ANALYTICAL', 4, array['power','corruption','allegory']),
  (2, 'Explain the meaning of "what is essential is invisible to the eye".', 'CRITICAL', 3, array['values','relationships','meaning']),
  (3, 'Predict the future impact of a key factor in Sapiens.', 'CREATIVE', 5, array['evolution','society','future']);

insert into public.assessments (student_id, topic_id, assessment_type, status, started_at, submitted_at, time_limit_minutes, word_count_min, word_count_max)
values
  (1, 1, 'ESSAY', 'EVALUATED', '2024-12-20T10:00:00Z', '2024-12-20T11:25:00Z', 90, 800, 2000),
  (1, 2, 'ESSAY', 'IN_PROGRESS', '2024-12-27T09:30:00Z', null, 90, 800, 2000),
  (1, 3, 'ESSAY', 'NOT_STARTED', null, null, 90, 800, 2000);
