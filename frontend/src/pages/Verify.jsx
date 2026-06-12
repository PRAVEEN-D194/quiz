import { useRef, useState, useEffect } from "react"
import {Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
const url = import.meta.env.VITE_API_URL
import {PropagateLoader} from "react-spinners"

export default function Verify(){


    const [otp, setotp] = useState();
    const inputRef = useRef([]);
    const [loading, setloading] = useState(false)

    const navigate = useNavigate();

       
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
    const handlerfun = (e, index)=>{
      if(e.target.value.length > 0 && index < inputRef.current.length-1){
        inputRef.current[index + 1].focus();
       }
      }

    const handlebackword = (e, index)=>{
      if(e.key === "Backspace" && e.target.value === "" && index > 0){
        inputRef.current[index - 1].focus();
      }
    }

    const handlepast = (e)=>{
      e.preventDefault();
      
      const past = e.clipboardData.getData("text");
      const pasteArray = past.split("");
      pasteArray.forEach((char, index)=>{
        if(inputRef.current[index]){
          inputRef.current[index].value = char;
        }
      })
    }

    const onsub = async (e)=>{
      try {
        setloading(true);
        e.preventDefault();
        const otparray = inputRef.current.map((e)=>e.value);
        const otp = otparray.join('');
        const response = await axios.post(`${url}/api/v1/verify-opt`,{otp},{
          withCredentials: true   
        });
        if(response.data.success){
          navigate('/');
          toast.success(response.data.message);
        }else{
          toast.info(response.data.message);
        }

      } catch (error) {
        console.log(error)
        toast.info(error.message);
      }finally{setloading(false)}
    }
    return(<>
    {loading && (<div className="loader-container"><PropagateLoader  color="gray"></PropagateLoader></div>)}
    <div className="verify-container">
      <div className="verify-card" onPaste={(e) => handlepast(e)}>
        <h1>Verify OTP</h1>

        <p>Enter the 6-digit OTP sent to your email.</p>

        <div className="otp-inputs">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="otp-input"
                ref={e => inputRef.current[index] = e}
                onInput={(e)=>handlerfun(e, index)}
                onKeyDown={(e)=>handlebackword(e, index)}
              />
            ))}
        </div>

        <button onClick={onsub} className="verify-btn">
          Verify
        </button>
      </div>
    </div>
    </>)
}