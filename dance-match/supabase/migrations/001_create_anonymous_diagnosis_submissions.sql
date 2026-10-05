create table public.diagnosis_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  respondent_type text not null check (respondent_type in ('student','parent','child')),
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  motivation_scores jsonb not null check (jsonb_typeof(motivation_scores) = 'object'),
  need_scores jsonb not null check (jsonb_typeof(need_scores) = 'object'),
  teaching_scores jsonb not null check (jsonb_typeof(teaching_scores) = 'object'),
  pressure_score numeric(4,2) not null default 0 check (pressure_score >= 0 and pressure_score <= 5),
  effort text null check (effort is null or effort in ('A','B','C','D')),
  goal_type text null check (goal_type is null or goal_type in ('A','B','C','D','E','F','G')),
  group_preference text null check (group_preference is null or group_preference in ('A','B','C','D')),
  priority_1 text null check (priority_1 is null or priority_1 in ('trend','basic','free','body')),
  priority_2 text null check (priority_2 is null or priority_2 in ('trend','basic','free','body')),
  consent_to_research boolean not null check (consent_to_research = true),
  app_version text not null default 'beta-0.1.0',
  user_agent_family text null check (char_length(user_agent_family) <= 40)
);

comment on table public.diagnosis_submissions is
  'Anonymous Dance Match beta responses. No names, school names, email addresses, or free-text answers are stored.';

alter table public.diagnosis_submissions enable row level security;

revoke all on table public.diagnosis_submissions from anon, authenticated;
grant insert on table public.diagnosis_submissions to anon, authenticated;

create policy "anonymous consented submissions can be inserted"
on public.diagnosis_submissions
for insert
to anon, authenticated
with check (
  consent_to_research = true
  and respondent_type in ('student','parent','child')
);

create index diagnosis_submissions_created_at_idx
  on public.diagnosis_submissions (created_at desc);

create index diagnosis_submissions_respondent_type_idx
  on public.diagnosis_submissions (respondent_type);
