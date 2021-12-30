import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { selectLeagues, selectMyPicks, selectPicks, selectSelectedPlayer, selectSports, selectTournaments } from '../features/counterSlice';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import { useEffect } from 'react';


import Paper from '@material-ui/core/Paper';
import Start from "./Start";

const PlayerInfo = ({userInfo}) => {
    
    const l=useSelector(selectSports);
    const sports=l;
    const l2=useSelector(selectLeagues);
    const my_picks=useSelector(selectMyPicks)
    const challenges=useSelector(selectTournaments);
    const player=useSelector(selectSelectedPlayer);
    const picks=useSelector(selectPicks);
    const [leagues,setAll_leagues]=useState([]);
    const [id_sport,setId_sport]=useState(0);
    const [sport_name,setSport_name]=useState("All");
    const [mypicks,setAll_my_picks]=useState([]);
    const [all_picks,se_all_picks]=useState([]);
    

    useEffect(()=>{
        setAll_leagues(l);
    },[l]);

    useEffect(()=>{
        
        setAll_my_picks(my_picks);
    },[my_picks]);
   

    const set_active_sport=(e)=>{
        
        const id_sport=e.target.value;
        const res=leagues.filter((l)=>{
            return l.key==id_sport;
        });
        if(res.length==0){
            setSport_name("All");
        }else{
            setSport_name(res[0].name);
        }
        setId_sport(id_sport);
        //e.target.classList.add("active");
    }

   
    
    const [alerte,setAlerte]=useState("");
    const [all_wins,set_all_wins]=useState(0);
    const [all_loses,set_all_loses]=useState(0);
    const [all_overs,set_all_overs]=useState(0);
    const [all_unders,set_all_unders]=useState(0);
    const [win_per,set_win_per]=useState(".000");
    const [all_streak,set_all_streak]=useState(0);
    const [all_last_ten,set_all_last_ten]=useState("0-0");
    const [all_last_200,set_all_last_200]=useState("0-0");
    
    useEffect(()=>{
        const user_email=player?.email;
        const res=sports.filter((item)=>{
            return item.key==id_sport;
        })
        const id=res[0]?.id;
        
        const res2=l2.filter((item)=>{
            return item.id_sport==id;
        })
        const all_leagues=[];
        res2.map((item)=>{
            all_leagues.push(item.id);
        })
       
        let res3=challenges.filter((item)=>{
            return all_leagues.indexOf(item.league)>=0;
        })
        if(id_sport==0 ){
            res3=challenges;
        }

      const keys= res3.map((item)=>{
           const key=item.key;
           return key;
       })

       const res4=picks.filter((item)=>{
           
           return keys.indexOf(item.id_challenge)>=0 && item.user==user_email; 
       })
       
       let wins=0;
       let loses=0;
       let overs=0;
       let unders=0;
       let streaks=[];
       let wins_loses=[];
       const picks_keys=[];
       res4.map((item)=>{
           //console.log(item);
           const results=item.results;
           const pcs=item.picks;
           if(results==undefined){
               return false;
           }

           //const pick_key=get_pick_key(pcs);
           
           const tmp_res=results.filter((item,i)=>{
               return  pcs[i].type_pick !="3";
           })
           wins_loses.push(...tmp_res);

           wins+=results.filter((item2,i)=>{
               return item2==1 && pcs[i].type_pick !="3";
           }).length;

            loses+=results.filter((item2,i)=>{
                return item2==0 && pcs[i].type_pick !="3";
            }).length;

            overs+=results.filter((item2,i)=>{
                return item2==1 && pcs[i].type_pick =="3";
            }).length;
 
             unders+=results.filter((item2,i)=>{
                 return item2==0 && pcs[i].type_pick =="3";
             }).length;

             let streak=0;    
             const rs=results.map((item,i)=>{
                 ////console.log("item is pcs",pcs[i].type_pick);
                if(pcs[i].type_pick!="3"){
                    
                    if(item==1){
                        streak++;
                    }else if(item==0){
                        streak=0;
                    }
                    //console.log("item is ",item,streak);
                }
             })
            
             streaks.push(streak);
            
           
       })

       //console.log("the streaks are ",streaks);
       const last_ten=wins_loses.slice(Math.max(wins_loses.length - 10, 0));
       const last_two_hundred=wins_loses.slice(Math.max(wins_loses.length - 200, 0));

       let last_ten_wins=0;
       let last_ten_loses=0;

       last_ten_wins=last_ten.filter((item)=>{
           return item==1;
       }).length;

       last_ten_loses=last_ten.filter((item)=>{
        return item==0;
        }).length;


        let last_200_wins=0;
        let last_200_loses=0;
 
        last_200_wins=last_two_hundred.filter((item)=>{
            return item==1;
        }).length;
 
        last_200_loses=last_two_hundred.filter((item)=>{
         return item==0;
         }).length;
 


       
       streaks.sort();
       streaks=streaks.reverse();
       if(streaks.length>0){
        set_all_streak(streaks[0]);
       }else{
           set_all_streak(0);
       }

       const total=wins+loses;

       let wp=wins/total;
       wp=wp.toFixed(3);
      
       set_all_wins(wins);
       set_all_loses(loses)
       set_all_overs(overs);
       set_all_unders(unders);
       if(!isNaN(wp)){
           wp=(""+wp).replace("0.",".");
        set_win_per(wp);
       }else{
           set_win_per(".000");
       }
       set_all_last_ten(last_ten_wins+"-"+last_ten_loses);
       set_all_last_200(last_200_wins+"-"+last_200_loses);

    },[id_sport]);
   

    return (
        <div className="playerInfo">
             
           
           

           {my_picks.length==0 && <Start userInfo={userInfo} />}
          
          {my_picks.length>0 && <div>
            <div className="new_select">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={id_sport}
                    onChange={set_active_sport}
                    >
                    <MenuItem value={0}>All</MenuItem>
                    {
                            leagues.map((league)=>{
                                let sport_name=league.name;
                                return(
                                    <MenuItem value={league.key}>{sport_name}</MenuItem>
                                );
                            })
                        }
                </Select>
            </div>
           
          
          <div className="world_ranking">
            <div className="world_ranking_body">
                <h1>
                    Report Cards
                    <p>{sport_name} </p>
                    </h1>
                
                <div>
                   <div>
                       <p>Win</p>
                       <p>{all_wins}</p>
                   </div>

                   <div>
                       <p>Lost</p>
                       <p>{all_loses}</p>
                   </div>

                   <div>
                       <p>Overall Winning %</p>
                       <p>{win_per}</p>
                   </div>

                   <div>
                       <p>Longest Winning Streak</p>
                       <p>{all_streak}</p>
                   </div>

                   <div>
                       <p>Last 10</p>
                       <p>{all_last_ten}</p>
                   </div>

                   <div>
                       <p>Last 200</p>
                       <p>{all_last_200}</p>
                   </div>

                   <div style={{
                       marginTop:"1rem",
                       borderTop:"1px solid silver",
                       paddingTop:"0.5rem",
                   }}>
                       <p>Over/Under</p>
                       <p>{all_overs}-{all_unders}</p>
                   </div>
                   

                </div>
            </div>
          </div>

          </div>}
                    



          

          
        </div>
    )
}

export default PlayerInfo
