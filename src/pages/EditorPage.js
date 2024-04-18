import React, { useContext, useEffect, useRef, useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { language, cmtheme } from '../../src/atoms';
import { useRecoilState } from 'recoil';
// import { LanguageDropdown } from '../components/LanguageDropdown';
// import { PostContext } from "../context/PostContext";
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { useLocation , useNavigate , Navigate , useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {
  const [lang, setLang] = useRecoilState(language);
  const [them, setThem] = useRecoilState(cmtheme);

  const [clients, setClients] = useState([]);


  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();

//  const { setSelectedLanguage} =
//    useContext(PostContext);

  useEffect(() => {
      const init = async () => {
          socketRef.current = await initSocket();
          socketRef.current.on('connect_error', (err) => handleErrors(err));
          socketRef.current.on('connect_failed', (err) => handleErrors(err));

          function handleErrors(e) {
              console.log('socket error', e);
              toast.error('Socket connection failed, try again later.');
            //   reactNavigator('/');
          }

          socketRef.current.emit(ACTIONS.JOIN, {
              roomId,
              username: location.state?.username,
          });

          // Listening for joined event
          socketRef.current.on(
              ACTIONS.JOINED,
              ({ clients, username, socketId }) => {
                  if (username !== location.state?.username) {
                      toast.success(`${username} joined the room.`);
                      console.log(`${username} joined`);
                  }
                  setClients(clients);
                  socketRef.current.emit(ACTIONS.SYNC_CODE, {
                      code: codeRef.current,
                      socketId,
                  });
              }
          );

          // Listening for disconnected
          socketRef.current.on(
              ACTIONS.DISCONNECTED,
              ({ socketId, username }) => {
                  toast.success(`${username} left the room.`);
                  setClients((prev) => {
                      return prev.filter(
                          (client) => client.socketId !== socketId
                      );
                  });
              }
          );
      };
      init();
      return () => {
          socketRef.current.off(ACTIONS.JOINED);
          socketRef.current.off(ACTIONS.DISCONNECTED);
          socketRef.current.disconnect();
      };
  }, []);


  async function copyRoomId() {
      try {
          await navigator.clipboard.writeText(roomId);
          toast.success('Room ID has been copied to your clipboard');
      } catch (err) {
          toast.error('Could not copy the Room ID');
          console.error(err);
      }
  }

  function leaveRoom() {
      reactNavigator('/');
  }


  if (!location.state) {
      return <Navigate to="/" />;
  }

//  const onSelectChange = (sl) => {
//    console.log("selected Option...", sl);
//    setSelectedLanguage(sl);
//  };

  return (
    <div className="mainWrap">
            <div className="asideLeft">
                <div className="asideLeftInner">
                    <div className="logo">
                      <img src='/code-editor-background4.gif' alt='background4' className='background4img'/>  
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>

                <label>
                    Select Language:
                    <select value={lang} onChange={(e) => { setLang(e.target.value); window.location.reload(); }} className="seLang">
                        <option value="clike">GNU G++20 13.2 (64 bit)</option>
                        <option value="python">Python</option>
                    </select>
                </label>

                <label>
                    Select Theme:
                    <select value={them} onChange={(e) => { setThem(e.target.value); window.location.reload(); }} className="seLang">
                        <option value="default">default</option>
                        <option value="dracula">dracula</option>
                        <option value="3024-day">3024-day</option>
                        <option value="3024-night">3024-night</option>
                        <option value="abbott">abbott</option>
                        <option value="abcdef">abcdef</option>
                        <option value="ambiance">ambiance</option>
                        <option value="ayu-dark">ayu-dark</option>
                        <option value="ayu-mirage">ayu-mirage</option>
                        <option value="base16-dark">base16-dark</option>
                        <option value="base16-light">base16-light</option>
                        <option value="bespin">bespin</option>
                        <option value="blackboard">blackboard</option>
                        <option value="cobalt">cobalt</option>
                        <option value="colorforth">colorforth</option>
                        <option value="darcula">darcula</option>
                        <option value="duotone-dark">duotone-dark</option>
                        <option value="duotone-light">duotone-light</option>
                        <option value="eclipse">eclipse</option>
                        <option value="elegant">elegant</option>
                        <option value="erlang-dark">erlang-dark</option>
                        <option value="gruvbox-dark">gruvbox-dark</option>
                        <option value="hopscotch">hopscotch</option>
                        <option value="icecoder">icecoder</option>
                        <option value="idea">idea</option>
                        <option value="isotope">isotope</option>
                        <option value="juejin">juejin</option>
                        <option value="lesser-dark">lesser-dark</option>
                        <option value="liquibyte">liquibyte</option>
                        <option value="lucario">lucario</option>
                        <option value="material">material</option>
                        <option value="material-darker">material-darker</option>
                        <option value="material-palenight">material-palenight</option>
                        <option value="material-ocean">material-ocean</option>
                        <option value="mbo">mbo</option>
                        <option value="mdn-like">mdn-like</option>
                        <option value="midnight">midnight</option>
                        <option value="monokai">monokai</option>
                        <option value="moxer">moxer</option>
                        <option value="neat">neat</option>
                        <option value="neo">neo</option>
                        <option value="night">night</option>
                        <option value="nord">nord</option>
                        <option value="oceanic-next">oceanic-next</option>
                        <option value="panda-syntax">panda-syntax</option>
                        <option value="paraiso-dark">paraiso-dark</option>
                        <option value="paraiso-light">paraiso-light</option>
                        <option value="pastel-on-dark">pastel-on-dark</option>
                        <option value="railscasts">railscasts</option>
                        <option value="rubyblue">rubyblue</option>
                        <option value="seti">seti</option>
                        <option value="shadowfox">shadowfox</option>
                        <option value="solarized">solarized</option>
                        <option value="the-matrix">the-matrix</option>
                        <option value="tomorrow-night-bright">tomorrow-night-bright</option>
                        <option value="tomorrow-night-eighties">tomorrow-night-eighties</option>
                        <option value="ttcn">ttcn</option>
                        <option value="twilight">twilight</option>
                        <option value="vibrant-ink">vibrant-ink</option>
                        <option value="xq-dark">xq-dark</option>
                        <option value="xq-light">xq-light</option>
                        <option value="yeti">yeti</option>
                        <option value="yonce">yonce</option>
                        <option value="zenburn">zenburn</option>
                    </select>
                </label>

                <button className="btn copyBtn" onClick={copyRoomId}>
                    Copy ROOM ID
                </button>
                <button className="btn leaveBtn" onClick={leaveRoom}>
                    Leave
                </button>

                
            </div>

            <div className="editorWrap">
                <Editor
                    socketRef={socketRef}
                    roomId={roomId}
                    onCodeChange={(code) => {
                        codeRef.current = code;
                    }}
                />
            </div>
        </div>
    
  )
};

export default EditorPage;
