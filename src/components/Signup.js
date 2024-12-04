import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../image.png";
import { Button, Input } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

function Signup() {
  const history = useNavigate();
  const { login } = useAuth(); // Use the login function from context

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/signup", {
        email,
        username,
        password,
      });

      const { message, token } = response.data;

      if (message === "exist") {
        alert("User already exists");
      } else if (message === "success") {
        // Store the token in context
        login(token); // Call the login function from context to save the token

        // Navigate to home page (logged in)
        history("/home");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred. Please try again.");
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
            Signup Page
          </h1>
        </div>
        <div
          style={{
            height: "15vh",
            width: "50vw",
            paddingLeft: "10vw",
            paddingRight: "10vw",
            fontFamily: "Manrope",
          }}
        >
          <Input
            type="email"
            variant="underlined"
            label="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div
          style={{
            height: "15vh",
            width: "50vw",
            paddingLeft: "10vw",
            paddingRight: "10vw",
            fontFamily: "Manrope",
          }}
        >
          <Input
            type="text"
            variant="underlined"
            label="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div
          style={{
            height: "15vh",
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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
                history("/"); // Navigate to the login page if already registered
              }}
              variant="light"
            >
              Already Registered?
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
              Signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
