import React, { useState } from "react";
import { useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image.png";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
const JWT_SECRET = "amogussasmitbaka";

const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token); // Decode the token payload
    const currentTime = Date.now() / 1000; // Current time in seconds

    if (decoded.exp < currentTime) {
      console.error("Token has expired");
      return false;
    }

    console.log("Token is valid:", decoded);
    return true;
  } catch (error) {
    console.error("Invalid token:", error.message);
    alert("Please Login First");
    return false;
  }
};
// useEffect(() => {
//   if (validateToken(token) === false) {
//     //console.log("Invalid token:", token?.data);
//     navigate("/"); // Redirect to login page if token is invalid
//   }
// }, [token, navigate]);

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const { token, login, logout } = useAuth();
  useEffect(() => {
    if (validateToken(token) === false) {
      //console.log("Invalid token:", token?.data);
      navigate("/"); // Redirect to login page if token is invalid
    }
  }, [token, navigate]);

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created a new room.");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both Room Id and username are required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        style={{
          height: "100vh",
          width: "100vw",
          paddingLeft: "25vw",
          paddingRight: "25vw",
          paddingTop: "10vh",
          paddingBottom: " 10vh",
        }}
      >
        <div style={{ height: "25vh", width: "50vw" }}>
          <h1
            style={{ fontSize: 50, textAlign: "center", fontFamily: "Manrope" }}
          >
            Welcome, to Coll-IDE
          </h1>
          <h1
            style={{ fontSize: 30, textAlign: "center", fontFamily: "Manrope" }}
          >
            {" "}
            (the IDE for real-time collaboration)
          </h1>
        </div>
        <div
          style={{
            fontFamily: "Manrope",
            height: "20vh",
            width: "50vw",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "Manrope",
              height: "20vh",
              width: "25vw",
              fontSize: 17,
              textAlign: "center",
              display: "grid",
              placeItems: "center",
              paddingLeft: "3vw",
              paddingRight: "3vw",
              paddingTop: "2vh",
              paddingBottom: "2vh",
            }}
          >
            Paste the ID for the Room that you want to join
          </h1>
          <div
            style={{
              height: "20vh",
              width: "25vw",
              display: "grid",
              placeItems: "center",
              fontFamily: "Manrope",
            }}
          >
            <Input
              isRequired
              type="text"
              label="Room ID"
              variant="bordered"
              placeholder="Paste your Room ID"
              defaultValue=""
              className="max-w-xs"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={handleInputEnter}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: "Manrope",
            height: "20vh",
            width: "50vw",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "Manrope",
              height: "20vh",
              width: "25vw",
              fontSize: 17,
              textAlign: "center",
              display: "grid",
              placeItems: "center",
              paddingLeft: "3vw",
              paddingRight: "3vw",
              paddingTop: "2vh",
              paddingBottom: "2vh",
            }}
          >
            Enter your username here
          </h1>
          <div
            style={{
              height: "20vh",
              width: "25vw",
              display: "grid",
              placeItems: "center",
              fontFamily: "Manrope",
            }}
          >
            <Input
              isRequired
              type="text"
              label="Username"
              variant="bordered"
              placeholder="Username"
              defaultValue=""
              className="max-w-xs"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyUp={handleInputEnter}
            />
          </div>
        </div>
        <div
          style={{
            height: "15vh",
            width: "50vw",
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <div
            style={{
              height: "15vh",
              width: "25vw",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Button
              variant="light"
              onClick={createNewRoom}
              style={{ border: "2px solid #707079", fontFamily: "Manrope" }}
            >
              Create Room
            </Button>
          </div>
          <div
            style={{
              height: "15vh",
              width: "25vw",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <Button
              variant="light"
              onClick={joinRoom}
              style={{ border: "2px solid #707079", fontFamily: "Manrope" }}
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
