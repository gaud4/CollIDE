import React, { useContext, useEffect, useRef, useState } from 'react'
// import Editor from '../components/Editor';
import ACTIONS from '../Actions';
import toast from 'react-hot-toast';
import { initSocket } from '../socket';
import { useLocation , useNavigate , Navigate , useParams } from 'react-router-dom';
import {Button} from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import {Textarea} from "@nextui-org/react";
import files from "./files";
import files2 from "./files2";
import files3 from "./files3";
import Editor from "@monaco-editor/react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link} from "@nextui-org/react";

const EditorPage = () => {
    const [clients, setClients] = useState([]);

    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const editorRef = useRef(null);
    const [fileName, setFileName] = useState("script.js");
    const file = files[fileName];
    const editorRef2 = useRef(null);
    const [fileName2, setFileName2] = useState("script2.js");
    const file2 = files2[fileName2];
    const editorRef3 = useRef(null);
    const [fileName3, setFileName3] = useState("script3.js");
    const file3 = files3[fileName3];
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
        <div>
            <div style={{height:"10vh"}}>
             <Navbar position="static" style={{backgroundColor:"#141414"}}>
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit">Coll-IDE</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </div>
        <div className="mainWrap">
            {/* <div className="asideLeft">
                <div style={{height: "50vh"}}>
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
                <div style={{height: "10vh", display: "flex", justifyContent: "center", alignContent: "center", placeItems: "center"}}>
                    <Button color="primary" variant="flat" >RUN CODE</Button>
                </div>
                <div style={{height: "10vh", display: "flex", justifyContent: "center", alignContent: "center", placeItems: "center"}}>
                    <Button color="primary" variant="flat" >SUBMIT CODE</Button>
                </div>
                <div style={{height: "10vh", display: "flex", justifyContent: "center", alignContent: "center", placeItems: "center"}}>
                    <Button color="success" variant="bordered" onClick={copyRoomId}>Copy Room ID</Button>
                </div>
                <div style={{height: "10vh", display: "flex", justifyContent: "center", alignContent: "center", placeItems: "center"}}>
                    <Button color="danger"  className="m-4" onClick={leaveRoom}>Leave</Button>
                </div>
            </div> */}
            <div style={{width: "65vw"}}>
            <Editor
        height="90vh"
        theme="vs-dark"
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
        onMount={(editor) => (editorRef.current = editor)}
      />
            </div>
            <div style={{width: "35vw"}}>
                <div style={{height: "45vh"}}>
                    {/* <Textarea
                        label="input"
                        placeholder="Enter Input"
                        className="max-w-xs"
                    /> */}
                    <Editor
        height="50vh"
        theme="vs-dark"
        path={file2.name}
        defaultLanguage={file2.language}
        defaultValue={file2.value}
        onMount={(editor) => (editorRef2.current = editor)}
      />
                </div>
                <div style={{height: "45vh"}}>
                    {/* <Textarea
                        isReadOnly
                        variant="bordered"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        defaultValue="Output"
                        className="max-w-xs"
                    /> */}
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
    )
};

export default EditorPage;
