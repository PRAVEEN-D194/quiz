import axios from "axios";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const url = import.meta.env.VITE_API_URL
import {RotateLoader} from "react-spinners"
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
export default function Createquiz(){

    const[Title, setTitle]=useState("");
    const[noquestion, setnoquestion]=useState(null);
    const [showform, setshowform] = useState(false);
    const [questions, setquestions]=useState([]);
    const [questiontitle, setquestiontitle] = useState("");
    const [dontshow, setdontshow] = useState(true);
    const [current, setcurrent] = useState(0);

    const [loading, setloading]=useState(false);

    const [answers, setAnswers] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);

    const onstart = ()=>{
      if(!Title || !noquestion){
        toast.info("Please fill in all fields.");
        return;
      }
        setshowform(true);
    }

    const onnext = ()=>{

      if(!questiontitle){
         toast.info("Please fill in all fields.");
        return;
      }
        const newQuestion = {
        question: questiontitle,
        answers: [...answers]
        };
        setquestions((prev)=>[...prev,newQuestion])

        if(current >= Number(noquestion) -1){
            setdontshow(false);
            setshowform(false);
            return;
        }
        setcurrent(prev => prev + 1);
        
        setquestiontitle("");

        setAnswers([
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false }
        ]);
}
    
    

    const answerhandler = (index, field, value)=>{
        const newanswer = [...answers];
        newanswer[index][field] =
        field === "isCorrect"
            ? value === "true"
            : value;
        setAnswers(newanswer);
    }

    const navigate = useNavigate()

    const oncreate = async()=>{
        try {
          setloading(true)
            const res = await axios.post(`${url}/api/v1/createquiz`,{ Title, questions});
            if(res.data.success){
            Swal.fire({
              icon: "success",
              title: "Quiz Created Successfully!",
              html: `
                <p>Share this quiz code with your friends:</p>
                <h2>${res.data.quiz.code}</h2>
              `,
            });
            navigate('/');
          }else{
            toast.warn(res.data.message);
          }
        } catch (error) {
            toast.warn(error);
        }finally{setloading(false)}
    }

    return(<>     <Navbar></Navbar>
        <div className="create-quiz-container">
            {loading && (<div className="loader-container"><RotateLoader  color="black"></RotateLoader></div>)}
{!dontshow &&
<div className="create-wrapper">
<div className="createfinal">
<h2 className="form-title">Create Quiz</h2>
<h4>The quiz you create will be automatically deleted after 24 hours.</h4>
<button onClick={oncreate} className="but next-btn" >create</button>
</div>
</div>
}

  {!showform && dontshow && (
    <div className="quiz-page">
  <form className="quiz-card" >

    <div className="quiz-title">
      Create Quiz
    </div>

    <div className="field-group">
      <label htmlFor="quiz-title">Quiz Title</label>
      <input
        id="quiz-title"
        type="text"
        value={Title}
        required
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Quiz Title"
      />
    </div>

    <div className="field-group">
      <label htmlFor="question-count">Number of Questions</label>
      <input
        id="question-count"
        type="number"
        onChange={(e) => setnoquestion(Number(e.target.value))}
        placeholder="Enter Number"
        required
      />
    </div>

    <button
      type="button"
      onClick={onstart}
      className="primary-btn"
    >
      Next
    </button>

  </form>
</div>
  )}

  {showform && dontshow && (
    <div className="quiz-page">
  <form className="quiz-card">

    <div className="quiz-title">
      Question {current + 1}
    </div>

    <div className="field-group">
      <label>Question</label>
      <input
        type="text"
        value={questiontitle}
        onChange={(e) => setquestiontitle(e.target.value)}
        placeholder="Enter Question(required)"
        required
      />
    </div>

    {answers.map((answer, index) => (
      <div className="answer-group" key={index}>

        <div className="field-group">
          <label>Answer {index + 1}</label>

          <input
            type="text"
            value={answer.text}
            onChange={(e) =>
              answerhandler(index, "text", e.target.value)
            }
            placeholder={`Answer ${index + 1}  (required)`}
            required
          />
        </div>

        <div className="field-group">
          <label>Correct</label>

          <select
            value={answer.isCorrect.toString()}
            onChange={(e) =>
              answerhandler(index, "isCorrect", e.target.value)
            }
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

      </div>
    ))}

    <button
      type="button"
      className="primary-btn"
      onClick={onnext}
    >
      Next
    </button>

  </form>
</div>
  )}
  <Footer></Footer>

</div>
</>
 
    )
}