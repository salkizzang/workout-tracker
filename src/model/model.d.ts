interface Workout {
  id: string;
  type: string;
  name: string;
  // reps: number;
  // weight: number;
  sets: workoutInfo[];
}
interface workoutInfo {
  reps: number;
  weight: number;
}
interface WorkoutListProps {
  onSelect: (workout: Workout) => void;
}

interface WriteWorkoutProps {
  workout: Workout;
  onRemove: (id: string) => void;
  onDataChange: (
    id: string,
    type: string,
    name: string,
    // weight: number,
    // reps: number
    sets: workoutInfo[]
  ) => void;
}
