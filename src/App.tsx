import './App.css';
import WorkoutListComponent from './component/workoutList/WorkoutListComponent';
import React, { createContext, useState } from 'react';
import WriteWorkoutComponent from './component/writeworkout/WriteWorkoutComponent';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ResultComponent from './component/result/ResultComponent';

export const WorkoutDataContext = createContext<
  Record<string, { type: string; name: string; sets: workoutInfo[] }>
>({});

function App() {
  const [selectedWorkouts, setSelectedWorkouts] = useState<Workout[]>([]);
  const [workoutData, setWorkoutData] = useState<
    Record<string, { type: string; name: string; sets: workoutInfo[] }>
  >({});

  const handleSelect = (workout: Workout) => {
    // 이미 선택된 운동 중에서 같은 이름과 타입을 가진 운동이 있는지 확인
    const existingWorkout = selectedWorkouts.find(
      (w) => w.type === workout.type && w.name === workout.name
    );

    // 같은 이름과 타입을 가진 운동이 이미 선택된 운동 중에 없는 경우
    if (!existingWorkout) {
      let sets: workoutInfo[] = [];
      let dataExists = false;

      // 기존에 저장된 운동 데이터를 확인
      Object.values(workoutData).forEach((data) => {
        if (data.type === workout.type && data.name === workout.name) {
          let setsArr = data.sets;
          dataExists = true;

          // 기존에 저장된 운동 데이터가 있는 경우, 그 데이터를 복사
          if (setsArr.length > 0) {
            sets = [
              ...setsArr,
              {
                weight: setsArr[setsArr.length - 1].weight,
                reps: setsArr[setsArr.length - 1].reps,
              },
            ];
          }
          // 기존에 저장된 운동 데이터가 없는 경우, 초기값 설정
          else {
            sets = [{ weight: 0, reps: 0 }];
          }
        }
      });

      // 선택된 운동 목록에 새 운동을 추가
      if (!dataExists) {
        sets = [{ weight: 0, reps: 0 }];
      }

      setSelectedWorkouts([...selectedWorkouts, { ...workout, sets: sets }]);
    }
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
    // weight: number,
    // reps: number
    sets: workoutInfo[]
  ) => {
    setWorkoutData({
      ...workoutData,
      [id]: { type, name, sets },
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

// TODO 희망 리스트
// 이미지 캡쳐 버튼 -> 바로 앨범에 갈 수 있도록
// 같은 항목 입력할때 이전 3개 정도 무게 최대치 보여주기
