import { Avatar } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { selectGames, selectSelectedPlayer,setSelectedPlayer } from "../features/counterSlice";
import { auth } from "../firebase_file";
import HeaderBack from "./HeaderBack";

const PlayerPicks=()=>{
    const history=useHistory();
    const dispatch=useDispatch();
    const p=useSelector(selectSelectedPlayer);
    const g=useSelector(selectGames);
    //console.log("the player is ",p);
    const [player,setPlayer]=useState(p);
    const [email,setEmail]=useState("");
    const [started,set_started]=useState(p.started);
    const [closed,set_closed]=useState(p.closed);
    

    const [photo,setPhoto]=useState(<Skeleton variant="circle" width={40} height={40} /> );

   

    useEffect(()=>{
        
       setPlayer(p);
       setEmail(p.user);
       const photo=p?.detail?.photo;
       const username=p?.detail?.username;
        if(photo=="foo.jpg"){
            setPhoto(<Avatar style={{width:"3rem",height:"3rem",borderRadius:"50%"}}>
                {username[0]?.toLowerCase()}</Avatar>);
        }else{
            setPhoto(<img src={photo} style={{width:"3rem",height:"3rem",borderRadius:"50%"}}/>);
        }

      

    },[p])

    const go_to_profil=(player)=>{
        dispatch(setSelectedPlayer(player));
       history.push("/player-profile");
    }
    return (
        <div className="player_picks">
            <HeaderBack title_redux={true}></HeaderBack>
           
            <div className="player_picks_body">
                <div className="player_picks_body_sub_head">
                    <h1>Picks</h1>
                    <div>
                        <button onClick={go_to_profil.bind(this,player?.detail)}>
                           {photo}
                            <p>{player && player?.detail?.username}</p>
                        </button>
                    </div>
                    
                </div>
           
                {
                    player?.picks?.map(({id_game,pickdata,team_picked,teams,type_pick},i)=>{
                        
                        let odd_home="";
                        let str_type="";
                        let str_total="";
                        let odd_away="";
                        pickdata=pickdata.split(",");
                       
                        if(type_pick=="1"){
                            str_type="ML";
                            odd_away=pickdata[0];
                            odd_home=pickdata[1];
                        }else if(type_pick=="2"){
                            str_type="Spread";
                            odd_away=pickdata[2];
                            odd_home=pickdata[3];
                        }else{
                            if(team_picked=="1"){
                                str_type="Over";
                            }else{
                                str_type="Under";
                            }
                            odd_away=pickdata[4];
                            odd_home=pickdata[5];
                            str_total="T="+pickdata[6];
                        }

                        let home_picked="";
                        let away_picked="";
                        let total_picked="";
                        if(team_picked=="1"){
                            if(type_pick=="1" || type_pick=="2"){
                                away_picked="picked";
                            }else{
                                total_picked="Over";
                            }
                        }else{
                            if(type_pick=="1" || type_pick=="2"){
                                home_picked="picked";
                            }else{
                                total_picked="Under";
                            }
                        }
                        
                       if(auth.currentUser.email!=email){
                            if(closed==false){
                                home_picked="";
                                away_picked="";
                                if(type_pick=="3"){
                                    str_type="Total";
                                }
                            }
                           
                       }

                       let home_score="";
                       let away_score="";

                       const res=g.filter((item)=>{
                           return item.key==id_game;
                       })
                       if(res.length>0){
                            home_score=res[0].home_score;
                            away_score=res[0].away_score;
                            if(home_score!=""){
                                home_score="("+home_score+")";
                            }
                            if(away_score!=""){
                                away_score="("+away_score+")";
                            }
                           
                       }
                       //console.log("id_game",res);
                        return(
                            <div className="a_pick" key={i}>
                                <div>
                                    <p className={away_picked}>{teams?.[0]} {away_score} </p>
                                    <p>{odd_away}</p>
                                </div>
                                <div>
                                    <p>{str_type}</p>
                                    <p>{str_total}</p>
                                </div>
                                <div>
                                    <p className={home_picked}>{teams?.[1]} {home_score}</p>
                                    <p>{odd_home}</p>
                                </div>
                            </div>
                        );
                    })
                }

            </div>
        </div>
    );
}
export default PlayerPicks;