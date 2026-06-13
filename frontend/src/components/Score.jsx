
import { useLocation } from "react-router-dom";
import { useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_API_URL
import {
  WhatsappShareButton,
  TwitterShareButton,
  FacebookShareButton
} from "react-share";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Score(){


const location = useLocation();
const score = location.state?.score || 0;
const total = location.state?.total || 0;
const code = location.state?.code || 0;
const timeron = location.state?.timeron || null;

let point = score;

if(total === score && total >= 10){
  point=point+10;
}



  const [darkMode, setDarkMode] = useState( localStorage.getItem("dark") === "true");
    

    useEffect(() => {
        localStorage.setItem("dark", darkMode);

        if (darkMode) {
          document.body.classList.add("dark");
        } else {
          document.body.classList.remove("dark");
        }
      }, [darkMode]);
    const toggleTheme = () => {
      setDarkMode(!darkMode);
    };

const changescore = async()=>{
  try {
        const res = await axios.put(`${url}/api/v1/updatepoint`, {point:point}, {withCredentials:true});
        if(res.data.success){
          toast.success("Socre added successfully")
        }else{
          toast.warn(re.data.message)
        }
  } catch (error) {
    console.log(error.message)
    
  }
}


useEffect(()=>{
  if(timeron){
  changescore();
  }
},[])
const navigate = useNavigate();

const onhandler = ()=>{
    navigate('/');
}
const again = ()=>{
    navigate(-1);
}
    return(
      <div className="create-wrapper">
        <div id="quizcontainer">
        <div>
          <Confetti 
          // numberOfPieces={500}   // more pieces = faster/bigger burst
          // gravity={0.4}          // higher = falls faster
          // initialVelocityY={30}  // start speed (important for fast burst)

          numberOfPieces={2000}
          gravity={0.6}
          initialVelocityY={35}
          initialVelocityX={5}
          recycle={false}
          />
          <h1 className="subtitle-1">🎉 Congratulations! 🎉</h1>
        </div>
        <h2 className="subtitle-2">Your Score</h2>
        <h3 className="subtitle-3">
          {score} out of {total}
        </h3>
        <h4 className="share">Share this quiz with your friends and challenge them</h4>
        <div>
            <WhatsappShareButton
            url={url}
            title={`I scored ${score}/${total}${code ? ` | The Quiz code: ${code}` : ""}`}>
            <img src="whatsapp.png" className="img-shar"></img>
          </WhatsappShareButton>
           <FacebookShareButton 
            url={url}
            title={`I scored ${score}/${total}${code ? ` | The Quiz code: ${code}` : ""}`}>
            <img src="facebook-logo.png" className="img-shar"></img>
          </FacebookShareButton>
           <TwitterShareButton
            url={url}
            title={`I scored ${score}/${total}${code ? ` | The Quiz code: ${code}` : ""}`}>
            <img src="twitter.png" className="img-shar"></img>
          </TwitterShareButton>
        </div> 

        <div className="scorebut">
            <button className="but" onClick={again} >play again</button>
        </div>
        <div className="scorebut">
           <button className="but" onClick={onhandler} >Go to Home</button>
        </div>
      </div>
      </div>
    )
}