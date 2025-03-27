-- Public domain books
INSERT INTO books (title, author, language, cover_url) VALUES
('ألف ليلة وليلة', 'Unknown', 'ar', 'covers/arabian-nights.jpg'),
('Crime and Punishment', 'Fyodor Dostoevsky', 'en', 'covers/crime-punishment.jpg');

-- Sample users (reference only - auth.users populated separately)
INSERT INTO user_roles (user_id, role) VALUES
('11111111-1111-1111-1111-111111111111', 'admin'),
('22222222-2222-2222-2222-222222222222', 'volunteer');

-- Sample chapters
INSERT INTO chapters (book_id, chapter_number, audio_url, narrator_id, status, duration_seconds) VALUES
(1, 1, 'recordings/1/chapter_1.mp3', '22222222-2222-2222-2222-222222222222', 'approved', 1800),
(1, 2, 'recordings/1/chapter_2.mp3', '22222222-2222-2222-2222-222222222222', 'pending', 1920);