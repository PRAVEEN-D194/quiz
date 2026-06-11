
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const url = import.meta.env.VITE_API_URL
import {RingLoader} from "react-spinners"
import { toast } from "react-toastify";

export default function Resetpassword() {
  const [currentotp, setotp] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const [email, setemail] = useState();
  const [newPassword, setnewpassword] = useState();

  const [loading, setloading] = useState(false)
  const [emailpage, setemailpage] = useState(true);
  const [otppage, setotppage] = useState(false);
  const [newpasswordpage, setnewpasswordpage] = useState(false);

  const navigate = useNavigate();

  const handlerfun = (e, index) => {
    if (
      e.target.value.length > 0 &&
      index < inputRef.current.length - 1
    ) {
      inputRef.current[index + 1].focus();
    }
  };

  const handlebackword = (e, index) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlepast = (e) => {
    e.preventDefault();

    const past = e.clipboardData.getData("text");
    const pasteArray = past.split("");

    const newOtp = [...currentotp];

    pasteArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });

    setotp(newOtp);
  };

  const onemailsub = async (e) => {
    e.preventDefault();

    try {
      setloading(true)

      const response = await axios.post(
        `${url}/resendotp`,
        { email },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setemailpage(false);
        setotppage(true);
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.info(error.message);
    }finally{setloading(false)}
  };

  const onotpsub = async (e) => {
    e.preventDefault();

    try {
      setotppage(false);
      setnewpasswordpage(true);
    } catch (error) {
      console.log(error);
    }
  };

     
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
  const onnewpasswordlsub = async (e) => {
    e.preventDefault();

    try {
      setloading(true)
      const otp = currentotp.join("");

      const response = await axios.post(
        `${url}/resetpassword`,
        {
          email,
          otp,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        navigate("/login");
        toast.success(response.data.message);
      } else {
       toast.info(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.info(error.message);
    }finally{setloading(false)}
  };

  return (
    <>
    {loading && (<div className="loader-container"><RingLoader  color="black"></RingLoader></div>)}
      {emailpage && (
        <div className="login-container">
          <form className="login-form">
            <h2>Reset Password Email</h2>

            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                onChange={(e) => {
                  setemail(e.target.value);
                }}
                required
              />
            </div>

            <button className="auth-but" onClick={onemailsub} type="submit">
              submit
            </button>
          </form>
        </div>
      )}

      {otppage && (
        <div className="verify-container">
          <div className="verify-card" onPaste={handlepast}>
            <h1>Reset password OTP</h1>

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
                    value={currentotp[index]}
                    ref={(e) => (inputRef.current[index] = e)}
                    onChange={(e) => {
                      const newOtp = [...currentotp];
                      newOtp[index] = e.target.value;
                      setotp(newOtp);

                      handlerfun(e, index);
                    }}
                    onKeyDown={(e) =>
                      handlebackword(e, index)
                    }
                    required
                  />
                ))}
            </div>

            <button
              className="verify-btn"
              onClick={onotpsub}
            >
              submit
            </button>
          </div>
        </div>
      )}

      {newpasswordpage && (
        <div className="login-container">
          <form className="login-form">
            <h2>Reset Password</h2>

            <div className="input-group">
              <label htmlFor="password">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your new password"
                onChange={(e) => {
                  setnewpassword(e.target.value);
                }}
                required
              />
            </div>

            <button
            className="auth-but"
              onClick={onnewpasswordlsub}
              type="submit"
            >
              submit
            </button>
          </form>
        </div>
      )}
    </>
  );
}