import React, { useEffect, useState } from 'react';

const WriteWorkoutComponent: React.FC<WriteWorkoutProps> = ({
  workout,
  onRemove,
  onDataChange,
}) => {
  const [sets, setSets] = useState<workoutInfo[]>(workout.sets || []);

  useEffect(() => {
    onDataChange(workout.id, workout.type, workout.name, sets);
  }, [sets]);

  const incrementWeight = (index: number) => {
    const newSets = [...sets];
    newSets[index].weight += 5;
    setSets(newSets);
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
    setSets([...sets, { ...lastSet }]);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, setIndex) => setIndex !== index));
  };

  return (
    <div>
      {workout && (
        <div className='writeWorkoutContainer'>
          <div className='flex-row'>
            <label>{workout.name}</label>
            <button onClick={addSet}>세트 추가</button>
          </div>
          {sets.map((set, index) => (
            <div key={index} className='flex-row'>
              <label>Set {index + 1}:</label>
              <label>Weight:</label>
              <button onClick={() => decrementWeight(index)}>-</button>
              <input
                type='number'
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
              <button onClick={() => incrementWeight(index)}>+</button>
              <label>Reps:</label>
              <button onClick={() => decrementReps(index)}>-</button>
              <input
                type='number'
                value={set.reps}
                onChange={(e) =>
                  setSets(
                    sets.map((s, i) =>
                      i === index ? { ...s, reps: parseInt(e.target.value) } : s
                    )
                  )
                }
              />
              <button onClick={() => incrementReps(index)}>+</button>
              <button onClick={() => removeSet(index)}>X</button>
            </div>
          ))}
          <button onClick={() => onRemove(workout.id)}>Remove</button>
        </div>
      )}
    </div>
  );
};

export default WriteWorkoutComponent;
