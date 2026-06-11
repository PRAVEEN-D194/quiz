import { Link } from "react-router-dom"
import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_API_URL

export default function Signup() {
  const navigate = useNavigate();
  const [signup, setsignup] = useState({});
  const onset = (e) => {
    const name = e.target.name;
    setsignup((prev) => {
      return { ...prev, [name]: e.target.value }
    })
  }

  const onsub = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/register`, signup, {
        withCredentials: true,
      });
      console.log(response);
      if (response.data.success) {
        const data = await axios.post(`${url}/sendotp`, {}, {
          withCredentials: true,
        });
        if(data.data.success){
          navigate('/verify');
        }else {
        console.log(response.data.message);
      }
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (<>
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