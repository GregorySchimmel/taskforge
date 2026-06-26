"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskDifficulty, TaskType } from "@/types";

export interface SuggestedTask {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  type: TaskType;
  difficulty: TaskDifficulty;
  estimatedHours: number;
  bounty: number;
  techTags: string[];
}

/*
 * PRODUCTION: Wire to LLM API (Claude, Grok, OpenAI)
 *
 * Example prompt:
 * "Given this project: {title} - {description} with tech stack {techStack},
 *  suggest 5-8 small, well-defined development tasks a junior dev could complete.
 *  Return JSON array with: title, description, acceptanceCriteria (array),
 *  type (frontend|backend|...), difficulty (easy|medium|hard),
 *  estimatedHours, suggestedBounty, techTags."
 *
 * const response = await fetch('/api/suggest-tasks', {
 *   method: 'POST',
 *   body: JSON.stringify({ projectTitle, projectDescription, techStack }),
 * });
 */

const MOCK_SUGGESTIONS: SuggestedTask[] = [
  {
    title: "Set up project scaffolding",
    description: "Initialize the project structure with linting, formatting, and basic CI config.",
    acceptanceCriteria: ["Project builds successfully", "Lint passes", "README with setup instructions"],
    type: "devops",
    difficulty: "easy",
    estimatedHours: 3,
    bounty: 50,
    techTags: ["CI/CD", "Setup"],
  },
  {
    title: "Build core data models",
    description: "Define database schemas and API models for the main entities.",
    acceptanceCriteria: ["Models defined with validation", "Migration scripts included", "Unit tests for models"],
    type: "backend",
    difficulty: "medium",
    estimatedHours: 6,
    bounty: 100,
    techTags: ["Database", "API"],
  },
  {
    title: "Create landing page UI",
    description: "Design and implement the main landing page with hero, features, and CTA sections.",
    acceptanceCriteria: ["Responsive design", "Matches brand colors", "Accessible markup"],
    type: "frontend",
    difficulty: "medium",
    estimatedHours: 5,
    bounty: 80,
    techTags: ["React", "CSS"],
  },
  {
    title: "Implement user authentication",
    description: "Add sign up, login, and session management with protected routes.",
    acceptanceCriteria: ["Sign up and login work", "Sessions persist", "Protected routes enforced"],
    type: "fullstack",
    difficulty: "hard",
    estimatedHours: 8,
    bounty: 150,
    techTags: ["Auth", "Security"],
  },
  {
    title: "Write API documentation",
    description: "Document all API endpoints with examples and error codes.",
    acceptanceCriteria: ["All endpoints documented", "Request/response examples", "Error codes listed"],
    type: "documentation",
    difficulty: "easy",
    estimatedHours: 3,
    bounty: 0,
    techTags: ["Docs", "API"],
  },
  {
    title: "Add unit test coverage",
    description: "Write unit tests for core business logic targeting 80% coverage.",
    acceptanceCriteria: ["80% coverage on core modules", "CI runs tests", "Edge cases covered"],
    type: "testing",
    difficulty: "medium",
    estimatedHours: 5,
    bounty: 70,
    techTags: ["Testing", "Jest"],
  },
];

export function AITaskSuggestions({ onAccept }: { onAccept: (tasks: SuggestedTask[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);

  const generate = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    setSuggestions(MOCK_SUGGESTIONS);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={generate} disabled={loading} className="gap-2">
        <Sparkles className="h-4 w-4" />
        {loading ? "Generating..." : "Suggest task breakdown with AI"}
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">AI suggested {suggestions.length} tasks (mock response):</p>
          {suggestions.map((s, i) => (
            <div key={i} className="rounded-lg border border-border p-3 text-sm">
              <p className="font-medium">{s.title}</p>
              <p className="text-muted-foreground">{s.description}</p>
              <p className="mt-1 text-xs capitalize">{s.type} · {s.difficulty} · {s.estimatedHours}h · ${s.bounty}</p>
            </div>
          ))}
          <Button onClick={() => onAccept(suggestions)} className="w-full">
            Add all suggestions to task list
          </Button>
        </div>
      )}
    </div>
  );
}