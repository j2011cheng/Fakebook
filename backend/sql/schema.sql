-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

DROP TABLE IF EXISTS responses;
DROP TABLE IF EXISTS filters;
DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS people;
DROP TABLE IF EXISTS categories;

-- User Table --
CREATE TABLE people(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), hash CHAR(60), person jsonb);

-- Category Table --
CREATE TABLE categories(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), category jsonb, parent_id UUID, CONSTRAINT fk_parent FOREIGN KEY(parent_id) REFERENCES categories(id));

-- Listing Table --
CREATE TABLE listings(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), listing jsonb, owner UUID, category UUID, CONSTRAINT fk_owner FOREIGN KEY(owner) REFERENCES people(id), CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES categories(id));

-- Filters Table --
CREATE TABLE filters(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), filter jsonb, category UUID, CONSTRAINT fk_category FOREIGN KEY(category) REFERENCES categories(id));

-- Responses Table --
CREATE TABLE responses(id SERIAL PRIMARY KEY, listing UUID, owner UUID, message TEXT, CONSTRAINT fk_listing FOREIGN KEY(listing) REFERENCES listings(id), CONSTRAINT fk_owner FOREIGN KEY(owner) REFERENCES people(id));
