-- V2__seed_lore_data.sql: Sample worldbuilding lore for testing

-- Seed Locations
INSERT INTO locations (id, name, description, map_x, map_y) VALUES
('loc-001', 'The Sunken Citadel', 'An ancient sunken fortress surrounded by mist and obsidian marshes.', 35.5, 62.1),
('loc-002', 'Solaris Highlands', 'High mountain plateaus bathed in perpetual golden sunlight.', 78.2, 24.8),
('loc-003', 'Valen Deep Forest', 'Enchanted primeval woodland protected by guardian spirits and runestones.', 18.0, 45.3);

-- Seed Factions
INSERT INTO factions (id, name, banner_color, description) VALUES
('fac-001', 'The Iron Vanguard', '#b91c1c', 'Militaristic order renowned for runic steel armor and disciplined phalanxes.'),
('fac-002', 'Solar Dynasty', '#d97706', 'Ancient noble empire claiming lineage from the first dawn gods.'),
('fac-003', 'Circle of the Mists', '#059669', 'Hermetic order of scholars, botanists, and chronomancers.');

-- Seed Event 1: The Fall of the Sunken Citadel
INSERT INTO historical_events (id, title, event_date, location_id, created_at, updated_at) VALUES
('evt-001', 'The Fall of the Sunken Citadel', '1452-06-18', 'loc-001', NOW(), NOW());

INSERT INTO event_factions (event_id, faction_id) VALUES
('evt-001', 'fac-001'),
('evt-001', 'fac-003');

INSERT INTO event_chapters (id, event_id, order_index, chapter_title, content) VALUES
('ch-101', 'evt-001', 1, 'Prelude: The Rising Tides', 'For three seasons, the brackish waters rose steadily against the obsidian bastions. The guards of the Citadel noticed tremors beneath the foundations, but royal astronomers attributed the tides to the twin moons alignement.'),
('ch-102', 'evt-001', 2, 'The Breach', 'On the night of the midsummer eclipse, the seawall shattered. Vanguard battalions clashed with shadow aberrations spilling through the sunken undercrofts.'),
('ch-103', 'evt-001', 3, 'Aftermath and Evacuation', 'The Citadel was lost to the depths. Only twenty-four scrolls were recovered from the High Archive, sparking centuries of territorial dispute.');

-- Seed Event 2: The Treaty of the Golden Dawn
INSERT INTO historical_events (id, title, event_date, location_id, created_at, updated_at) VALUES
('evt-002', 'The Treaty of the Golden Dawn', '1520-03-21', 'loc-002', NOW(), NOW());

INSERT INTO event_factions (event_id, faction_id) VALUES
('evt-002', 'fac-002'),
('evt-002', 'fac-001');

INSERT INTO event_chapters (id, event_id, order_index, chapter_title, content) VALUES
('ch-201', 'evt-002', 1, 'Summoning the High Council', 'Representatives from across the highlands gathered at the Crown Spire to formalize boundaries and trade pacts.'),
('ch-202', 'evt-002', 2, 'The Great Concession', 'The Solar Emperor conceded sovereignty over the eastern passes in exchange for perpetual vanguard supply shipments.');

-- Seed Event 3: Awakening of the Whispering Roots
INSERT INTO historical_events (id, title, event_date, location_id, created_at, updated_at) VALUES
('evt-003', 'Awakening of the Whispering Roots', '1388-10-05', 'loc-003', NOW(), NOW());

INSERT INTO event_factions (event_id, faction_id) VALUES
('evt-003', 'fac-003');

INSERT INTO event_chapters (id, event_id, order_index, chapter_title, content) VALUES
('ch-301', 'evt-003', 1, 'The Hum in the Soil', 'Root networks began resonating with celestial harmonies, causing dormant seedpods to glow with emerald incandescence.');
