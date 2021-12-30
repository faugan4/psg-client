import { useState } from "react";
import { useDispatch } from "react-redux";
import { setActiveTab, setPage } from "../features/counterSlice";
import { auth, db } from "../firebase_file";
import logo from "./img/logo.png";
import firebase from 'firebase';
import { useHistory } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
const useStyles=makeStyles({
    input:{
        color:"white"
    }
});
const SignIn=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [loading,setLoading]=useState(false);
    const [alerte,setAlerte]=useState("");

    const login=async ()=>{
        if(username===""){
            setAlerte("Please enter your username");
            return;
        }
        if(email===""){
            setAlerte("Please enter your email");
            return;
        }
        if(password===""){
            setAlerte("Please enter your password");
            return;
        }
        setAlerte("Please wait...");
        setLoading(true);
        try{
            await auth.createUserWithEmailAndPassword(email,password);
           await  auth.currentUser.updateProfile({
                displayName:username
            })
            await db.collection("psg_users").add({
                email,
                password,
                photo:"foo.jpg",
                coins:"5000",
                date:firebase.firestore.FieldValue.serverTimestamp(),
                wins:"0",
                loses:"0",
                status:"clown",
                streak:"0",
                last_10:"0",
                last_200:"0",
                ties:"0",
                username,
                win_per:"0.00"
            })
            dispatch(setPage(3))
            dispatch(setActiveTab(4));
            history.replace("/");
        }catch(e){
            setLoading(false);
            setAlerte(e.mesage);
        }
        
    }

    const signin=()=>{
        dispatch(setPage(1));
        history.push("/login");
    }

    const styles=useStyles();
    return (
        <div className="login">
        <img src={logo} alt="logo" />
        <h1>ProSport Guru Inc.</h1>
        <div className="login__form">
            <div>
                <TextField label="User Name" autoFocus value={username}
                 onChange={e=>setUsername(e.target.value)}
                 InputProps={{
                    className:styles.input
                }}
                InputLabelProps={{
                    className:styles.input
                }}
                 />
                
            </div>

            <div>
                <TextField
                InputProps={{
                    className:styles.input
                }}
                InputLabelProps={{
                    className:styles.input
                }}
                label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)}  />
            </div>

            <div>
                <TextField 
                InputProps={{
                    className:styles.input
                }}
                InputLabelProps={{
                    className:styles.input
                }}
                label="Password" type="password"  value={password} onChange={e=>setPassword(e.target.value)}  />
            </div>

            <button disabled={loading} onClick={login}>CREATE ACCOUNT</button>
            <p className="alerte">{alerte}</p>

            <div className="login_create_account">
                <button onClick={signin}>LOG IN WITH YOUR ACCOUNT</button>
            </div>
            
        </div>
    </div>
    );
}

export default SignIn;