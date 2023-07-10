import React, { useContext } from 'react';
import { WorkoutDataContext } from 'App';

type WorkoutData = {
  type: string;
  name: string;
  weight: number;
  reps: number;
};

const ResultComponent: React.FC = () => {
  const workoutData: Record<string, WorkoutData> =
    useContext(WorkoutDataContext);

  // 키별로 데이터를 정렬하고, 같은 타입의 운동을 그룹화합니다.
  const groupedWorkouts: Record<string, WorkoutData[]> = {};

  for (const key in workoutData) {
    const workout = workoutData[key];
    if (groupedWorkouts[workout.type]) {
      groupedWorkouts[workout.type].push(workout);
    } else {
      groupedWorkouts[workout.type] = [workout];
    }
  }

  const workoutGroups = Object.entries(groupedWorkouts).map(
    ([type, workouts]) => {
      // 각 그룹 내에서 이름(name)으로 운동을 정렬합니다.
      workouts.sort((a, b) => a.name.localeCompare(b.name));

      return (
        <div className='result' key={type}>
          <h2>{type}</h2>
          {workouts.map((workout, index) => (
            <p key={index}>
              {workout.name} - Weight: {workout.weight}, Reps: {workout.reps}
            </p>
          ))}
        </div>
      );
    }
  );

  return <div>{workoutGroups}</div>;
};

export default ResultComponent;
