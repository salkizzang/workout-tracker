import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutDataContext, SelectedWorkoutsContext } from '../../App';

const NavigationComponent : React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate(); 
    
    const { setWorkoutData } = useContext(WorkoutDataContext);
    const { setSelectedWorkouts } = useContext(SelectedWorkoutsContext);

  

    const handleHomeClick = () => {
        // console.log()
        if(location.pathname===process.env.PUBLIC_URL+'/results'){
            setWorkoutData({});
            setSelectedWorkouts([]);
        }
        navigate(process.env.PUBLIC_URL + '/');
      }

    return (
      <>
      <nav id="nav2">
      <a href="#"> <button 
        onClick={handleHomeClick}
        style={{
          padding: "10px 20px",
          background: "#f8f8f8",
          color: "#333",
          borderRadius: "5px",
          textDecoration: "none",
          fontSize: "14px",
          border: "1px solid #ddd"
        }}>
          홈
        </button></a>
      <ul>
      </ul>
    </nav>
      </>
    );
};

export default NavigationComponent;
