-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --
INSERT INTO people(person,hash) VALUES ('{"name": "dev", "email": "dev@dev.dev"}','$2b$10$1O3LjIEoHhtK8nr9HyS0.ON/pnlp5HggKBv3Hp3d1YmL6xXCPjutG');

INSERT INTO categories(category) VALUES ('{"name": "vehicles"}');
INSERT INTO categories(category, parent_id) VALUES ('{"name": "cars"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));

INSERT INTO listings(listing, owner, category) VALUES ('{"name": "toyota car", "price": "$420.00"}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'cars'));

INSERT INTO listings(listing, owner, category) VALUES ('{"name": "toyota motorcycle", "price": "$420.00"}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
