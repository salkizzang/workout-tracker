import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const WorkoutListComponent: React.FC<WorkoutListProps> = ({ onSelect }) => {
  const main = ['가슴', '등'];
  const sub = [
    {
      type: '가슴',
      name: '벤치프레스',
    },
    {
      type: '가슴',
      name: '덤벨 플랫 벤치 프레스',
    },
    {
      type: '등',
      name: '랫풀다운',
    },
    {
      type: '등',
      name: '풀업',
    },
  ];

  // 현재 선택된 대표 운동 종목을 추적하는 state
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // 대표 운동 종목 리스트와 하위 운동 목록 중 어떤 것이 보여질지 추적하는 state
  const [isMainVisible, setIsMainVisible] = useState<boolean>(true);

  // 대표 운동 종목을 선택하는 함수
  const selectType = (type: string) => {
    setSelectedType(type);
    setIsMainVisible(false);
  };

  const goBack = () => {
    setIsMainVisible(true);
  };

  return (
    <>
      {isMainVisible ? (
        <ul className='mainWorkoutList'>
          {main.map((type) => (
            <li key={type} onClick={() => selectType(type)}>
              {type}
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <button className='goBackButton' onClick={goBack}>
            <span>←</span>
          </button>
          <ul className='subWorkoutList'>
            {sub
              .filter((item) => item.type === selectedType)
              .map((item, index) => (
                <li
                  key={index}
                  onClick={() =>
                    onSelect({
                      ...item,
                      id: uuidv4(),
                      sets: [{ weight: 0, reps: 0 }],
                    })
                  }
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default WorkoutListComponent;
