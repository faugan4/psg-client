import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectLeagues, selectSports,selectPicks ,selectChallengeDate} from '../features/counterSlice';
import { auth, db } from '../firebase_file';
import ShareIcon from '@material-ui/icons/Share';

import { icons } from "../functions";



const Challenge=({tournament,btnText,btnClick,detail,share_challenge,closed,started})=>{
    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const picks=useSelector(selectPicks);
    const selected_date=useSelector(selectChallengeDate);

    const [sports,setAll_sports]=useState([]);
    const [leagues,setAll_leagues]=useState([]);
    const [seated,setSeated]=useState("0");
    const [date,setDate]=useState("");
    const [joined,setJoined]=useState(false);
    const [new_text_btn,setNew_text_btn]=useState(btnText);
    const [icon,setIcon]=useState(null);
    const [entry,set_entry]=useState("");
    const [type,set_type]=useState("");
    const [mode,set_mode]=useState("");
    const [nb_game,set_nb_game]=useState(0);
    const [ch_date,set_ch_date]=useState("");
    

    
    
    useEffect(()=>{
        let sd=new Date().toUTCString();
        if(selected_date!=""){
            sd=selected_date.toUTCString();
        }
        sd=sd.split(" ");
        sd=sd[1]+" "+sd[2]+" "+sd[3];
        set_ch_date(sd);

    },[selected_date]);

    useEffect(()=>{
        setAll_sports(s);
    },[s]);

    useEffect(()=>{
        setAll_leagues(l);
    },[l]);

    useEffect(()=>{
       ////console.log(tournament);
       if(tournament.key==undefined){
           //console.log("tournamet is null");
           return;
       }


       const id_sport=tournament.sport;
       const res=icons.filter((sport)=>{
           return sport.id==id_sport;
       });
       //console.log(res);
       if(res.length>0){

           setIcon(res[0].icon);
       }

       var date=new Date(tournament.z_data[0].date*1000).toUTCString(); 
       date=date.split(" ");
       date=date[1]+" "+date[2]+" "+date[3];
       setDate(date);

       if(tournament.type=="2"){
           set_type("Heads Up");
       }else if(tournament.type=="3"){
           set_type("Sport Booth");
       }else if(tournament.type=="1"){
           set_type("Mission");
       }else{
           set_type("Tournament");
       }

       if(tournament.mode=="1"){
           set_mode("Most Wins");
       }else{
           set_mode("Streak");
       }

       if(tournament.entry=="0"){
           set_entry("Free");
       }else{
           set_entry(tournament.entry+" Coins");
       }

       set_nb_game(tournament.number_game);
       
       const res3=picks.filter((pick)=>{
           return pick.id_challenge==tournament?.key;
       })
       setSeated(res3.length);
       
       const res2=res3.filter((item)=>{
           return item.user==auth.currentUser.email;
       })
       if(res2.length>0){
           setJoined(true)
       }else{
           setJoined(false);
       }
       
      
    },[tournament]);

    useEffect(()=>{
        if(btnText=="Join"){
            if(joined){
                setNew_text_btn("Joined");
            }
        }
    },[joined]); 
    //console.log("the url is ",tournament.url);

    return(<div className="lobby__tournament">
            {(tournament.url!=null && tournament.url!="") && 
            <img src={tournament.url} className="tournament_image" alt=""/>}
            
    <div className="tournament_row_one">
        <div className="lobby__tournament__sport">
            {icon}
            <p>
                {
                leagues.filter((el)=>{
                    return el.id==tournament.league;
                })[0]?.name
                }
            </p>
        </div>
        <p>{tournament.name}</p>
    </div>
    <div className="tournament_row_two">
        <div>
            <p>{ch_date}</p>
            <p>Date</p>
        </div>

        <div>
            <p>
            {
                sports.filter((el)=>{
                    return el.id==tournament.sport;
                })[0]?.name
                }
            </p>
            <p>Sport</p>
        </div>

        <div>
            <p>{seated}</p>
            <p>Seated</p>
        </div>

        <div>
            <p>{(closed==true || started==true) && "Closed"}</p>
            <p>{(closed==false &&  started==false) && "Open"}</p>
            <p>State</p>
        </div>
    </div>
    <div className="tournament_row_three">
        
        <div style={{display:"flex",flex:1,justifyContent:"space-between"}}>
            <div className="challenge_detail">
                <p>{entry}</p>
                <p>Entry</p>
            </div>
            <div className="challenge_detail">
                <p>{type}</p>
                <p>Type</p>
            </div>
            <div className="challenge_detail">
                <p>{mode}</p>
                <p>Mode</p>
            </div>
            <div className="challenge_detail">
                <p>{nb_game}</p>
                <p>#Games</p>
            </div>
        </div>

       
       
    </div>
    <div className="tournament_row_three">
        {
            
            detail==true && closed==false? <button onClick={share_challenge}>
                <ShareIcon /></button>:<div></div>
        }
        {
            (closed==false && started==false) &&  
            <button onClick={btnClick} className={`${new_text_btn}`} data-joined={joined}>
                {new_text_btn} 
            </button>
        }
    </div>

    </div>);
}

export default Challenge;