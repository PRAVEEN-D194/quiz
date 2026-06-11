import { useState, useEffect } from "react"
import {useNavigate} from "react-router-dom";
import axios from "axios"
import Navbar from "../components/Navbar";
import Searchquiz from "../components/Searchquiz";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_API_URL

export default function Quiz(){

    const navigate = useNavigate();

    const [quiz, setquiz] = useState([]);
    const [toggles, setToggles] = useState({});
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [start, setstart] = useState(false);
    const [timer, settimer] = useState(5)    
    const [search, setsearch] = useState(false);

    const isauth = async()=>{
      try {
        const res = await axios.post(`${url}/isauth`, {}, {withCredentials:true});
        if(res.data.success){
          return
        }
        toast.warn("You need to log in to access the quiz");
        navigate('/login')
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=>{
        isauth()
        const getquiz = async()=>{
            try{
            const res = await axios.get(`${url}/getallquestions`);
            setquiz(res.data.quiz);
            }catch(err){
                console.log(err);
            }
        }
        getquiz();
    },[])

    

    const onsub = (quiz)=>{
        navigate('/play', {state:{
            quiz:quiz, 
           timer:timer,
           timeron:toggles[quiz._id]
        }})
    }

    const onbut = (quiz)=>{
        setSelectedQuiz(quiz)
        setstart(true);
    }

    const handleToggle = (id) => {
    setToggles((prev) => ({
        ...prev,
        [id]: !prev[id]
    }));
};



    return(
        <>
        <Navbar></Navbar>
        {start && (
  <div className="modal-overlay">
    <div className="modal">

        {/* <h2>
      After the quiz starts, please do not leave the page and try to answer all questions.
    </h2>
        <br></br>
    <h3>If you enable the timer, select the time for each question.</h3> */}
      <h2>Quiz Settings</h2>

      <select onChange={(e) => settimer(Number(e.target.value))}>
        <option value={5}>5 Seconds</option>
        <option value={10}>10 Seconds</option>
        <option value={30}>30 Seconds</option>
      </select>

      <div
        className={`toggle ${toggles[selectedQuiz?._id] ? "active" : ""}`}
        onClick={() => handleToggle(selectedQuiz._id)}
      >
        <div className="circle"></div>
      </div>

      <button className="but" onClick={() => onsub(selectedQuiz)}>
        Start
      </button>

      <h3>All The Best 🎉</h3>

      <button
        className="close-btn"
        onClick={() => setstart(false)}
      >
        Close
      </button>
    </div>
  </div>
)}


    {!start && <div>
        {quiz.map((e, index)=>(
    <div className="container" key={index}>
        <div className="card">{e.Title}</div>
        <div className="card">{e.questions.length} No of Questions</div>
        <button className="but" onClick={()=>{onbut(e)}}>start</button>
    </div>
        
    ))}
        </div>}

        </>
    )
}