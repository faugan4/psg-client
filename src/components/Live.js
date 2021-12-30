import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGames,selectChallengeDate, selectLeagues, selectPicks, selectSports, selectTournaments, setSelectedTournament, setSinglePageName } from "../features/counterSlice";
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

import GameLine from "./GameLine";
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
 
  
const Live=()=>{
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

    useEffect(()=>{
        set_loading_game(true);
        
        set_loading_game(false);
        setAll_games(tournaments);
    },[selected_sport,tournaments]);

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

    const [live_picks,set_live_picks]=useState([]);
    useEffect(()=>{
        const my_email=auth?.currentUser.email;
        const res=picks.filter((pick)=>{
            return pick.user==my_email;
        })

        const res2=res.filter((item)=>{
            return item.results==undefined || item.results==null || item.results?.length==0;
        })
        set_live_picks(res2);
    },[picks]);

    const share_app=async ()=>{
        try{
            await navigator.share({
                 title:"Share ProSport Guru App with friends",
                 url:"https://prosport-guru.web.app",
                 text:"Let's use ProSport Guru, a simple and secure App to earn money and having fun at same time"
             })
             //console.log("share successful")
        }catch(err){
            //console.log(err);
        }
     }
   
     let cpt=0;
    
     const scd=useSelector(selectChallengeDate);
     const [calenda,set_calenda]=useState(scd);
     useEffect(()=>{
        set_calenda(scd);
     },[scd]);
    
    return(
        <div className="lives">
            
          
            

            

            <div className="games_body" style={{paddingTop:"0"}}>
            {/*live_picks.length>0 && <DatePicker getSelectedDay={selectedDay}
                    endDate={100}
                    selectDate={calenda}
                    labelFormat={"MMMM"}
                    color={"black"}  
                           
                />
                
                
                 <div style={{marginBottom:"2rem"}} />
                 */
                }
               
              
                {
                
                games.map((row) => {

                   
                    
                    const row_sport=row.sport;
                    const row_league=row.league;
                    const row_mode=row.mode;
                    let league_name="";
                    league_name=l.filter((lg)=>{
                        return lg.id==row_league;
                    })[0]?.name;

                    //console.log("showing ",selected_sport,selected_league,selected_mode,row_mode);

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
                   if(can_show==false){
                       return null;
                   }

				  // console.log("i am here");
                   

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
                  // console.log("challenged is ",row.challenged);
                   ////console.log("the key is ",key, "and the result is ",res.length);

                   if(user_made_picks==false){
                       if(challenged){
                        console.log("this is a challenge ",row.friend,auth?.currentUser.email,row.key,row.user)
                        if(row.friend.indexOf(auth?.currentUser.email)<0){

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
                       
                   }
				   
				  // console.log("ok man i pass thi step")

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
                    console.log("the search row=",row.challenge_results,row.date?.seconds);

                    if(row.challenge_results!=undefined){
                        return null;
                    }
                   

                    let ch_date=new Date(row.date?.seconds*1000).toUTCString();
                    ch_date=ch_date.split(" ");
                    ch_date=ch_date[1]+" "+ch_date[2]+" "+ch_date[3];
                    let calenda_date=calenda;
                    calenda_date=calenda_date.toUTCString();
                    calenda_date=calenda_date.split(" ");
                    calenda_date=calenda_date[1]+" "+calenda_date[2]+" "+calenda_date[3];
                    //console.log(ch_date,calenda_date);
					
					console.log("bus stop",ch_date,calenda_date);
                    if(ch_date!=calenda_date){
                        return null;
                    }

                    cpt++;

                    return <GameLine 
                    go_to_tournament={go_to_tournament.bind(this,row.key,game_started,closed)}
                    icon_name={icon_name}
                    name={row.name}
                    league_name={league_name}
                    nb_game={row.nb_game}
                    winning={winning}
                    str_player={str_player}
                    show_play_btn={false}
					fee={row.fee}
					type={type}
                   />
                   

                    
                })
                
                }

               
                

            {
                loading_game==false && cpt==0 && 
                
                <div  className={classes.empty}>
                    {/*<h1>Invite your friends</h1>
                    <p>ProSport Guru is more fun with friends. Use the button bellow to invite them.</p>
                    <button onClick={share_app}>INVITE A FRIEND</button>
                    <p className="p_gray">Challenge your friends to start having fun and earning money.</p>
            */}
                    <p style={{textAlign:"center"}}>No records founds!</p>
                </div>
            }
           
            </div>
         
        </div>
    );
}

const useStyles = makeStyles({
    table: {
      maxWidth: "100%",
    },
    empty:{
        display:"flex",
        flexDirection:"column",
        alignItems:"center",
        justifyContent:"center",
        height:"50vh",
        gap:"0.5rem",
        alignItems:"center",
        flex:1,
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

export default Live;