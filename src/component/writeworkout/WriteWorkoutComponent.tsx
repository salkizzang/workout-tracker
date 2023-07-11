import React, { useEffect, useState } from 'react';

const WriteWorkoutComponent: React.FC<WriteWorkoutProps> = ({
  workout,
  onRemove,
  onDataChange,
}) => {
  const [weight, setWeight] = useState(workout.weight);
  const [reps, setReps] = useState(workout.reps);

  useEffect(() => {
    onDataChange(workout.id, workout.type, workout.name, weight, reps);
  }, [weight, reps]);

  const incrementWeight = () => {
    setWeight(weight + 5);
  };

  const decrementWeight = () => {
    if (weight > 0) {
      setWeight(weight - 5);
    }
  };

  const incrementReps = () => {
    setReps(reps + 1);
  };

  const decrementRpes = () => {
    if (reps > 0) {
      setReps(reps - 1);
    }
  };

  //세트 추가 버튼이 있는게 나을지도??

  return (
    <div>
      {workout && (
        <div className='writeWorkoutContainer'>
          <div className='flex-row'>
            <label>{workout.name}</label>
            {/* <button>세트 추가</button> */}
          </div>
          <div className='flex-row'>
            <label>Weight:</label>
            <button onClick={decrementWeight}>-</button>
            <input
              type='number'
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
            />
            <button onClick={incrementWeight}>+</button>
            <label>Reps:</label>
            <button onClick={decrementRpes}>-</button>
            <input
              type='number'
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value))}
            />
            <button onClick={incrementReps}>+</button>

            <button onClick={() => onRemove(workout.id)}>Remove</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default WriteWorkoutComponent;
