import React, { useState } from 'react';
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState ('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Created a new room.')
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error ('Both Room Id and username are required');
      return;
    }

    //Redirect
    navigate(`/editor/${roomId}`, {
      state: {
          username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    };
  };


  return (
    <div className='homePageWrapper'>
      
      <div className='background4'>
        {/* <img src='/code-editor-background4.gif' alt='background4' className='background4img'/> */}
        <h1 className='name'><i>Coll-IDE</i></h1>
        <h1>Share code in Real-time with Developers</h1>
        
        <h3 className='about'> Coll-IDE is a realtime code-editor and compiler where you can write your code in realtime with your partners with functionality to run it. </h3>
        <h3 className='mainLabel'> Get started..!!</h3>
        <div className='inputGroup'>
          <input type='text' className='inputBox' placeholder='Paste your Room Id' value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter} />
          <span className='createInfo'>
            Doesn't have one, no worries &nbsp;
            <a onClick={createNewRoom} href='' className='createNewBtn'>create now </a>
          </span>
          <input type='text' className='inputBox' placeholder='USERNAME' value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={handleInputEnter} />
          <button className='btn joinBtn' onClick={joinRoom}> JOIN </button>  
        </div>
      </div>
      
    </div>
  );
};

export default Home;
