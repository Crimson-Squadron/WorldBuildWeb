-- V4__add_chapter_image_caption.sql: Add image caption support to chapters

ALTER TABLE event_chapters ADD COLUMN image_caption TEXT NULL;

-- Populate seed chapters with contextual captions
UPDATE event_chapters SET image_caption = 'Subterranean bastion seawall prior to rupture during the midsummer eclipse.' WHERE id = 'ch-101';
UPDATE event_chapters SET image_caption = 'Breached undercroft gate where shadow aberrations surfaced.' WHERE id = 'ch-102';
UPDATE event_chapters SET image_caption = 'Evacuation route charted across the obsidian marshes.' WHERE id = 'ch-103';
UPDATE event_chapters SET image_caption = 'Crown Spire summit where the high council delegation convened.' WHERE id = 'ch-201';
UPDATE event_chapters SET image_caption = 'Formal demarcation boundary established across eastern highland passes.' WHERE id = 'ch-202';
UPDATE event_chapters SET image_caption = 'Bioluminescent resonance detected within ancient root structures.' WHERE id = 'ch-301';
