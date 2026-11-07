-- V3__add_synopsis_and_images.sql: Add synopsis and image support to events and chapters

ALTER TABLE historical_events ADD COLUMN synopsis TEXT NULL;
ALTER TABLE historical_events ADD COLUMN image_url VARCHAR(500) NULL;
ALTER TABLE event_chapters ADD COLUMN image_url VARCHAR(500) NULL;

-- Update existing seeded events with rich synopses and placeholder images
UPDATE historical_events
SET synopsis = 'A catastrophic breach of ancient obsidian bastions beneath the Sunken Citadel during a midsummer eclipse, plunging the ancestral fortress and archival vaults into the abyss.',
    image_url = '/placeholders/3347400_64.jpg'
WHERE id = 'evt-001';

UPDATE event_chapters SET image_url = '/placeholders/3347400_65.jpg' WHERE id = 'ch-101';
UPDATE event_chapters SET image_url = '/placeholders/3347400_66.jpg' WHERE id = 'ch-102';
UPDATE event_chapters SET image_url = '/placeholders/3347400_68.jpg' WHERE id = 'ch-103';

UPDATE historical_events
SET synopsis = 'A historic peace concordat signed at Crown Spire between the Solar Dynasty and Iron Vanguard, ending fifty years of high mountain border skirmishes.',
    image_url = '/placeholders/3347400_67.jpg'
WHERE id = 'evt-002';

UPDATE event_chapters SET image_url = '/placeholders/3347400_68.jpg' WHERE id = 'ch-201';
UPDATE event_chapters SET image_url = '/placeholders/3347400_69.jpg' WHERE id = 'ch-202';

UPDATE historical_events
SET synopsis = 'Harmonic reverberation of ancient root networks within the primeval Valen woodland, activating dormant bioluminescent seedpods and guardian runestones.',
    image_url = '/placeholders/3347400_69.jpg'
WHERE id = 'evt-003';

UPDATE event_chapters SET image_url = '/placeholders/3347400_64.jpg' WHERE id = 'ch-301';
