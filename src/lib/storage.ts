export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface WorkoutDay {
  id: string;
  label: string;
  exercises: Exercise[];
}

export interface ProgressEntry {
  date: string;
  exerciseName: string;
  weight: number;
  sets: number;
  reps: number;
}

export interface TrainingLog {
  date: string; // YYYY-MM-DD
}

const WORKOUTS_KEY = "gym-tracker-workouts";
const PROGRESS_KEY = "gym-tracker-progress";
const LOGS_KEY = "gym-tracker-logs";

const defaultWorkouts: WorkoutDay[] = [
  { id: "a", label: "Treino A", exercises: [] },
  { id: "b", label: "Treino B", exercises: [] },
  { id: "c", label: "Treino C", exercises: [] },
  { id: "d", label: "Treino D", exercises: [] },
  { id: "e", label: "Treino E", exercises: [] },
];

export function getWorkouts(): WorkoutDay[] {
  const data = localStorage.getItem(WORKOUTS_KEY);
  return data ? JSON.parse(data) : defaultWorkouts;
}

export function saveWorkouts(workouts: WorkoutDay[]) {
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
}

export function getProgress(): ProgressEntry[] {
  const data = localStorage.getItem(PROGRESS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveProgress(entries: ProgressEntry[]) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(entries));
}

export function addProgressEntry(entry: ProgressEntry) {
  const entries = getProgress();
  entries.push(entry);
  saveProgress(entries);
}

export function getTrainingLogs(): TrainingLog[] {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function logTrainingDay(date: string) {
  const logs = getTrainingLogs();
  if (!logs.find((l) => l.date === date)) {
    logs.push({ date });
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }
}

export function getStreak(): number {
  const logs = getTrainingLogs().map((l) => l.date).sort().reverse();
  if (logs.length === 0) return 0;
  let streak = 1;
  for (let i = 0; i < logs.length - 1; i++) {
    const curr = new Date(logs[i]);
    const prev = new Date(logs[i + 1]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1) streak++;
    else break;
  }
  return streak;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
