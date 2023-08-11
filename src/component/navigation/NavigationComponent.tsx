import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutDataContext, SelectedWorkoutsContext } from '../../App';

const NavigationComponent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { setWorkoutData } = useContext(WorkoutDataContext);
  const { setSelectedWorkouts } = useContext(SelectedWorkoutsContext);

  const handleHomeClick = () => {
    // console.log()
    if (location.pathname === process.env.PUBLIC_URL + '/results') {
      setWorkoutData({});
      setSelectedWorkouts([]);
    }
    navigate(process.env.PUBLIC_URL + '/');
  };

  return (
    <>
      <nav id='nav2'>
        <a onClick={handleHomeClick} className='btn-3d blue'>
          HOME
        </a>
        <ul></ul>
      </nav>
    </>
  );
};

export default NavigationComponent;
