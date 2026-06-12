import { Link } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
const url = import.meta.env.VITE_API_URL
import {ClimbingBoxLoader} from "react-spinners"
import { toast } from "react-toastify";

export default function Signup() {
  const navigate = useNavigate();
  const [signup, setsignup] = useState({});
  const [loading, setloading] = useState(false)
  const onset = (e) => {
    const name = e.target.name;
    setsignup((prev) => {
      return { ...prev, [name]: e.target.value }
    })
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
  const onsub = async (e) => {
    e.preventDefault();
    try {
      setloading(true)
      const response = await axios.post(`${url}/api/v1/register`, signup, {
        withCredentials: true,
      });
  
      if (response.data.success) {
        const data = await axios.post(`${url}/api/v1/sendotp`, {}, {
          withCredentials: true,
        });
        if(data.data.success){
          navigate('/verify');
        }else {
          toast.warning(response.data.message)
        
      }
      } else {
        toast.warning(response.data.message)
  
      }
    } catch (error) {
      console.log(error);
      toast.info(error.message);
    }finally{setloading(false)}
  }
  return (<>
  {loading && (<div className="loader-container"><ClimbingBoxLoader  color="black"></ClimbingBoxLoader></div>)}
    <div className="login-container">
      <form className="login-form">
        <h2>Signup</h2>

        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input
            type="test"
            id="name"
            name="name"
            placeholder="Enter your name"
            onChange={onset}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            onChange={onset}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            onChange={onset}
            required
          />
        </div>
        <button className="auth-but" onClick={onsub} type="submit">Signup</button>
        <p className="signup-text">
          I have an account? <span><Link  className="link" to="/login">Login</Link></span>
        </p>
      </form>
    </div>
  </>)
}