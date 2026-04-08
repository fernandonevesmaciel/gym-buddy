import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateId, Exercise } from "@/lib/storage";

interface Props {
  onAdd: (exercise: Exercise) => void;
}

export function AddExerciseForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(12);
  const [weight, setWeight] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ id: generateId(), name: name.trim(), sets, reps, weight });
    setName("");
    setSets(3);
    setReps(12);
    setWeight(0);
    setOpen(false);
  };

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        className="w-full h-12 text-base glow-primary"
      >
        <Plus size={20} className="mr-2" /> Adicionar Exercício
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-4 space-y-3">
      <Input
        placeholder="Nome do exercício (ex: Supino Reto)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-muted h-12 text-base"
        autoFocus
      />
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Séries</label>
          <Input type="number" value={sets} onChange={(e) => setSets(+e.target.value)} className="bg-muted" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Reps</label>
          <Input type="number" value={reps} onChange={(e) => setReps(+e.target.value)} className="bg-muted" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Peso (kg)</label>
          <Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value)} className="bg-muted" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 h-11">
          <Plus size={16} className="mr-1" /> Adicionar
        </Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11">
          Cancelar
        </Button>
      </div>
    </form>
  );
}
