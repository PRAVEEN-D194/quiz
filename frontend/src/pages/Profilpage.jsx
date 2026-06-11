import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaPen } from "react-icons/fa";
const url = import.meta.env.VITE_API_URL
import { toast } from "react-toastify";


export default function Profile() {
  const fileRef = useRef();

  const [name, setname] = useState("");  
  const [email, setemail] = useState("");  
  const [point, setpoint] =useState(0);
  const [editname, seteditname] = useState(false);

  
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
//   const [profilpic, setprofilpic] = useState(image || avatars[0]);
  const [showAvatars, setshowAvatars] = useState(false)
  const handleClick = () => {
    fileRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      // later: upload or preview logic
    }
  };

  const getuser = async()=>{
      try {
        const res = await axios.get(`${url}/getuser`,{withCredentials:true});
        if(res.data.success){
          setname(res.data.user.name);
          setemail(res.data.user.email);
          setpoint(res.data.user.point)
        }else{
          console.log(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  const  changename= async()=>{
        try {
            console.log("hello")
            const res = await axios.put(`${url}/updateuser`,{name},{withCredentials:true});
            if(res.data.success){
                toast.success("User name changed Successfully");
            }else{
                toast.info(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
  } 
  useEffect(()=>{
    getuser();
  },[])
  return (
    <div className="profile-container">

      <div className="profile-card">

        <div className="profile-image-wrapper">
          
          <div className="profile-image" style={{ backgroundImage: `url(${image})` }} >
            <div className="editimg-pen" onClick={()=>setshowAvatars(true)}>
               <img className="edit-img" src={"/edit1.png"}></img>
                </div>
            </div>
        {showAvatars && (
            <div className="avatar-box">
                {avatars.map((img, index)=>(
                    <img key={index}
                        src={img}
                        onClick={()=>{
                        localStorage.setItem("pic", img)
                        setshowAvatars(false);}} 
                        className="avatar-img"></img>
                ))}
            </div>
        )}
        
          {/* <div className="edit-icon" onClick={handleClick}>
            
          </div> */}

          {/* <input
            type="file"
            ref={fileRef}
            onChange={handleChange}
            hidden
          /> */}
        </div>

        <div className="profile-info">
          <div className="info-row">
            {editname ? (
                <span><input type="text" value={name} onChange={(e)=>setname(e.target.value)}></input></span>
            ):
            (<span>User Name: {name}</span>)}

        
            {editname ? (<button onClick={changename}>change</button>) : (<div className="edit-pen" onClick={() => seteditname(true)} ><FaPen /></div>)}
          </div>

          <div className="info-row">
            <span>User Email: {email}</span>
          </div>
          <div className="info-row">
            <span>🪙{point}</span>
          </div>
        </div>

      </div>
    </div>
  );
}