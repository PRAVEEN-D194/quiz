import { useRef, useState } from "react"
import {Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
const url = import.meta.env.VITE_API_URL

export default function Verify(){


    const [otp, setotp] = useState();
    const inputRef = useRef([]);

    const navigate = useNavigate();
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
        e.preventDefault();
        const otparray = inputRef.current.map((e)=>e.value);
        const otp = otparray.join('');
        const response = await axios.post(`${url}/verify-opt`,{otp},{
          withCredentials: true   
        });
        if(response.data.success){
          navigate('/');
        }else{
          alert(response.data.message);
          console.log(response.data.message);
        }

      } catch (error) {
        console.log(error)
      }
    }
    return(<>
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