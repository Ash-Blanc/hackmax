# SCHEMA.md — Database Architecture & Data Models

## 1. Supabase PostgreSQL Tables & Relationships

```sql
-- Profiles / Users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  github_username TEXT,
  target_goal TEXT, -- e.g. "win_more", "ship_faster", "all_of_above"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hackathons
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  tagline TEXT,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  status TEXT DEFAULT 'active', -- 'upcoming', 'active', 'submitted', 'ended'
  prize_pool TEXT,
  max_score INT DEFAULT 50, -- 0-100 calculated
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hackathon Judging Criteria
CREATE TABLE hackathon_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g. "Innovation", "Technical Execution", "Impact"
  weight FLOAT DEFAULT 1.0,
  score FLOAT DEFAULT 0.0, -- AI estimated score 0-10
  confidence FLOAT DEFAULT 0.85, -- 0-1.0
  explanation TEXT,
  recommended_fix TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  tech_stack TEXT[],
  capabilities TEXT[], -- e.g. ["RAG", "Agents", "Computer Vision"]
  reusable_components TEXT[], -- e.g. ["Auth", "Dashboard", "UI System"]
  repository_name TEXT,
  repository_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project <-> Hackathon association
CREATE TABLE project_hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT true,
  UNIQUE(project_id, hackathon_id)
);

-- Tasks / Max Plan Execution Items
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  stage TEXT DEFAULT 'NOW', -- 'NOW', 'NEXT', 'LATER', 'SUBMISSION'
  priority TEXT DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  estimated_minutes INT DEFAULT 45,
  impact_level TEXT DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
  status TEXT DEFAULT 'todo', -- 'todo', 'in_progress', 'done', 'cut'
  github_issue_url TEXT,
  related_criterion_id UUID REFERENCES hackathon_criteria(id) ON DELETE SET NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submission Checklist
CREATE TABLE submission_checklist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL, -- 'working_demo', 'github_repo', 'readme', 'demo_video', 'pitch_deck', 'deployed_url'
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  value TEXT, -- link or notes
  required BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GitHub Telemetry Cache
CREATE TABLE github_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'commit', 'pr_opened', 'pr_merged', 'issue_closed'
  title TEXT NOT NULL,
  author TEXT,
  url TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Judge Simulation Reviews
CREATE TABLE judge_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  persona TEXT NOT NULL, -- 'overall', 'technical', 'product', 'design'
  overall_score FLOAT NOT NULL,
  summary TEXT,
  biggest_weakness TEXT,
  recommended_fix TEXT,
  criteria_scores JSONB, -- { "innovation": 8.5, "technical": 7.8, ... }
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. Row Level Security (RLS) Principle
All tables have `ENABLE ROW LEVEL SECURITY`. Every policy verifies:
`auth.uid() = user_id` (or cascaded through `hackathon_id` / `project_id`).

## 3. Seed / Demo Mode Blueprint
Provide a built-in mock state provider (`src/lib/mock-data.ts`) loaded automatically whenever:
- User toggles "Demo Mode" or
- Supabase credentials (`VITE_SUPABASE_URL`) are not provided.
Key Seed Data:
- **Hackathon**: `Autonomous Agents Hackathon` (Ending in 19h 42m, Max Score: 74/100)
- **Project**: `Agentic Researcher` (Stack: React, TypeScript, FastAPI, Anthropic SDK)
- **Active Task**: `Finish core agent workflow` (Est: 1h 20m, Impact: HIGH)
- **Judge Review**: Simulated 4-persona feedback with instant remediation recommendations.
