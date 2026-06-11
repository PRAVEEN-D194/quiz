import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
const url =  import.meta.env.VITE_API_URL

export default function Leaderboard(){
    const navigate = useNavigate();
    const [user, setuser] = useState([]);

    const getuser = async ()=>{
        try {
            const res = await axios.get(`${url}/getalluser`);
            if(res.data.success){
                setuser(res.data.user);
            }
            else{
                console.log(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const isauth = async()=>{
      try {
        const res = await axios.post(`${url}/isauth`, {}, {withCredentials:true});
        if(res.data.success){
          return
        }
        toast.warn("You need to log in to access the leaderboard");
        navigate('/login')
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(()=>{
        isauth();
        getuser();
    },[])
    return(
        <>
        <Navbar></Navbar>
        <div className="user-box leaderboard">
        <div>Rank</div>
        <div>Name</div>
        <div>Points</div>
        </div>
        <div className="leaderboard">
        {user.map((user, index) => (
            <div key={index} className="user-box">
            <div className="rank">{index === 0
                ? `🥇 ${index + 1}`
                : index === 1
                ? `🥈 ${index + 1}`
                : index === 2
                ? `🥉 ${index + 1}`
                : `#${index + 1}`}</div>
            <div className="name">{user.name}</div>
            <div className="points">🪙 {user.point}</div>
            </div>
        ))}
        </div>
        </>
    )
}