-- Sample Data for Ramadan Feature

-- Insert sample daily reminders
INSERT INTO ramadan_daily_reminders (day_number, reminder_type, title, english_text, reference, is_published, publish_date)
VALUES
  (1, 'hadith', 'The Start of a Blessed Journey', 'The Prophet Muhammad (peace be upon him) said: "Whoever observes fasts during Ramadan with faith and seeking his reward from Allah then his past sins will be forgiven."', 'Sahih Bukhari 1:37', TRUE, NOW()::date),
  (2, 'dua', 'Dua for Forgiveness', 'O Allah, forgive me for the sins I have committed intentionally and unintentionally, knowingly and unknowingly. O Allah, I seek Your mercy and ask for Your forgiveness.', 'Traditional Dua', TRUE, NOW()::date + 1),
  (3, 'quote', 'The Spirit of Ramadan', 'Ramadan is not just about abstaining from food and drink. It is about purifying the soul, strengthening the spirit, and deepening our connection with Allah.', 'Islamic Wisdom', TRUE, NOW()::date + 2),
  (4, 'tip', 'Practical Ramadan Tip', 'Use your extra time in Ramadan to strengthen family bonds. Share meals together, pray together, and support one another. Family is the foundation of a strong community.', 'Community Guide', TRUE, NOW()::date + 3)
ON CONFLICT (day_number) DO NOTHING;

-- Insert sample knowledge articles
INSERT INTO ramadan_knowledge_base (slug, title, description, content, category, difficulty_level, read_time_minutes, is_published)
VALUES
  ('what-is-ramadan', 'What is Ramadan?', 'Understanding the spiritual significance of the Islamic month of Ramadan', 'Ramadan is the ninth month of the Islamic lunar calendar. It is the month in which the Quran was revealed to Prophet Muhammad (peace be upon him). Muslims observe Ramadan by fasting from dawn to sunset, engaging in prayer, reciting the Quran, and performing acts of charity. The fasting is mandatory for all adult Muslims, except those who are ill, traveling, pregnant, or nursing.', 'basics', 'beginner', 5, TRUE),
  ('who-must-fast', 'Who Must Fast?', 'Understanding the obligations and exceptions in Ramadan fasting', 'Fasting during Ramadan is obligatory (Wajib) for every Muslim who meets these conditions: (1) Has reached puberty, (2) Has sound mind and intellect, (3) Is in good health, (4) Is not traveling, (5) Is not pregnant or nursing, (6) Is not menstruating. Those who are unable to fast due to valid reasons can make up the days later or feed a poor person for each day missed.', 'basics', 'beginner', 4, TRUE),
  ('things-break-fast', 'Things That Break the Fast', 'Essential knowledge about what invalidates fasting', 'Several things can break the fast if done intentionally: (1) Eating or drinking, (2) Intimate relations, (3) Deliberate vomiting, (4) Menstruation, (5) Wet dreams, (6) Taking injections that provide nutrition. Activities that do NOT break the fast include: swallowing saliva, taking medicine (non-nutritive), swimming (without water entering throat), brushing teeth, medical tests, and wet dreams.', 'fasting', 'beginner', 5, TRUE),
  ('laylatul-qadr', 'Laylatul Qadr (The Night of Power)', 'Understanding the most blessed night of Ramadan', 'Laylatul Qadr is the night when the Quran was first revealed to Prophet Muhammad. It is mentioned in Surah Al-Qadr as "better than a thousand months." Worship on this night is worth more than worship in a thousand months. This night is believed to fall in the odd-numbered nights of the last ten days of Ramadan. Many Muslims intensify their worship during this period, especially through Tarawih prayers and Quran recitation.', 'spiritual', 'intermediate', 6, TRUE),
  ('zakat-ul-fitr', 'Zakat-ul-Fitr Explained', 'Understanding the charity obligation at the end of Ramadan', 'Zakat-ul-Fitr is an obligatory charity that must be given before the Eid prayer to purify the fasting person and provide food for the poor. It is due on every person who fasted during Ramadan and equals the value of one meal (approximately 2-3 pounds of staple food or its monetary equivalent). It can be paid anytime from the first of Ramadan until before Eid prayer, though it is preferred to pay it just before Eid.', 'practical', 'beginner', 4, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample duas
INSERT INTO ramadan_duas (title, category, arabic_text, arabic_transliteration, english_translation, reference, is_featured)
VALUES
  ('Dua Before Fasting', 'suhoor', 'نويت أن أصوم غدا من شهر رمضان', 'Nawaitu an asuma ghadan min shahri Ramadan', 'I intend to fast tomorrow in the month of Ramadan', 'Islamic Practice', TRUE),
  ('Dua at Iftar', 'iftar', 'ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله', 'Dhahaba al-zama wa ibtalat al-uroq wa thabata al-ajru in sha Allah', 'Thirst has gone, the vessels are moistened, and the reward is fixed, if Allah wills', 'Sunan Abu Dawud', TRUE),
  ('Dua for Forgiveness', 'forgiveness', 'يا غفار يا قهار يا ودود يا ودود يا ذا الجلال والإكرام اغفر لي', 'Ya Ghaffar Ya Qahhar Ya Wadud Ya Wadud ya dhal-jalal wa-al-ikram ighfir lee', 'O Pardoner, O Powerful, O Affectionate, O Affectionate, O One full of Majesty and Honor, forgive me', 'Islamic Tradition', FALSE),
  ('Dua for Last 10 Nights', 'last-ten-nights', 'اللهم إنك عفو تحب العفو فاعف عني', 'Allahumma innaka afuwwun tuhibbul-afwa fa-fu anni', 'O Allah, You are the Pardoner, You love pardon, so pardon me', 'Jami at-Tirmidhi', TRUE)
ON CONFLICT DO NOTHING;

-- Note: These are samples. Add more content as needed through the admin panel or direct database inserts.
-- All data is configured for publish_date constraints as needed.
