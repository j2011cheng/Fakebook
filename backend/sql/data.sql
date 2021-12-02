-- Dummy Data --
INSERT INTO dummy (created) VALUES (current_timestamp);

-- Populate Your Tables Here --
INSERT INTO people(person,hash) VALUES ('{"name": "dev", "email": "dev@dev.dev"}','$2b$10$1O3LjIEoHhtK8nr9HyS0.ON/pnlp5HggKBv3Hp3d1YmL6xXCPjutG');

INSERT INTO categories(category) VALUES ('{"name": "vehicles"}');
INSERT INTO categories(category, parent_id) VALUES ('{"name": "cars"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "motorcycles"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "trucks"}', (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "big rigs"}', (SELECT id FROM categories WHERE category->>'name' = 'trucks'));

INSERT INTO categories(category) VALUES ('{"name": "electronics"}');
INSERT INTO categories(category, parent_id) VALUES ('{"name": "phones"}', (SELECT id FROM categories WHERE category->>'name' = 'electronics'));
INSERT INTO categories(category, parent_id) VALUES ('{"name": "computers"}', (SELECT id FROM categories WHERE category->>'name' = 'electronics'));

INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Toyota Core IC", "description": "this is a forklift made by toyota", "attributes": {"price": 30000.00}, "images": ["https://cdn.toyotaforklift.com/content/20150831201444/small-ic-pneumatic.png"]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'vehicles'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Tesla Model 3", "description": "this is an electric tesla", "attributes": {"price": 90000.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'cars'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Toyota Corolla", "description": "this is a car made by toyota", "attributes": {"price": 40000.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'cars'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Toyota Tacoma", "description": "this is a truck made by toyota", "attributes": {"price": 60000.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'trucks'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Toyota Camry", "description": "this is a car made by toyota", "attributes": {"price": 50000.00}, "images": ["https://cars.usnews.com/static/images/Auto/izmo/i33960654/2018_toyota_camry_angularfront.jpg", "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/2020-toyta-camry-mmp-1-1566921359.jpg"]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'cars'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Volvo VNL", "description": "this is a big rig made by volvo", "attributes": {"price": 100000.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'big rigs'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Yamaha YZF-R1", "description": "this is a motorcycle made by yamaha", "attributes": {"price": 45000.00}, "images": ["https://cdp.azureedge.net/products/USA/YA/2021/MC/SUPERSPORT/YZF-R1/50/TEAM_YAMAHA_BLUE/2000000025.JPG", "https://cdp.azureedge.net/products-private/prod/9b45ffc5-989f-4ce2-9033-5383178b5279/6dac21e1-4f17-407e-8a45-a60101214792/00000000-0000-0000-0000-000000000000/7265331c-dd94-42bc-8bd5-ac30002e44b4/18118744-cc23-43e7-908c-ac8d00f7d8c2/6000000001.jpeg"]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'motorcycles'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "Yamaha PSR-E373", "description": "this is a keyboard made by yamaha", "attributes": {"price": 150.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'electronics'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "iPhone X", "description": "this is a phone made by apple", "attributes": {"price": 400.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'phones'));
INSERT INTO listings(listing, owner, category) VALUES ('{"name": "MacBook Pro", "description": "this is a laptop made by apple", "attributes": {"price": 1000.00}, "images": [""]}', (SELECT id FROM people LIMIT 1), (SELECT id FROM categories WHERE category->>'name' = 'computers'));

INSERT INTO filters(category, filter) VALUES (NULL, '{"name": "price", "type": "range"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'vehicles'), '{"name": "wheels", "type": "range"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'electronics'), '{"name": "battery life", "type": "range"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'cars'), '{"name": "electric", "type": "bool"}');
INSERT INTO filters(category, filter) VALUES ((SELECT id FROM categories WHERE category->>'name' = 'computers'), '{"name": "OS", "type": "enum", "options": ["Windows", "Mac", "Linux", "Other"]}');
