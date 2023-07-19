import './App.css';
import WorkoutListComponent from './component/workoutList/WorkoutListComponent';
import React, { createContext, useEffect, useState } from 'react';
import WriteWorkoutComponent from './component/writeworkout/WriteWorkoutComponent';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ResultComponent from './component/result/ResultComponent';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import ModifyListComponent from './component/modifyList/ModifyListComponent';

export const WorkoutDataContext = createContext<
  Record<string, { type: string; name: string; sets: workoutInfo[] }>
>({});

const firebaseConfig = {
  apiKey: 'AIzaSyCxQVWU6W14zIDnuyeUqYib4wXWTW2WIvU',
  authDomain: 'workout-tracker-70dd6.firebaseapp.com',
  projectId: 'workout-tracker-70dd6',
  storageBucket: 'workout-tracker-70dd6.appspot.com',
  messagingSenderId: '960715236833',
  appId: '1:960715236833:web:eb89b0400a2d3ceca61ea0',
  measurementId: 'G-RLD80CHRZC',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

const initExercisesList = [
  {name:"풀업", type:"등", part:"등"},
  {name:"랫풀다운", type:"등", part:"등"},
  {name:"벤치 프레스", type:"가슴", part:"가슴"},
  {name:"인클라인 벤치 프레스", type:"가슴", part:"가슴"},
]

function App() {
  const getExercises = async () => {
    const exercisesCol = collection(db, 'exercises');
    const exerciseSnapshot = await getDocs(exercisesCol);
    const exerciseList : any[] = [];
    let userId = localStorage.getItem('userId');
    if(userId){
    exerciseSnapshot.docs.map((doc) => {
      let tmpData = doc.data();
      if(userId===tmpData?.uuid){
        exerciseList.push(tmpData);  
      }
    });
    }
  };

  const initExercises = async () => {
    let userId = localStorage.getItem('userId');
    if(userId){
      for (let exercise of initExercisesList) {
        // Firestore에서 해당 운동 데이터를 찾습니다.
        const querySnapshot = await getDocs(query(
          collection(db, 'exercises'),
          where('name', '==', exercise.name),
          where('type', '==', exercise.type),
          where('part', '==', exercise.part),
          where('uuid', '==', userId)
        ));
        // 해당 운동 데이터가 Firestore에 존재하지 않으면 추가합니다.
        if (querySnapshot.empty) {
          const newExerciseRef = doc(collection(db, 'exercises'));
          await setDoc(newExerciseRef, { ...exercise, uuid: userId });
        }
      }
    }
  }
  useEffect(() => {
    const initUser = async () => {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = uuidv4();
        localStorage.setItem('userId', userId);
      }
      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, { uuid: userId });
        //커스텀 운동 목록 초기 데이터 등록
        initExercises();
      }else{
        //개인별 커스텀 운동 목록 갖고오기
        getExercises();
      }
    };
    initUser();
  }, []);

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
                  <Link to={process.env.PUBLIC_URL + '/record'}>
                  <button>운동 기록</button>
                  </Link>
                  <Link to={process.env.PUBLIC_URL + '/modify'}>
                  <button>목록 수정</button>
                  </Link>
                  </>
                }
              />
              <Route
                path={process.env.PUBLIC_URL + '/record'}
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
              <Route
                path={process.env.PUBLIC_URL + '/modify'}
                element={<ModifyListComponent/>}
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


