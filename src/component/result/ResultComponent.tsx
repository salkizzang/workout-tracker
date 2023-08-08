import React, { useContext, useState } from 'react';
import { WorkoutDataContext } from '../../App';
import NavigationComponent from '../navigation/NavigationComponent';

const ResultComponent: React.FC = () => {
  const {workoutData} = useContext(WorkoutDataContext);
  const [showNavigation, setShowNavigation] = useState(true);
  let navigationRendered = false; // Track whether NavigationComponent is rendered

  // 운동 유형별로 데이터를 그룹화
  const groupedWorkouts: Record<string, Record<string, workoutInfo[]>> = {};

  for (const key in workoutData) {
    const workout = workoutData[key];
    if (groupedWorkouts[workout.type]) {
      if (groupedWorkouts[workout.type][workout.name]) {
        groupedWorkouts[workout.type][workout.name] = [
          ...groupedWorkouts[workout.type][workout.name],
          ...workout.sets,
        ];
      } else {
        groupedWorkouts[workout.type][workout.name] = workout.sets;
      }
    } else {
      groupedWorkouts[workout.type] = {
        [workout.name]: workout.sets,
      };
    }
  }

  const workoutGroups = Object.entries(groupedWorkouts).map(
    ([type, workouts]) => {
      const workoutNames = Object.keys(workouts).sort();

      return (
        <>
        
        <div className='container' key={type}>
          <div style={{width:'100%'}}>
          <h2>{type}</h2>
          {workoutNames.map((name) => {
            const sets = workouts[name];

            return (
              <div key={name}>
                <h3>{name}</h3>
                {sets.map((set, index) => (
                  <p key={index}>
                    Set {index + 1} - Weight: {set.weight}, Reps: {set.reps}
                  </p>
                ))}
              </div>
            );
          })}
          </div>
        </div>
        </>
      );
    }
  );

  return <div><NavigationComponent/>{workoutGroups}</div>;
};

export default ResultComponent;
