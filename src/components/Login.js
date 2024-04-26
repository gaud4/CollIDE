import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import backgroundImage from '../image.png';
import {Button, Input} from "@nextui-org/react";

function Login() {

    const history=useNavigate();

    // const [email,setEmail]=useState('')
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')

    async function submit(e) {
        e.preventDefault();

        try{

            await axios.post("http://localhost:8000/",{
                username,password
            })
            .then(res=>{
                if(res.data=="exist"){
                    history("/home")    //history("/home",{state:{id:email}})
                }
                else if(res.data=="notmatch"){
                    alert("Wrong Password")
                }
                else if(res.data=="notexist"){
                    alert("User does not exist")
                }
            })
            .catch(e=>{
                alert("Invalid Details")
                console.log(e);
            })

        }
        catch(e){
            console.log(e);

        }

    }

    return (
        <div style={{ backgroundImage: `url(${backgroundImage})`, height: "100vh", width: "100vw"}}>
            <div style={{height: "100vh", width: "100vw", paddingLeft: "25vw", paddingRight: "25vw", paddingTop: "10vh", paddingBottom: "10vh"}}>
                <div style={{height: "20vh", width: "50vw"}}>
                    <h1 style={{fontFamily: "Manrope", fontSize: 55, textAlign: "center", display: "grid", placeItems: "center"}}>
                        Login Page
                    </h1>
                </div>
                <div style={{height: "20vh", width: "50vw", paddingLeft: "10vw", paddingRight: "10vw", fontFamily: "Manrope"}}>
                    <Input 
                        type="username" 
                        variant="underlined" 
                        label="Username/Email" 
                        onChange={(e) => { setUsername(e.target.value) }}

                    />
                </div>
                <div style={{height: "20vh", width: "50vw", paddingLeft: "10vw", paddingRight: "10vw", fontFamily: "Manrope"}}>
                    <Input 
                        type="password" 
                        variant="underlined" 
                        label="Password" 
                        onChange={(e) => { setPassword(e.target.value) }}

                    />
                </div>
                <div style={{display: "flex"}}>
                    <div style={{height: "20vh", width: "25vw", paddingLeft: "10vw", paddingRight: "10vw", fontFamily: "Manrope"}}>
                        <Button color="success" onClick={() => { window.location.href = "/signup"; }} variant="light">
                            Register Today!
                        </Button> 
                    </div>
                    <div style={{height: "20vh", width: "25vw", paddingLeft: "10vw", paddingRight: "10vw", fontFamily: "Manrope"}}>
                        <Button color="success" onClick={submit} variant="light">
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        // <div className="login">

        //     <h1>Login</h1>

        //     <form action="POST">
        //         <input type="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username/Email"  />
        //         <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
        //         <input type="submit" onClick={submit} />

        //     </form>

        //     <br />
        //     <p>OR</p>
        //     <br />

        //     <Link to="/signup">Signup Page</Link>

        // </div>
    )
}

export default Login