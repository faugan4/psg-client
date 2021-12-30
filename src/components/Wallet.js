import React, {useState,useEffect} from 'react';
import HeaderBack from "./HeaderBack"
import {makeStyles} from '@material-ui/core/styles';
import { db,auth } from '../firebase_file';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StripeCheckout from 'react-stripe-checkout';
import axios from "axios";
import Transactions from './Transactions';
import MoneyIcon from '@material-ui/icons/Money';
const Wallet = () => {
    const styles=useStyles();
    const [coins,set_coins]=useState(0);
    const [input,set_input]=useState(0);
    const [dollars,set_dollars]=useState(0);

    useEffect(()=>{
        const email=auth?.currentUser?.email;
        if(email==undefined){
            return;
        }
       
        const unsub=db.collection("psg_users_coins").where("user","==",email).onSnapshot((snap)=>{
            let total_coins=5000;
            snap.docs.map((doc)=>{
                const coins=parseInt(doc.data().entry);
                total_coins+=coins;
                
            })
            set_coins(total_coins);
        });

        return unsub;
    },[]);

    useEffect(()=>{
        if(coins<=0){
            set_dollars(0);
            return;
        }
        let res=coins/1000;
        set_dollars(res);
    },[coins]);
    const [index,set_index]=useState(0);
    const setIndex=(i)=>{
        set_index(i);
    }

    const handle_token=async (token)=>{
       const res=await axios.post("https://psgserver.herokuapp.com/deposite",{token});
      
       const {status}=res.data;
       if(status=="success"){
           alert("ok for deposit");
       }else{
           alert("error for deposit")
       }
       
    }

    const [amount,set_amount]=useState(0);
    useEffect(()=>{
        set_amount(parseFloat(input)*100/1000)
    },[input]);
    return (
        <div>
            <HeaderBack title_redux={false} title="My Wallet" />
            <div className={styles.container}>
                <div className={styles.top}>
                    <p>Total Value (Coins)</p>
                    <div>
                        <h2>{coins}</h2>
                        
                    </div>
                </div>
                <div className={styles.btns}>
                    <button className={index==0? "active":""} onClick={setIndex.bind(this,0)}>Deposite</button>
                    <button className={index==1? "active":""} onClick={setIndex.bind(this,1)}>Withdraw</button>
                    <button className={index==2? "active":""} onClick={setIndex.bind(this,2)}>Transactions</button>
                </div>

                {(index==0 || index==1) && <div style={{
                    paddingTop:"1rem",
                    display:"flex",
                    alignItems:"cener",
                    }}>
                <Grid container spacing={1} alignItems="flex-end">
                    <Grid item>
                    <MoneyIcon />
                    </Grid>
                    <Grid item>
                    <TextField 
                    value={input}
                    onChange={e=>set_input(e.target.value)}
                    id="input-with-icon-grid" type="tel" label="Input the amount in coins" />
                    </Grid>
                </Grid>

                <StripeCheckout 
                stripeKey="pk_test_51JlXszFKx5RAob24QpZEI3Gz4U65S3969URS4PrFJqoSl0NjsrEafEstEnrxTx3DIZCn1lDRvw0ErsGFnM8P144w00WcB90lds"
                token={handle_token}
                amount={amount}
                name="Deposite"
                currency="USD"
                locale="en"
                description="Reload your account now with coins" // the pop-in header subtitle
                image="https://cdn2.vectorstock.com/i/1000x1000/29/86/golden-coins-piles-or-money-bank-gold-coin-heaps-vector-17452986.jpg"
                shippingAddress={false}
                billingAddress={false}
                email={auth?.currentUser.email}
                >
                    <button style={{
                        height:"100%",
                        padding:"0 1rem",
                        border:"none",

                }}>Confirm Now</button>
                    </StripeCheckout>
                </div>}

                {
                    index==2 && <Transactions />
                }
            </div>
            
        </div>
    )
}

export default Wallet

const useStyles = makeStyles({
    container:{
        padding:"1rem"
    },
    top:{
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        marginBottom:"3rem",
        
        "& > p":{
            color:"gray"
        },
        "& > div":{
            display:"flex",
            alignItems:"center",
            gap:"1rem",
            borderTop:"3px solid whitesmoke",
            "& >*":{
                marginTop:"0.5rem"
            }
        }
    },

    btns:{
        display:"flex",
        alignItems:"center",
        gap:"1rem",
        marginTop:"1rem",

        "& > button":{
            flex: 1,
            padding:"1rem",
            display:"flex",
            justifyContent:"center",
            fontWeight:"600",
            color:"gray",
            border:"none",
            outline:"none",
            borderRadius:"5px",

            "&.active":{
                backgroundColor:"indianred",
                color:"white"
            }
        }
    }
})
