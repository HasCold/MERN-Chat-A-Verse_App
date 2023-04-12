import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

// "proxy" : "http://127.0.0.1:5000",  we are going to add proxy to connect backend and frontend for the same origin port

function App() {
  document.title = "Chat-A-Verse";
  return (
    <div className="App">

  <Routes>

    <Route path='/' element={<Homepage/>} exact/>
    {/* <Route path='/resetpassword/:token' element={<ForgetPassword/>} /> */}
    <Route path='/chats' element={<ChatPage />} />

  </Routes>
    </div>
  );
}

export default App;
