import React, { useState,useEffect } from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Start from "./Start";

import { useDispatch, useSelector } from "react-redux";
import { selectGames, selectLeagues, selectPicks, selectSports,
     selectTournaments, setSelectedTournament, setSinglePageName,selectSelectedPlayer } from "../features/counterSlice";
import { challenged_closed, icons } from "../functions";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {db,auth} from "../firebase_file";
import { useHistory } from "react-router-dom";

const LockerRoom = ({userInfo}) => {
    const [stats,setStats]=useState([]);
    const dispatch=useDispatch();
    const history=useHistory();
    const classes = useStyles();

    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const tournaments=useSelector(selectTournaments);
    const picks=useSelector(selectPicks) ;
    const gm=useSelector(selectGames);

    const [sports,setAll_sports]=useState([]);
    const [leagues,setAll_leagues]=useState([]);

    const [selected_sport,setSelected_sport]=useState(0);
    const [selected_league,setSelected_league]=useState(0);
    const [selected_mode,setSelected_mode]=useState(0);
    const p=useSelector(selectSelectedPlayer);

    
    const [play_type,setPlay_type]=useState(0);
    const [entry,setEntry]=useState(0);

    const [games,setAll_games]=useState([])
    

    useEffect(()=>{
        setAll_sports(s);
    },[s]);

    useEffect(()=>{
        setAll_leagues(l);
    },[l])

    useEffect(()=>{
        const res=l.filter((i)=>{
            return i.id_sport==selected_sport;
        })
        setAll_leagues(res);
    },[selected_sport]);
    const sport_clicked=(id_sport)=>{
       const btns=document.querySelectorAll(".games_sports>button");
       btns.forEach((btn)=>{
           btn.classList.remove("active");
       })
       const btn=document.querySelector("button[data-idSport='"+id_sport+"']");
       btn.classList.add("active");
       setSelected_sport(id_sport);
       setSelected_league(0);
    }

    const set_play_type=(entry)=>{
        setPlay_type(entry);
        const btns=document.querySelectorAll(".games_btns_free_money > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })

        btns[entry].classList.add("active");
    }

    const set_entry=(index,entry)=>{
        const btns=document.querySelectorAll(".games_btns_entries>button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        btns[index].classList.add("active");
        setEntry(entry);
    }

    const [loading_game,set_loading_game]=useState(true);

    

    const go_to_tournament=(key,game_started,closed)=>{
        const t= tournaments.filter((line)=>{
            return line.key==key;
        })
        if(t.length>0){
            const selected_t=t[0];
            const el={...selected_t,closed,started:game_started};
            dispatch(setSelectedTournament(el));
            dispatch(setSinglePageName(el.name));
            history.push("/challenge");
            
        }
    }

    const [empty,setEmpty]=useState(true);
    const [alerte,set_alerte]=useState("alerte");
    useEffect(()=>{
        const res=tournaments.filter((item)=>{
            return item.challenge_results!=undefined;
        });

        
        const email=p.email;
        
        const res2=res.filter((item)=>{
            const winners=item.wins;
            let played=false;
            winners.map((winner)=>{
                if(winner.user==email){
                    played=true;
                }
            })
            return played;
        })
        setAll_games(res2);
        set_alerte("");
    },[tournaments,p]);

    const [type,set_type]=useState(1);
    const [games_show,set_games_show]=useState([]);
    const [wins,set_wins]=useState(0);
    const [loses,set_loses]=useState(0);
    const [ties,set_ties]=useState(0);

    useEffect(()=>{
       const res=games.filter((item)=>{
           return item.type==type;
       });
       const email=p.email;
       let ws=0;
       let ls=0;
       let ts=0;
      const res2= res.map((item)=>{
          const line={...item};
           const winners=item.winners;
           const players=item.wins;
           let win=false;
            winners.map((winner)=>{
                if(winner.user==email){
                    win=true;
                }
            })

            if(win==false){
                line.win=0;
                ls++;
            }else{
                if(winners.length==players.length){
                    line.win=2;
                    ts++;
                }else{
                    line.win=1;
                    ws++;
                }
            }

            return line;
       })
       set_wins(ws);
       set_loses(ls);
       set_ties(ts);
       //console.log("item row",res2,ws,ls,ts);
       set_games_show(res2);
    },[type,p]);

    return (
        <div className="lockerRoom">
            

             {games.length==0 && <Start userInfo={userInfo} />}
            
            <div className="new_select">
             <Select
          labelId="demo-simple-select-label2"
          id="demo-simple-select2"
          value={type}
          onChange={e=>set_type(e.target.value)}
          
        >
          <MenuItem value={1}>One-on-One</MenuItem>
          <MenuItem value={2}>Heads Up</MenuItem>
          <MenuItem value={3}>Sports Booth</MenuItem>
          

         
        </Select>
        </div>


            <div className="lockerroom_stats">
                <div>
                    <p>{wins}</p>
                    <p>Wins</p>
                </div>
                <div>
                    <p>{loses}</p>
                    <p>Loses</p>
                </div>
                <div>
                    <p>{ties}</p>
                    <p>Ties</p>
                </div>

            </div>
            <div className="games_body">
            
            {
                
                games_show.map((row) => {
                    
                    const row_sport=row.sport;
                    const row_league=row.league;
                    const row_mode=row.mode;
                    let league_name="";
                    league_name=l.filter((lg)=>{
                        return lg.id==row_league;
                    })[0]?.name;

                    ////console.log("showing ",selected_sport,selected_league,selected_mode,row_mode);

                    let can_show=true;
                    if(selected_sport!=0 && selected_sport!=row_sport){
                        can_show=false;
                    }

                    if(selected_league!=0 && selected_league!=row_league){
                        can_show=false;
                    }

                    if(selected_mode!=0 && selected_mode!=row_mode){
                        can_show=false;
                    }
                    //console.log("we can still show it here")
                   if(can_show==false){
                       return null;
                   }
                   //console.log("x we can still show it here")
                   

                   const key=row.key;
                  
                   
                   const res=picks.filter((pick)=>{
                       return pick.id_challenge==key;
                   })

                  

                   

                   let user_made_picks=false;
                   res.forEach((r)=>{
                      if(r.user==auth?.currentUser.email){
                          user_made_picks=true;
                      }
                   })

                   let challenged=row.challenged;
                   ////console.log("challenged is ",row.challenged);
                   ////console.log("the key is ",key, "and the result is ",res.length);

                   /*if(user_made_picks==false){
                       if(challenged){
                        //console.log("this is a challenge ",row.friend,auth?.currentUser.email)
                        if(row.friend!=auth?.currentUser.email){

                            if(row.user!=auth?.currentUser.email){
                                //console.log(" i am the not the freind",row.user)
                        
                                return null;
                            }
                            
                        }else{
                            //console.log("i am the one that is invided")
                        }
                       }else{
                        return null;
                       }
                       
                   }*/

                  
                   const nb_player=res.length;
				   if(nb_player==0 && challenged==false){
					   return null;
				   }
                   
                   const fee=row.fee;
                   let winning=0;
                   if(fee==0){
                        winning=100;
                   }else{
                        winning=parseInt(fee)*nb_player;
                   }
				   
				    let str_player="";
				   const type=row.type;
				   if(type=="1"){
					   return null;
				   }
				   
				   if(type=="2"){
					   str_player=nb_player+"/2";
				   }else if(type=="3"){
					   str_player=nb_player+"/10";
				   }else if(type=="5"){
                        str_player=nb_player+"/"+(row.friend?.length+1);
				   }else{
                        str_player=nb_player;
                   }

                   

                   let {closed,game_started}=challenged_closed(key,type,nb_player,res,gm);
                   

                  

                   let icon_name=null;
                   const res_icon=icons.filter((icon)=>{
                       return icon.id==row_sport;
                   })
                   if(res_icon.length>0){
                       icon_name=res_icon[0].icon;

                   }

                   if(empty==true){
                    setEmpty(false);
                    }
                    //console.log("the search row=",row.challenge_results,row.date?.seconds);

                    if(row.challenge_results!=undefined){
                        //return null;
                    }
                    //console.log("row= for this one is",row);
                    /*<TableRow key={row.key} className={
                         row.win=="0"?"tr_lose":
                         row.win=="1"?"tr_win":"tr_tie"
                     }>
                    <TableCell component="th" scope="row">
                    <p style={{display:"flex",alignItems:"center",gap:"0.5rem",color:"indianred"}}>
                           {icon_name} {league_name} w={row.win}
                           
                        </p>
                    </TableCell>
                    <TableCell align="right">{row.nb_game}</TableCell>
                    <TableCell align="right">{winning}</TableCell>
                    <TableCell align="right">{str_player}</TableCell>
                    <TableCell align="right">
                        <button
                            onClick={go_to_tournament.bind(this,row.key,game_started,closed)}
                        className="btn_open_challenge">
                            {closed==false? "View": "View"} 
                        </button>
                        </TableCell>
                    
                    </TableRow>*/

                    let date=new Date(row.date?.seconds*1000).toUTCString();
                    date=date.split(" ");
                    date=date[1]+"-"+date[2]+"-"+date[3];
                    const sp=row.sport;
                    const sn=s.filter((item)=>{
                        return item.id==sp;
                    })[0]?.name;
                    let str_fee="";
                    if(row.fee=="0"){
                        str_fee="Free";
                    }else{
                        str_fee=row.fee+" Coins";
                    }

                    let str_win="";
                    let cl_win=""
                    if(row.win==0){
                        str_win="Lost"
                        cl_win="ch_lost";
                    }else if(row.win==1){
                        str_win="Winner"
                        cl_win="ch_win";
                    }else if(row.win==2){
                        str_win="Tie";
                        cl_win="ch_tie";
                    }
                    //console.log("going to show games ");
                     return (

                    <div className="today_games_game" key={row.key}>
                        <div className="today_game_top">
                            <button className="game_name_icon">
                                {icon_name}
                                <span style={{color:"black",fontWeight:"bold"}}>{league_name}</span> 
                                
                            </button>
                            <div style={{
                                display:"flex",
                                gap:"0.5rem",
                                alignItems:"center",
                            }}>
                               
                                <button className="btn_entry">{str_fee}</button>
                            </div>
                            
                            
                        </div>
    
                        <div className="today_game_center">
                            <div>
                                <p>{date}</p>
                                <p>Date</p>
                            </div>
                            <div>
                                <p>{sn}</p>
                                <p>Game</p>
                            </div>
                            <div> 
                                <p>Ended</p>
                                <p>State</p>
                            </div>
                            
                        </div>
                        <div className="">

                            
                            
                            <button className={cl_win}>{str_win}</button>
                               
                           
                           {
                           user_made_picks==true && <button className="btn_view_challenge" 
                             onClick={go_to_tournament.bind(this,row.key,game_started,closed)}
                            >View</button>
                            }
                           
                        </div>
                  </div>
                     )


                })
                
                }
            
            </div>

            
        </div>
    )
}


const useStyles = makeStyles({
    table: {
      maxWidth: "100%",
    },
    empty:{
        display:"flex",
        flexDirection:"column",
        gap:"0.5rem",
        alignItems:"center",
        "& > h1":{
            fontSize:"1.1rem"
        },
        " & > p":{
            fontSize:"0.9rem",
            textAlign:"center",
            fontWeight:"600",
            color:"black",
        },
        "& > button":{
            width:"100%",
            padding:"1rem",
            border:"none",
            outline:"none",
            cursor:"pointer",
            backgroundColor:"indianred",
            color:"white",
            fontWeight:"500",
            marginTop:"0.5rem",
            marginBottom:"0.5rem",
        },
        "& > .p_gray":{
            color:"gray",
            fontWeight:"400"
        }
    }
  });

export default LockerRoom
