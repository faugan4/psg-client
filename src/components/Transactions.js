import React, { useState,useEffect } from 'react'
import {useSelector} from 'react-redux';
import {selectTransactions} from "../features/counterSlice";
import {auth} from "../firebase_file";
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';

function Transactions() {
    const [data,setData]=useState([]);
    const t=useSelector(selectTransactions)
    useEffect(()=>{
        const email=auth?.currentUser.email;
        const res=t.filter((item)=>{
            return item.user==email;
        })
        const res2=[];
        res.map((item)=>{
            let d={...item};
            let date=d.date?.seconds;
            if(date!=undefined){
                let str_date=new Date(date*1000).toUTCString();
                str_date=str_date?.split(" ");
                str_date=str_date[0]+" "+str_date[1]+" "+str_date[2]+ " "+str_date[3];
                d.date=str_date;
                let entry=d.entry;
                
                if(entry.indexOf("-")>=0){
                    d.type=0;
                }else{
                    d.type=1;
                }
                entry=entry.replace("-","");
                d.entry=entry;
                res2.push(d);
            }
            
        })
        setData(res2);
    },[t]);

    return (
        <div>
           {
               data.map((item)=>{
                   //const date=item.data?.seconds;
                   //let str_date=new Date(date*1000).toUTCString();
                   return(
                       <div key={item.key} className="transaction" style={{
                           display:"flex",
                           justifyContent:"space-between",
                           alignItems:"center",
                           padding:"1rem",
                           marginTop:"0.5rem",
                       }}>
                           <p>{item.date}</p>
                           <p>{item.entry} Coins</p>
                          {item.type==0 && <TrendingDownIcon style={{color:"red"}} /> }
                          {item.type==1 && <TrendingUpIcon  style={{color:"green"}}/> }
                       </div>
                   );
               })
           }
        </div>
    )
}

export default Transactions
