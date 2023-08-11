import { db } from '../../App';

//모든 운동 기록을 갖고오되
//이미 추가된 운동항목일 경우 - 버튼

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from '@firebase/firestore';
import { useEffect, useState } from 'react';
import NavigationComponent from '../navigation/NavigationComponent';

//없는 운동항목일 경우에 + 버튼 보여주게
const ModifyListComponent = () => {
  const [exerciseTypes, setExerciseTypes] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Record<string, any[]>>({});
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [userExercises, setUserExercises] = useState({});

  useEffect(() => {
    selectAllList();
  }, []);

  const selectAllList = async () => {
    const table = collection(db, 'allExercisesList');
    const tableSnapshot = await getDocs(table);
    const typeList: string[] = [];
    const exercisesTable = collection(db, 'exercises');
    const userExerciseQuery = query(
      exercisesTable,
      where('uuid', '==', localStorage.getItem('userId'))
    );
    const userExerciseSnapshot = await getDocs(userExerciseQuery);
    const userExercises = userExerciseSnapshot.docs.map((doc) => doc.data());
    const exerciseList = tableSnapshot.docs.map((doc) => {
      const data = doc.data();
      const isAdded = userExercises.some(
        (userExercise) =>
          userExercise.type === data.type && userExercise.name === data.name
      );
      if (!typeList.includes(data.type)) {
        typeList.push(data.type);
      }
      return {
        id: doc.id,
        type: data.type,
        name: data.name,
        isAdded,
      };
    });

    const groupedExercises = exerciseList.reduce(
      (acc: Record<string, any[]>, curr) => {
        if (!acc[curr.type]) {
          acc[curr.type] = [];
        }
        acc[curr.type].push(curr);

        return acc;
      },
      {}
    );

    setExercises(groupedExercises);
    setExerciseTypes(typeList);
  };

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
  };

  const addExercise = async (exercise: any) => {
    const docData = {
      type: exercise.type,
      name: exercise.name,
      uuid: localStorage.getItem('userId'),
    };

    await addDoc(collection(db, 'exercises'), docData);

    selectAllList();
  };

  const removeExercise = async (exercise: any) => {
    const exercisesTable = collection(db, 'exercises');
    const exerciseQuery = query(
      exercisesTable,
      where('uuid', '==', localStorage.getItem('userId')),
      where('type', '==', exercise.type),
      where('name', '==', exercise.name)
    );
    const exerciseSnapshot = await getDocs(exerciseQuery);
    if (!exerciseSnapshot.empty) {
      const docId = exerciseSnapshot.docs[0].id;
      await deleteDoc(doc(db, 'exercises', docId));
    }
    selectAllList();
  };

  return (
    <>
      <NavigationComponent />
      <div className='container'>
        <div className='leftContainer'>
          <ul className='mainWorkoutList'>
            {exerciseTypes.map((type) => (
              <li
                key={type}
                onClick={() => handleTypeClick(type)}
                style={{
                  display: 'block',
                  marginBottom: '10px',
                  backgroundColor: selectedType === type ? 'green' : '#282c34',
                }}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
        <div className='rightContainer'>
          <ul className='subWorkoutList'>
            {selectedType &&
              exercises[selectedType]?.map((exercise) => (
                // <div
                //   key={exercise.id}
                //   style={{
                //     display: 'flex',
                //     alignItems: 'center',
                //     marginBottom: '10px',
                //   }}
                // >
                <div style={{ display: 'flex' }}>
                  <li style={{ marginLeft: '10px' }}>{exercise.name}</li>{' '}
                  <button
                    className={
                      exercise.isAdded
                        ? 'btn-gradient red'
                        : 'btn-gradient green'
                    }
                    onClick={() =>
                      exercise.isAdded
                        ? removeExercise(exercise)
                        : addExercise(exercise)
                    }
                  >
                    {exercise.isAdded ? '삭제' : '추가'}
                  </button>
                </div>
              ))}
          </ul>
        </div>
      </div>
      {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
    <div style={{ flex: 1, marginRight: "10px" }}>
      {exerciseTypes.map((type) => (
        <button key={type} onClick={() => handleTypeClick(type)} style={{ display: "block", marginBottom: "10px", backgroundColor: selectedType === type ? 'yellow' : 'white' }}>{type}</button>
      ))}
    </div>
    <div>
    {selectedType && exercises[selectedType]?.map((exercise) => (
      <div key={exercise.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
     
        <div style={{ marginLeft: "10px" }}>{exercise.name}</div>   <button onClick={() => exercise.isAdded ? removeExercise(exercise) : addExercise(exercise)}>
          {exercise.isAdded ? '-' : '+'}
        </button>
      </div>
    ))} */}

      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default ModifyListComponent;
