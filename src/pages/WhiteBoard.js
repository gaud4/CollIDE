
import React, { useContext, useEffect, useRef, useState } from 'react';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { initSocket } from '../socket';
import { useLocation , useNavigate , Navigate , useParams } from 'react-router-dom';
import { FaFileCode } from "react-icons/fa";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import Penciltool from './Penciltool';

const WhiteBoard = () =>{
  const [clients, setClients] = useState([]);
    // const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();

    const editorRef = useRef();
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem('code');
        return storedValue ? storedValue : '';
    });

    useEffect(() => {
        const handleBeforeUnload = () => {
            localStorage.setItem('code', value);
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [value]);

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
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
    console.log(roomId);
  return(
    <>
    <div style={{height: "10vh", width: "100vw"}}>
                <Navbar position="static" style={{backgroundColor:"#141414", fontFamily: "Manrope"}}>
                    <NavbarBrand>
                        <p style={{fontFamily: "Manrope", fontSize: 25}}>Coll-IDE</p>
                        
                    </NavbarBrand>
                    <NavbarContent>
                    <FaFileCode onClick={() => reactNavigator(`/editor/${roomId}`)} />
                    </NavbarContent>
                </Navbar>
    </div>
    <Penciltool/>
    </>
  );


};

export default WhiteBoard;