import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Answers, Question, ResultProfile } from "./types";

let browserClient: SupabaseClient | null | undefined;

function getBrowserClient() {
  if (browserClient !== undefined) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    browserClient = null;
    return browserClient;
  }

  browserClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return browserClient;
}

export async function saveAnonymousSubmission(input: {
  profile: ResultProfile;
  questions: Question[];
  answers: Answers;
}) {
  const client = getBrowserClient();
  if (!client) throw new Error("Supabase is not configured.");

  const sanitizedAnswers = Object.fromEntries(
    input.questions
      .filter((question) => question.kind !== "text")
      .map((question) => [question.id, input.answers[question.id]])
      .filter(([, value]) => value !== undefined)
  );

  const { error } = await client.from("diagnosis_submissions").insert({
    respondent_type: input.profile.mode,
    answers: sanitizedAnswers,
    motivation_scores: input.profile.motivations,
    need_scores: input.profile.needs,
    teaching_scores: input.profile.teaching,
    pressure_score: input.profile.pressure,
    effort: input.profile.effort ?? null,
    goal_type: input.profile.goal ?? null,
    group_preference: input.profile.group ?? null,
    priority_1: input.profile.priority1 ?? null,
    priority_2: input.profile.priority2 ?? null,
    consent_to_research: true,
    app_version: "beta-0.2.0",
  });

  if (error) throw error;
}
