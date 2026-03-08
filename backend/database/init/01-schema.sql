-- Forum Website Database Schema
-- Version: 1.0.0
-- Created: 2026-03-08

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_status AS ENUM ('active', 'banned', 'deleted');
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE topic_status AS ENUM ('draft', 'published', 'hidden', 'deleted');
CREATE TYPE resource_status AS ENUM ('draft', 'published', 'hidden', 'deleted');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
