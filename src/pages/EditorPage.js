import React, { useContext, useEffect, useRef, useState } from 'react'
import Editor from '../components/Editor';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { initSocket } from '../socket';
import { useLocation , useNavigate , Navigate , useParams } from 'react-router-dom';
import {Button} from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";

const EditorPage = () => {
    const [clients, setClients] = useState([]);

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();

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

    function leaveRoom() {
        reactNavigator('/');
    }

    if (!location.state) {
        return <Navigate to="/" />;
    }

    const codes = [
        { label: "GNU G++20 13.2 (64bit)", value: "cpp" },
        { label: "PyPy 3.9.10 (64 bit)", value: "python" }
    ];

    return (
        <div className="mainWrap">
            <div className="asideLeft" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                
                <div  style={{ flex: 1 }}>
                    <Select
                        label="Select Language" 
                        className="max-w-xs" 
                    >
                        {codes.map((animal) => (
                            <SelectItem key={codes.value} value={codes.value} className="dark ">
                                {codes.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <Button color="primary" variant="flat" >RUN CODE</Button>
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <Button color="primary" variant="flat" >SUBMIT CODE</Button>
                </div>

                <div className="flex gap-4" >
                    <Button color="success" variant="bordered" onClick={copyRoomId}>Copy Room ID</Button>
                    <Button color="danger"  className="m-4" onClick={leaveRoom}>Leave</Button>
                </div>
            </div>
            
            <div className="editorWrap" style={{ display: 'flex', height: '100%' }}>
                <div style={{ flex: '75%' }}>
                    <Editor
                        socketRef={socketRef}
                        roomId={roomId}
                        onCodeChange={(code) => {
                            codeRef.current = code;
                        }}
                    />
                </div>
                <div style={{ flex: '25%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <Textarea
                                label="input"
                                placeholder="Enter Input"
                                className="max-w-xs"
                                style={{ height: '32vh'}}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <Textarea
                                isReadOnly
                                label="Description"
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder="Enter your description"
                                defaultValue="Output"
                                className="max-w-xs"
                            />
                        </div>
                    </div> 
                </div> 
            </div>
        </div>
    )
};

export default EditorPage;
