import './App.css';
import WorkoutListComponent from './component/workoutList/WorkoutListComponent';
import React, { createContext, useState } from 'react';
import WriteWorkoutComponent from './component/writeworkout/WriteWorkoutComponent';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ResultComponent from './component/result/ResultComponent';

export const WorkoutDataContext = createContext<
  Record<string, { type: string; name: string; weight: number; reps: number }>
>({});

function App() {
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [workoutData, setWorkoutData] = useState<
    Record<string, { type: string; name: string; weight: number; reps: number }>
  >({});

  const handleSelect = (workout: Workout) => {
    let lastWeight = 0;
    let lastReps = 0;
    Object.values(workoutData).forEach((data) => {
      if (data.type === workout.type && data.name === workout.name) {
        lastWeight = data.weight;
        lastReps = data.reps;
      }
    });
    setSelectedWorkouts([
      ...selectedWorkouts,
      { ...workout, weight: lastWeight, reps: lastReps },
    ]);
  };

  const handleRemove = (id: string) => {
    setSelectedWorkouts(
      selectedWorkouts.filter((workout) => workout.id !== id)
    );

    setWorkoutData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[id];
      return updatedData;
    });
  };

  const handleWorkoutDataChange = (
    id: string,
    type: string,
    name: string,
    weight: number,
    reps: number
  ) => {
    setWorkoutData({
      ...workoutData,
      [id]: { type, name, weight, reps },
    });
  };

  return (
    <Router>
      <WorkoutDataContext.Provider value={workoutData}>
        <div className='App'>
          <header className='App-header'>
            <Routes>
              <Route
                path={process.env.PUBLIC_URL + '/'}
                element={
                  <>
                    <WorkoutListComponent onSelect={handleSelect} />
                    {selectedWorkouts.map((workout) => (
                      <WriteWorkoutComponent
                        key={workout.id}
                        workout={workout}
                        onRemove={handleRemove}
                        onDataChange={handleWorkoutDataChange}
                      />
                    ))}
                    {selectedWorkouts.length > 0 && (
                      <Link to={process.env.PUBLIC_URL + '/results'}>
                        <button>운동완료</button>
                      </Link>
                    )}
                  </>
                }
              ></Route>
              <Route
                path={process.env.PUBLIC_URL + '/results'}
                element={<ResultComponent />}
              />
            </Routes>
          </header>
        </div>
      </WorkoutDataContext.Provider>
    </Router>
  );
}

export default App;
