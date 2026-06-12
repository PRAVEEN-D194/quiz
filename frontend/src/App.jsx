
import './App.css'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Play from './pages/Play';
import Createquiz from './pages/Createquiz';
import Searchquiz from './components/Searchquiz';
import Score from './components/Score';
import Quiz from './pages/Quiz';
import Point from './components/Point';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Resetpassword from './pages/Resetpassword';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Profil from './components/Profil';
import Profilpage from './pages/Profilpage';
import Changepassword from './components/Changepassword';


function App() {

  return (
    <>
    <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/play" element={<Play/>} />
      <Route path="/create" element={<Createquiz/>} />
      <Route path="/search" element={<Searchquiz/>} />
      <Route path="/score" element={<Score/>} />
      <Route path="/quiz" element={<Quiz/>} />
      <Route path="/point" element={<Point/>} />
      <Route path='/leaderboard' element={<Leaderboard></Leaderboard>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/verify" element={<Verify/>} />
      <Route path="/resetpassword" element={<Resetpassword/>} />
      <Route path="/profil" element={<Profil/>} />
      <Route path="/userprofil" element={<Profilpage/>} />
      <Route path="/changepassword" element={<Changepassword/>} />
      
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
