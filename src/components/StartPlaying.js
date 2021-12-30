import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectStartPlaying, selectTournaments, setSelectedTournament, setSinglePageName } from '../features/counterSlice';
import Challenge from './Challenge';
import HeaderBack from './HeaderBack'

const StartPlaying = () => {

    const dispatch=useDispatch();
    const history=useHistory();
   
    const type=useSelector(selectStartPlaying);
    const t=useSelector(selectTournaments);
    const [title,setTitle]=useState("");
    const [data,setData]=useState([]);
    const [data_type,setData_type]=useState(0);

    useEffect(()=>{
        setData_type(type);
        if(type=="1"){
            setTitle("Start a mission");
        }else if(type=="2"){
            setTitle("Start a heads up");
        }else if(type=="3"){
            setTitle("Start a sports booth");
        }else if(type=="4"){
            setTitle("Start a tournament");
        }
    },[type]);

    useEffect(()=>{
        const res=t.filter((item)=>{
            return item.type==data_type;
        })
        setData(res);
    },[t,data_type]);

    
    const view_challenge=async (key)=>{
        const t2= t.filter((line)=>{
             return line.key==key;
         })
         if(t2.length>0){
             const selected_t=t2[0];
             dispatch(setSelectedTournament(selected_t));
             dispatch(setSinglePageName(selected_t.name));
             history.push("/challenge");
         }
     }

    return (
        <div className="startPlaying">
            <HeaderBack title_redux={false} title={title}></HeaderBack>
            {
                data.map((item)=>{
                    return (
                        <div  key={item.key} style={{
                            padding:"1rem"
                        }}>
                        <Challenge 
                        tournament={item} 
                        btnText="View" 
                        btnClick={view_challenge.bind(this,item.key)}
                        detail={false}
                        share_challenge={null}
                        
                    />
                    </div>
                    );
                })
            }

            {
                data.length==0 && <div className="no_records"><p style={{padding:"1rem"}}>No records founds!</p></div>
            }
        </div>


    )
}

export default StartPlaying
