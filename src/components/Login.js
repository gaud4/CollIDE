import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image.png";
import { Button, Input } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext"; // Correct import

function Login() {
  const history = useNavigate();
  const { login } = useAuth(); // Destructure the 'login' function from the context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/", {
        username,
        password,
      });

      // Extract data from the server response
      const { message, token } = response.data;
      //console.log(message);

      if (message === "exist") {
        // Call the 'login' function from context to update the token state
        login(token);

        // Navigate to home page
        history("/home");
      } else if (message === "notmatch") {
        alert("Wrong Password");
      } else if (message === "notexist") {
        alert("User does not exist");
      } else {
        alert("Unexpected response from server :" + message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Invalid Details");
    }
  }

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
          paddingBottom: "10vh",
        }}
      >
        <div style={{ height: "20vh", width: "50vw" }}>
          <h1
            style={{
              fontFamily: "Manrope",
              fontSize: 55,
              textAlign: "center",
              display: "grid",
              placeItems: "center",
            }}
          >
            Login Page
          </h1>
        </div>
        <div
          style={{
            height: "20vh",
            width: "50vw",
            paddingLeft: "10vw",
            paddingRight: "10vw",
            fontFamily: "Manrope",
          }}
        >
          <Input
            type="username"
            variant="underlined"
            label="Username/Email"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div
          style={{
            height: "20vh",
            width: "50vw",
            paddingLeft: "10vw",
            paddingRight: "10vw",
            fontFamily: "Manrope",
          }}
        >
          <Input
            type="password"
            variant="underlined"
            label="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div
            style={{
              height: "20vh",
              width: "25vw",
              paddingLeft: "10vw",
              paddingRight: "10vw",
              fontFamily: "Manrope",
            }}
          >
            <Button
              color="success"
              onClick={() => {
                window.location.href = "/signup";
              }}
              variant="light"
            >
              Register Today!
            </Button>
          </div>
          <div
            style={{
              height: "20vh",
              width: "25vw",
              paddingLeft: "10vw",
              paddingRight: "10vw",
              fontFamily: "Manrope",
            }}
          >
            <Button color="success" onClick={submit} variant="light">
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
