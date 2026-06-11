import axios from "axios";
import { useState, useEffect , useRef} from "react";
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import Swal from "sweetalert2";
const url = import.meta.env.VITE_API_URL
export default function Navbar(){

  const [showProfile, setShowProfile] = useState(false);
const avatars =  [
  "/avatars/a1.jpg",
  "/avatars/a2.jpg",
  "/avatars/a3.png",
  "/avatars/a4.png",
  "/avatars/a5.jpg",
  "/avatars/a6.jpg",
  "/avatars/a7.jpg",
  "/avatars/a8.jpg",
  "/avatars/a9.jpg",
  "/avatars/a10.jpg",
  "/avatars/a11.jpg",
  "/avatars/a12.jpg",
];
    const image = localStorage.getItem("pic") || avatars[0];

  const profileRef = useRef(null);
  useEffect(()=>{
    const onhandlerclickoutside = (event)=>{
      if(profileRef.current && !profileRef.current.contains(event.target)){
        setShowProfile(false);
      }
    }

    document.addEventListener("mousedown", onhandlerclickoutside)
    return ()=>{
      document.removeEventListener("mousedown", onhandlerclickoutside)
    }

  },[])

    const navigate = useNavigate();
    const [user, setuser] = useState(false)
        useEffect(() => {
      isauth();
    }, []);
    const [point, setpoint] = useState(0);

    const getpoint = async()=>{
      try {
        const res = await axios.get(`${url}/getuser`,{withCredentials:true});
        if(res.data.success){
          setpoint(res.data.user.point);
        }else{
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
    const isauth = async()=>{
      try{
      const res = await axios.post(`${url}/isauth`,{},{withCredentials:true});
      if(res.data.success){
        getpoint();
        setuser(true);
      }
      }catch(error){
        setuser(false);
      }
    }
    //localStorage.setItem("point", 0);
    // const point = localStorage.getItem("point");


    const deleteuser =async ()=>{

      const result = await Swal.fire({
        title: "Delete Account?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) return;

      try {
        const res = await axios.delete(`${url}/deleteuser`,{withCredentials:true})
        if(res.data.success){
          const response = await axios.post(`${url}/logout`,{},{withCredentials:true});
            if(response.data.success){
              navigate('/');
              location.reload()
            }else{
              console.log(res.data.message);
            }
        }else{
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }


    const logout = async()=>{

      const result = await Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Logout",
        cancelButtonText: "Cancel",
      });
      if (!result.isConfirmed) return;

      try {
        const res = await axios.post(`${url}/logout`,{},{withCredentials:true});
        if(res.data.success){
          navigate('/');
          location.reload()
        }else{
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    } 

    const gotoprofil = ()=>{
      navigate('/userprofil')
    }

    return(
        <nav className="navbar">
      {/* Logo / Title */}
      <div className="pack">
      <h1 className="navbar-title">
        Welcome to Quiz Galata
      </h1>

      </div>
      <div className="pack">
        <Link className="link" to="/">
        <h3>Home</h3>
        </Link>
        <Link className="link" to="/quiz">
        <h3>Quiz</h3>
        </Link>
        <Link className="link" to="/leaderboard" >
        <h3>Leader Board</h3>
        </Link>

        </div>


        <div className="pack">
        <Link className="link" to='/point' state={{point:point}}>
        {user? <h3>🪙 {point}</h3>: ""}
        </Link>


        {user? <div className="cont-profil"><div onClick={() => setShowProfile(!showProfile)} className="profile-image-small" style={{ backgroundImage: `url(${image})` }}></div><h3 className="link"  onClick={() => setShowProfile(!showProfile)}> Profil</h3>
        
        <div ref={profileRef} className={`profile-panel ${showProfile ? "active" : ""}`}>
            <h3>My Profile</h3>

            <button onClick={gotoprofil}> <div className="cont1-profil"><div  className="profile-image-small" style={{ backgroundImage: `url(${image})` }}></div>Your Profile</div></button>
            {/* <button>Settings</button> */}
            <button onClick={deleteuser}>Delete Account</button>
            <button onClick={logout}>Logout</button>
          </div></div>
          :  
          <Link className="link" to='/login'><h3>Login</h3></Link>}
        </div>
    </nav>
    )
}