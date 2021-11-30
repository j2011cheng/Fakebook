-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --
INSERT INTO people(person,hash) VALUES ('{"name": "dev", "email": "dev@dev.dev"}','$2b$10$1O3LjIEoHhtK8nr9HyS0.ON/pnlp5HggKBv3Hp3d1YmL6xXCPjutG');

INSERT INTO categories(category) VALUES ('{"name": "vehicles"}');
INSERT INTO categories(category, parent_id) VALUES ('{"name": "cars"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "trucks"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "big rigs"}', (SELECT id FROM categories WHERE category->>'name' = 'trucks'));

INSERT INTO categories(category) VALUES ('{"name": "electronics"}');
INSERT INTO categories(category, parent_id) VALUES ('{"name": "phones"}', (SELECT id FROM categories WHERE category->>'name' = 'electronics'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "computers"}', (SELECT id FROM categories WHERE category->>'name' = 'electronics'));

INSERT INTO listings(listing, owner, category) VALUES ('{"name": "toyota car", "price": "$420.00"}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'cars'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "toyota motorcycle", "price": "$420.00"}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));

INSERT INTO filters(category, filter) VALUES (NULL, '{"name": "price", "type": "range"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'vehicles'), '{"name": "wheels", "type": "range"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'electronics'), '{"name": "battery life", "type": "range"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'cars'), '{"name": "electric", "type": "bool"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'computers'), '{"name": "OS", "type": "enum", "options": ["Windows", "Mac", "Linux", "Other"]}');
