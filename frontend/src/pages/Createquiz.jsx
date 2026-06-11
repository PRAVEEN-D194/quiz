import axios from "axios";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
const url = import.meta.env.VITE_API_URL

export default function Createquiz(){

    const[Title, setTitle]=useState("");
    const[noquestion, setnoquestion]=useState(null);
    const [showform, setshowform] = useState(false);
    const [questions, setquestions]=useState([]);
    const [questiontitle, setquestiontitle] = useState("");
    const [dontshow, setdontshow] = useState(true);
    const [current, setcurrent] = useState(0);
    const [answers, setAnswers] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]);

    const onstart = ()=>{
        setshowform(true);
    }

    const onnext = ()=>{

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
            const res = await axios.post(`${url}/createquiz`,{ Title, questions});
            Swal.fire({
              icon: "success",
              title: "Quiz Created Successfully!",
              html: `
                <p>Share this quiz code with your friends:</p>
                <h2>${res.data.quiz.code}</h2>
              `,
            });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div className="create-quiz-container">
{!dontshow &&
<div className="create-wrapper">
<div className="createfinal">
<h2 className="form-title">Create Quiz</h2>
<button onClick={oncreate} className="but next-btn" >create</button>
</div>
</div>
}


  {!showform && dontshow && (
    <div className="quiz-page">
  <form className="quiz-card" onSubmit={onstart}>

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
      type="submit"
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
        placeholder="Enter Question"
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
            placeholder={`Answer ${index + 1}`}
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

</div>
    )
}