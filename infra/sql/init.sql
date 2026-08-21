-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Teams
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    team_id UUID REFERENCES teams(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagements (Private to FBE)
CREATE TABLE IF NOT EXISTS engagements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    customer_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'CREATED', -- CREATED, PROCESSING, COMPLETED, FAILED
    engagement_type TEXT NOT NULL DEFAULT 'GENERAL',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagement Artifacts (Private audio/photos/notes)
CREATE TABLE IF NOT EXISTS engagement_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    artifact_type TEXT NOT NULL, -- AUDIO, IMAGE, NOTE
    storage_url TEXT NOT NULL,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insights (Agent extracted)
CREATE TABLE IF NOT EXISTS insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    engagement_id UUID NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
    dimension TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS insights_engagement_idx ON insights(engagement_id);

-- Knowledge Base Category Enum
DO $$ BEGIN
    CREATE TYPE knowledge_category AS ENUM (
        'INDUSTRY_BACKGROUND',
        'CUSTOMER_PATTERN',
        'COMPETITOR_INSIGHT',
        'METHODOLOGY',
        'CASE_STUDY'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Shared Team Knowledge Items (Agent Optimized)
CREATE TABLE IF NOT EXISTS knowledge_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    keywords TEXT[] NOT NULL,
    category knowledge_category NOT NULL,
    content TEXT NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    source TEXT,
    created_by UUID REFERENCES users(id),
    embedding vector(768) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS knowledge_items_embedding_idx ON knowledge_items USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS knowledge_items_category_team_idx ON knowledge_items (category, team_id);

-- Full-text search index
ALTER TABLE knowledge_items ADD COLUMN IF NOT EXISTS ts_content tsvector
    GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || summary || ' ' || content)) STORED;
CREATE INDEX IF NOT EXISTS knowledge_items_fts_idx ON knowledge_items USING GIN (ts_content);

-- Token Usage Log
CREATE TABLE IF NOT EXISTS token_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    model_name TEXT NOT NULL,
    input_tokens INT NOT NULL,
    output_tokens INT NOT NULL,
    cost_usd NUMERIC(10, 6) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);
