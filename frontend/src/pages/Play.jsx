    import { useState,useRef, useEffect } from "react";
    import { useLocation } from "react-router-dom";
    import { useNavigate } from "react-router-dom";
    import Score from '../components/Score';
    import Confetti from "react-confetti";



    export default function Play() {
    const location = useLocation();
    const quiz = location.state.quiz;
    const timer = location.state.timer;
    const timeron = location.state.timeron;


    const questions = quiz.questions;
    const [current, setcurrent] = useState(0);
    const [score, setscore] = useState(0);
    const [selected, setselected] = useState(null); 
    const [showans, setshowans] = useState(false);
    const [showscore, setshowscore] = useState(false);
    const [emoji, setemoji] = useState("")
    const [shuffl, setshuffl] = useState([])
    
    const audioRef = useRef(null);
    const [time, setTime] = useState(Number(timer)); 

    const progress =
    ((current) / Number(questions.length-1)) * 100;

    const navigate = useNavigate();
    const onhandler = (ans)=>{
            setselected(ans);
            setshowans(true);
            setemoji(ans.isCorrect ? "😄" : "😢");
            if(ans.isCorrect){
                setscore(prev => prev + 1);
            }
    }

    const shufflearr = (arr)=>{
      return [...arr].sort(()=>Math.random() - 0.5);
    }


    useEffect(() => {
      if (!timer || !timeron || showscore) {
        const s = shufflearr(questions?.[current]?.answers);
        setshuffl(s);
        return;
      }

      const interval = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            audioRef.current?.pause();
            if (current >= questions.length - 1) {
              clearInterval(interval);
              onnext();
              //setshowscore(true);
              return 0;
            }
            onnext();
            // setcurrent((prevCurrent) => prevCurrent + 1);
            // setshowans(false)
            // setselected(null);
            return Number(timer); // change to 10 later
          }
          if(prev<=3){
              audioRef.current?.play();

              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.playbackRate = 2;
              }
            }

          return prev - 1;
        });
      }, 1000);
      const s = shufflearr(questions?.[current]?.answers)
      setshuffl(s);
      return () => clearInterval(interval);
    }, [current]);
    
    

    const onnext = ()=>{
      setselected(null)
      setshowans(false)
      audioRef.current?.pause();
      setemoji("")
      
            if(current >= questions.length - 1){
              const total = questions.length;
              const code = quiz.code;
                navigate("/score", {state:{
                  timeron:timeron,
                  score:score,
                  total:total,
                  code:code,
                }});
                return;
            }
            setcurrent(prev => prev + 1);
            setselected(null);
            setTime(Number(timer));
    }

    
    
       return (
  <>
        <div>
          <h2 className="Title">{quiz?.Title}</h2>
        </div>
        <div>
      <audio ref={audioRef} src="/beep.mp3.wav" /></div>

        <div id="quizcontainer">

  {timeron && (
    <div className="timer-box">
      {timeron? `⏰: ${time}s` : ""}
    </div>
  )}
  {emoji && <div className="emoji-fall">{emoji}</div>}

  <div id="progress-container">
    <div
      id="progress-bar"
      style={{ width: `${progress}%` }}
    ></div>

    <div
      id="rocket"
      style={{ left: `${progress}%` }}
    >
      🚀
    </div>
  </div>

  <h1 id="question">
    {questions?.[current]?.question}
  </h1>

  <div className="answers">
    {shuffl.map((ans, i) => (
      <button
        key={i}
        onClick={() => onhandler(ans)}
        disabled={selected !== null}
        className={ `${showans && ans.isCorrect ? "correct-but" : "" }
          ${showans && !ans.isCorrect? "wrong-but" : "" }`}
      >
        {ans.text}
      </button>
  
    ))}
  </div>
    
  <button className="but next-but" onClick={onnext} disabled={!selected}>
    Next
  </button>
</div>
      </>
 
);}