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

  // 대표 운동 종목을 선택하는 함수
  const selectType = (type: string) => {
    setSelectedType(type);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {/* 대표 운동 종목 리스트 */}
        <ul className='mainWorkoutList'>
          {main.map((type) => (
            <li key={type} onClick={() => selectType(type)}>
              {type}
            </li>
          ))}
        </ul>

        {/* 선택된 대표 운동 종목의 하위 운동 목록 */}
        {selectedType && (
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
                      weight: 0,
                      reps: 0,
                    })
                  }
                >
                  {item.name}
                </li>
              ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default WorkoutListComponent;
