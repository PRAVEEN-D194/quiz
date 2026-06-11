import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
export default function Point(){

    const location = useLocation();
    const point = location.state.point;

    const navigate = useNavigate();
    const close = ()=>{
        navigate(-1);
    }


    return(
        <div className="overlay">
        <div className="point-container">
            <button className="close-bttn" onClick={close}>X</button>
            <h1>Your Point 🪙{point}</h1>
            <p className="point-description">🪙Earn 1 point for every correct answer.</p>
            <p className="point-description">🪙Get an extra 10 bonus points only if you answer all questions correctly in a quiz that contains more than 10 questions.</p>
            <p className="point-description">🪙Points are used to determine your position on the Leaderboard.</p>
            <p className="point-description">🪙Points can only be earned in Timer Mode quizzes.</p>
            <p className="point-description">🪙Normal quizzes (without a timer) do not award any points.</p>
            {/* <p className="point-description">🪙Challenge yourself in Timer Mode to earn more points and climb the leaderboard!</p> */}
        </div>
        </div>
    )
}