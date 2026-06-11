import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_API_URL
import {PuffLoader} from "react-spinners"
import { toast } from "react-toastify";
export default function Searchquiz({setquiz,setscroll, setsearch}){
    const [link, setlink] = useState("");
    const [loading, setloading] = useState(false);

        const onsearch = async()=>{
            try {
                const trimmedLink = link.trim();
                setlink(trimmedLink)
                if(link.length !== 6){
                    toast.info("code only 6 digit");
                    return;
                }
                if(link == ""){
                    toast.info("Enter the Link");
                }
                setloading(true)
                const res = await axios.get(`${url}/getquestion/${link}`);
                if(res.data.success){
                setquiz([])
                setquiz([res.data.quiz])
                 
                }
                else{
                   toast.info(res.data.message);
                }
            } catch (error) {
                console.log(error)
                toast.info(error.message);
                return
            }finally{setloading(false);setscroll(true);}
        }
        const navigate = useNavigate();
        const onnav = ()=>{
        navigate('/create')
    }

    const back = ()=>{
        setsearch(false);
    }
    return(
        <div className="search-container">
            {/* {loading && (<div className="loader-container"><PuffLoader  color="black"></PuffLoader></div>)} */}
        <div className="quiz-box">
        <button className="back-btn" onClick={back}>← Back</button>
    <h2 className="searchcontent">Create and Share Quizzes</h2>

    <p className="searchcontent">
        Create your own quiz and share the link with your friends,
        or paste a quiz link below to start playing.
    </p>

    <button className="create-btn" onClick={onnav}>Create Quiz</button>

    <div className="search-section">
        <label htmlFor="quiz-link">Paste Your Quiz Code</label>

        <input
            id="quiz-link"
            type="text"
            placeholder="Enter quiz 6 digit code..."
            onChange={(e) => setlink(e.target.value)}
            maxLength={6}
            minLength={6}
            required
        />

        <button type="submit" className="search-btn" onClick={onsearch}>
            Search Quiz
        </button>
    </div>
</div>
</div>
    )
}