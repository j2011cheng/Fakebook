-- Dummy table --
DROP TABLE IF EXISTS dummy;
CREATE TABLE dummy(created TIMESTAMP WITH TIME ZONE);

-- Your database schema goes here --
DROP TABLE IF EXISTS people;
CREATE TABLE people(id UUID UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(), person jsonb);
