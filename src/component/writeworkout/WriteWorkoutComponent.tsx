import React, { useEffect, useState } from 'react';

const WriteWorkoutComponent: React.FC<WriteWorkoutProps> = ({
  workout,
  onRemove,
  onDataChange,
}) => {
  const [sets, setSets] = useState<workoutInfo[]>(workout.sets || []);

  // useEffect(() => {
  //   const newSets = [...sets];
  //   onDataChange(workout.id, workout.type, workout.name, newSets);
  // }, [sets]);
  useEffect(() => {
    onDataChange(workout.id, workout.type, workout.name, sets);
    console.log(sets);
  }, [sets]);

  const incrementWeight = (index: number) => {
    const newSets = [...sets];
    newSets[index].weight += 5;
    setSets(newSets);
    onDataChange(workout.id, workout.type, workout.name, newSets);
  };

  const decrementWeight = (index: number) => {
    const newSets = [...sets];
    if (newSets[index].weight > 0) {
      newSets[index].weight -= 5;
    }
    setSets(newSets);
  };

  const incrementReps = (index: number) => {
    const newSets = [...sets];
    newSets[index].reps += 1;
    setSets(newSets);
  };

  const decrementReps = (index: number) => {
    const newSets = [...sets];
    if (newSets[index].reps > 0) {
      newSets[index].reps -= 1;
    }
    setSets(newSets);
  };

  const addSet = () => {
    const lastSet =
      sets.length > 0 ? sets[sets.length - 1] : { weight: 0, reps: 0 };
    const newSet = [...sets, { ...lastSet }];
    setSets(newSet);
    onDataChange(workout.id, workout.type, workout.name, newSet); // onDataChange 호출 추가
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, setIndex) => setIndex !== index));
  };
  return (
    <div>
      {workout && (
        <div className='workout-card'>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>{workout.name}</label>
            <div>
              <button className='btn-gradient-small green' onClick={addSet}>
                세트 추가
              </button>
              <button
                className='btn-gradient-small red'
                onClick={() => onRemove(workout.id)}
              >
                Remove
              </button>
            </div>
          </div>
          {sets.map((set, index) => (
            <div key={index}>
              <label>Set {index + 1}</label>
              <a className='btn-3d-small red' onClick={() => removeSet(index)}>
                X
              </a>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width:'100%', alignItems:'center' }}>
                  <div style={{width:'50%'}}>
                  <label>Weight:</label>
                  </div>
                  <div style={{width:'50%'}}>
                  <button className='btn-gradient-small red' style={{margin:'0 20px'}} onClick={() => decrementWeight(index)}>-</button>
                  <input
                    type='number'
                    style={{margin:'0 20px'}}
                    value={set.weight}
                    onChange={(e) =>
                      setSets(
                        sets.map((s, i) =>
                          i === index
                            ? { ...s, weight: parseInt(e.target.value) }
                            : s
                        )
                      )
                    }
                  />
                  <button className='btn-gradient-small green' style={{margin:'0 20px'}} onClick={() => incrementWeight(index)}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', width:'100%', alignItems:'center' }}>
                  <div style={{width:'50%'}}>
                  <label>Reps:</label>
                  </div>
                  <div style={{width:'50%'}}>
                  <button className='btn-gradient-small red' style={{margin:'0 20px'}} onClick={() => decrementReps(index)}>-</button>
                  <input
                    type='number'
                    style={{margin:'0 20px'}}
                    value={set.reps}
                    onChange={(e) =>
                      setSets(
                        sets.map((s, i) =>
                          i === index
                            ? { ...s, reps: parseInt(e.target.value) }
                            : s
                        )
                      )
                    }
                  />
                  <button className='btn-gradient-small green' style={{margin:'0 20px'}} onClick={() => incrementReps(index)}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WriteWorkoutComponent;
