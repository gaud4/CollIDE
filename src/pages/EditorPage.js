// App.js

import React, { useContext, useEffect, useRef, useState } from 'react';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { initSocket } from '../socket';
import { useLocation , useNavigate , Navigate , useParams } from 'react-router-dom';
import {Button} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure} from "@nextui-org/react";
import files from "./files";
import files2 from "./files2";
import files3 from "./files3";
import Editor from "@monaco-editor/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";
import axios from 'axios';

const EditorPage = () => {
    const [clients, setClients] = useState([]);
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
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

    const editorRef2 = useRef(null);
    const [fileName2, setFileName2] = useState("script2.js");
    const file2 = files2[fileName2];

    const editorRef3 = useRef(null);
    const [fileName3, setFileName3] = useState("script3.js");
    const file3 = files3[fileName3];

    const [problemCode, setProblemCode] = useState('');
    const [testCases, setTestCases] = useState([]);

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

    const fetchTestCases = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/scrape?problemCode=${problemCode}`);
            // console.log("test case fetch success");
            console.log(response.data);
            const testCaseCode = response.data.join('\n');
            editorRef2.current.setValue(testCaseCode);
            setTestCases(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const submitCode = async () => {
        const code = editorRef.current?.getValue();
        try {
            const response = await axios.post('http://localhost:4000/submit', { code, problemCode });
            console.log(response.data);
            toast.success('Code submitted successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit code');
        }
    };

    return (
        <div style={{height: "100vh", width: "100vw", fontFamily: "Manrope"}}>
            <div style={{height: "10vh", width: "100vw"}}>
                <Navbar position="static" style={{backgroundColor:"#141414", fontFamily: "Manrope"}}>
                    <NavbarBrand>
                        <p style={{fontFamily: "Manrope", fontSize: 25}}>Coll-IDE</p>
                    </NavbarBrand>
                    <NavbarContent justify="center">
                        <NavbarItem>
                            <Button color="success" variant="flat" >Run Code</Button>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="success" variant="flat" onPress={onOpen}>Fetch/Submit</Button>
                            <Modal isOpen={isOpen} onOpenChange={onOpenChange} styles={{backgroundColor: "black", fontFamily: "Manrope"}}>
                                <ModalContent>
                                {(onClose) => (
                                    <>
                                    <ModalHeader className="flex flex-col gap-1">Fetch/Submit</ModalHeader>
                                    <ModalBody>
                                        <div styles={{justifyContent: "center", alignContent: "center"}}>
                                            <div>
                                                <Textarea
                                                    isRequired
                                                    label=""
                                                    variant="underlined"
                                                    labelPlacement="outside"
                                                    placeholder="Enter the Problem ID"
                                                    className="max-w-xs"
                                                    value={problemCode}
                                                    onChange={(e) => setProblemCode(e.target.value)}
                                                />
                                            </div>
                                            <div style={{display: "flex", fontFamily: "Manrope"}}>
                                                <div style={{padding: "2vw", fontFamily: "Manrope"}}>
                                                    <Button color="primary" variant="flat" onClick={fetchTestCases}>
                                                        Fetch Cases
                                                    </Button>
                                                </div>
                                                <div style={{padding: "2vw", fontFamily: "Manrope"}}>
                                                    <Button color="primary" variant="flat" onClick={submitCode}>
                                                        Submit Code
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Close
                                        </Button>
                                    </ModalFooter>
                                    </>
                                )}
                                </ModalContent>
                            </Modal>
                        </NavbarItem>
                        <NavbarItem>
                            <Button color="success" variant="flat" onClick={copyRoomId}>Copy Room ID</Button>
                        </NavbarItem>
                        
                    </NavbarContent>
                    <NavbarContent justify="end">
                        <NavbarItem>
                            <Button color="danger"  className="m-4" onClick={leaveRoom}>Leave</Button>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
            </div>
            <div style={{height: "90vh", width: "100vw", display: "flex", fontFamily: "Manrope"}}>
                <div style={{fontFamily: "Manrope", height: "90vh", width: "65vw", borderRight: "10px solid black"}}>
                        <Editor
                            height="90vh"
                            theme="vs-dark"
                            defaultLanguage="cpp"
                            defaultValue={value}
                            value={value}
                            onMount={onMount}
                            onChange={(value) => setValue(value)}
                        />
                </div>
                <div style={{fontFamily: "Manrope", height: "90vh", width: "35vw"}}>
                    <div style={{fontFamily: "Manrope", height: "40vh", width: "35vw"}}>
                        <Editor
                            height="50vh"
                            theme="vs-dark"
                            path={file2.name}
                            defaultLanguage={file2.language}
                            defaultValue={file2.value}
                            onMount={(editor) => (editorRef2.current = editor)}
                        />
                    </div>
                    <div style={{fontFamily: "Manrope", height: "40vh", width: "35vw"}}>
                        <Editor
                            height="50vh"
                            theme="vs-dark"
                            path={file3.name}
                            defaultLanguage={file3.language}
                            defaultValue={file3.value}
                            onMount={(editor) => (editorRef3.current = editor)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
