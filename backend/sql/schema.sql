-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- User Table --
DROP TABLE IF EXISTS people;
CREATE TABLE people(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), person jsonb);

-- Category Table --
DROP TABLE IF EXISTS categories;
CREATE TABLE categories(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), category jsonb, parent_id UUID, CONSTRAINT fk_parent FOREIGN KEY(parent_id) REFERENCES categories(id));

-- Listing Table --
DROP TABLE IF EXISTS listings;
CREATE TABLE listings(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), owner UUID, category UUID, CONSTRAINT fk_owner FOREIGN KEY(owner) REFERENCES people(id), CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES categories(id));
