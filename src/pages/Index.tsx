import { useState, useCallback } from "react";
import { Dumbbell, BarChart3 } from "lucide-react";
import { getWorkouts, saveWorkouts, addProgressEntry, logTrainingDay, Exercise, WorkoutDay } from "@/lib/storage";
import { ExerciseCard } from "@/components/ExerciseCard";
import { AddExerciseForm } from "@/components/AddExerciseForm";
import { ProgressView } from "@/components/ProgressView";
import { useToast } from "@/hooks/use-toast";

type View = "workouts" | "progress";

const Index = () => {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>(getWorkouts);
  const [activeDay, setActiveDay] = useState(workouts[0]?.id || "a");
  const [view, setView] = useState<View>("workouts");
  const [progressKey, setProgressKey] = useState(0);
  const { toast } = useToast();

  const update = useCallback((newWorkouts: WorkoutDay[]) => {
    setWorkouts(newWorkouts);
    saveWorkouts(newWorkouts);
  }, []);

  const currentDay = workouts.find((w) => w.id === activeDay);

  const handleAddExercise = (exercise: Exercise) => {
    const newWorkouts = workouts.map((w) =>
      w.id === activeDay ? { ...w, exercises: [...w.exercises, exercise] } : w
    );
    update(newWorkouts);
    toast({ title: "Exercício adicionado!", description: exercise.name });
  };

  const handleUpdateExercise = (exercise: Exercise) => {
    const newWorkouts = workouts.map((w) =>
      w.id === activeDay
        ? { ...w, exercises: w.exercises.map((e) => (e.id === exercise.id ? exercise : e)) }
        : w
    );
    update(newWorkouts);
  };

  const handleDeleteExercise = (id: string) => {
    const newWorkouts = workouts.map((w) =>
      w.id === activeDay ? { ...w, exercises: w.exercises.filter((e) => e.id !== id) } : w
    );
    update(newWorkouts);
    toast({ title: "Exercício removido" });
  };

  const handleLogExercise = (exercise: Exercise) => {
    const today = new Date().toISOString().split("T")[0];
    addProgressEntry({
      date: today,
      exerciseName: exercise.name,
      weight: exercise.weight,
      sets: exercise.sets,
      reps: exercise.reps,
    });
    logTrainingDay(today);
    setProgressKey((k) => k + 1);
    toast({
      title: "Treino registrado! 💪",
      description: `${exercise.name} - ${exercise.weight}kg`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-primary" size={24} />
            <h1 className="text-xl font-bold text-foreground">GymTracker</h1>
          </div>
        </div>
      </header>

      {/* View Toggle */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex bg-card border border-border rounded-lg p-1 mb-4">
          <button
            onClick={() => setView("workouts")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              view === "workouts"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Dumbbell size={16} /> Treinos
          </button>
          <button
            onClick={() => setView("progress")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
              view === "progress"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 size={16} /> Progresso
          </button>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4">
        {view === "workouts" ? (
          <>
            {/* Day Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
              {workouts.map((day) => (
                <button
                  key={day.id}
                  onClick={() => setActiveDay(day.id)}
                  className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeDay === day.id
                      ? "bg-primary text-primary-foreground glow-primary"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            {/* Exercise List */}
            <div className="space-y-3 mb-4">
              {currentDay?.exercises.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <Dumbbell className="mx-auto mb-3 text-muted-foreground" size={36} />
                  <p className="text-muted-foreground">Nenhum exercício cadastrado.</p>
                  <p className="text-sm text-muted-foreground mt-1">Adicione seu primeiro exercício abaixo!</p>
                </div>
              )}
              {currentDay?.exercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onUpdate={handleUpdateExercise}
                  onDelete={handleDeleteExercise}
                  onLog={handleLogExercise}
                />
              ))}
            </div>

            <AddExerciseForm onAdd={handleAddExercise} />
          </>
        ) : (
          <ProgressView key={progressKey} />
        )}
      </main>
    </div>
  );
};

export default Index;
