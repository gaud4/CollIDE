import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"


function Login() {

    const history=useNavigate();

    // const [email,setEmail]=useState('')
    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e){
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
        <div className="login">

            <h1>Login</h1>

            <form action="POST">
                <input type="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username/Email"  />
                <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
                <input type="submit" onClick={submit} />

            </form>

            <br />
            <p>OR</p>
            <br />

            <Link to="/signup">Signup Page</Link>

        </div>
    )
}

export default Login