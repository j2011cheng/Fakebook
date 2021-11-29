-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --
INSERT INTO people(person) VALUES ('{"name": "dev", "email": "dev@dev.dev", "hash": "$2b$10$1O3LjIEoHhtK8nr9HyS0.ON/pnlp5HggKBv3Hp3d1YmL6xXCPjutG"}');

INSERT INTO categories(category) VALUES ('{"name": "vehicles"}');
INSERT INTO categories(category, parent_id) VALUES ('{"name": "cars"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
