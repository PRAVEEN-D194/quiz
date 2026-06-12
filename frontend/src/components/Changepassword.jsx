import axios from "axios";
import { useState , useEffect} from "react"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const url = import.meta.env.VITE_API_URL

export default function Changepassword (){
    const [oldpassword, setoldpassword] = useState("");
    const [newpassword, setnewpassword] = useState("");
    const [shownewpassword, setshownewpassword] = useState(false);

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


    const navigate = useNavigate();

    const onsubmit = async()=>{
        try {
            const res = await axios.post(`${url}/api/v1/checkpassword`, {password:oldpassword}, {withCredentials:true});``
             if(res.data.success){
                setshownewpassword(true);
            }else{
               toast.warn(res.data.message);
            }
        } catch (error) {
           toast.warn(error.message);
        }
    }
    const onchangepassword = async()=>{
        try {
            const res = await axios.post(`${url}/api/v1/changepassword`, {password:newpassword}, {withCredentials:true});

            if(res.data.success){
                 setshownewpassword(false);
                navigate(-1);
                 toast.success("password changed successful");
             }else{
                toast.warn(res.data.message);
            }
        } catch (error) {
            toast.warn(error.message);
        }
    }
    return(
        
        <div className="login-container">
       {!shownewpassword && (
            <form className="login-form">
                <h2>Change Password</h2>

        <div className="input-group">
          <label >Old Password</label>
          <input
            type="password"
            id="password"
            name="oldpassword"
            placeholder="Enter your Old password"
            onChange={(e)=>{setoldpassword(e.target.value)}}
            required
          />
        </div>
        <Link className="link" to="/resetpassword" >Forgot Password?</Link>
        <div>
        <button  type="button" className="auth-but" onClick={onsubmit}>change</button>
        </div>
            </form> )}
    
        {shownewpassword && (<form className="login-form">
            <div className="input-group">
          <label >New Password</label>
          <input
            type="password"
            id="password"
            name="newpassword"
            placeholder="Enter your New password"
            onChange={(e)=>setnewpassword(e.target.value)}
            required
          />
        </div>
        <button  type="button" className="auth-but" onClick={onchangepassword}>change</button>
        </form>)}
        
        </div> 
    
    )
}