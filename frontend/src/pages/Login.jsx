import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
const url = import.meta.env.VITE_API_URL
import { HashLoader } from "react-spinners"
import { toast } from "react-toastify";
export default function Login() {


  const navigate = useNavigate();
  const [login, setlogin] = useState({});
  const [loading, setloading] = useState(false);
  const onset = (e) => {
    const name = e.target.name;
    setlogin((prev) => {
      return { ...prev, [name]: e.target.value }
    })
  }


  const [darkMode, setDarkMode] = useState(localStorage.getItem("dark") === "true");


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
    setloading(true);
    try {
      const response = await axios.post(`${url}/api/v1/login`, login, { withCredentials: true, });
      if (response.data.success) {
        navigate('/');
        const data = await axios.post(`${url}/api/v1/sendotp`, {}, {
          withCredentials: true,
        });
        if (data.data.isverify) {
          navigate('/');
          return;
        }
        if (data.data.success) {
          navigate('/');
        } else {

          toast.info(response.data.message);
        }
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.info(error.message);
    } finally {
      setloading(false)
    }
  }

  return (<>

    {loading && <div className="loader-container"><HashLoader color="gray"></HashLoader></div>}

    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>

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
        <p className="forgot-password">
          <Link className="link" to="/resetpassword" >Forgot Password?</Link>
        </p>
        <button className="auth-but" onClick={onsub} type="submit">Login</button>
        <p className="signup-text">
          Don't have an account? <span><Link className="link" to="/signup">Sign Up</Link></span>
        </p>
      </form>
    </div>

  </>)
}