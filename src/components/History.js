import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectGames, selectLeagues, selectMyPicks, selectSports } from '../features/counterSlice';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import {icons,get_pick_key} from "../functions";
import Start from "./Start";
const History = ({userInfo}) => {
    
    const [data,setData]=useState([]);
    const picks=useSelector(selectMyPicks);
    const sports=useSelector(selectSports);
    const leagues=useSelector(selectLeagues);
    const games_redux=useSelector(selectGames);
    const [selected_sport,set_selected_sport]=useState(0);

    useEffect(()=>{
        if(picks.length>0){
            const first=picks[0];
            const id_sp=first.sport;
            //console.log("first is ",id_sp);
            set_selected_sport(id_sp);
        }
        setData(picks);

    },[picks]);
    const picks_keys=[]; 

    const sport_changed=(e)=>{
        const id_s=e.target.value;
        set_selected_sport(id_s);
    }

    let cpt=0;

    const [data_found,set_data_found]=useState(0);
    useEffect(()=>{
        const res=picks.filter((pick)=>{
            return pick.sport==selected_sport;
        });
        set_data_found(res.length);
    },[picks,selected_sport]);
    return (
        <div className=" today_games history ">
            <div style={{
                display:"flex",
            }}>
                <select style={{
                    flex:1,
                    padding:"0.5rem",
                    border:"none",
                    outline:"none",
                    marginBottom:"0.5rem"
                }}
                onChange={sport_changed}
                value={selected_sport}
                >
                    <option value="0">Select a Sport</option>
                    {
                        sports.map((item)=>{
                            return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            );
                        })
                    }

                </select>
            </div>
             {data.length==0 && <Start userInfo={userInfo} />}
            {
                    
                  data.map((pick,i)=>{
                      //console.log(pick);
                      const pick_key=get_pick_key(pick);
                      if(picks_keys.indexOf(pick_key)>=0){
                        return null;
                      }
                      picks_keys.push(pick_key);

                      const res_score=games_redux.filter((item)=>{
                        return item.key==pick.id_game && item.away_score!="";
                    })
                    if(res_score.length==0){
                        return null;
                    }

                    const score_away=res_score[0].away_score;
                    const score_home=res_score[0].home_score;

                      let str_type_pick="";
                      const type_pick=pick.type_pick;
                      const team_picked=pick.team_picked;
                      let pickdata=pick.pickdata;
                      pickdata=pickdata.split(",");

                      
                      let home_picked="";
                      let away_picked="";
                      let odd="";
                      if(type_pick=="1"){
                          str_type_pick="ML";
                          if(team_picked=="1"){
                              away_picked="picked";
                              odd=pickdata[0];
                          }else{
                              home_picked="picked";
                              odd=pickdata[1];
                          }
                          odd=parseFloat(odd);
                          if(odd>0){
                              odd="+"+odd;
                          }
                          //odd=pickdata[0]+" | "+pickdata[1];
                      }else if(type_pick=="2"){
                          str_type_pick="SPREAD";
                          if(team_picked=="1"){
                            away_picked="picked";
                            odd=pickdata[2];
                            }else{
                                home_picked="picked";
                                odd=pickdata[3];
                             }
                             odd=parseFloat(odd);
                             if(odd>0){
                                 odd="+"+odd;
                             }
                             //odd=pickdata[2]+" | "+pickdata[3];
                      }else{
                          if(team_picked=="1"){
                              str_type_pick="Over";
                          }else{
                              str_type_pick="Under";
                          }
                          odd="Total="+pickdata[6];
                        // str_type_pick="TOTAL";
                      }

                      let date=new Date(pick.date).toUTCString();
                      date=date.split(" ");
                      date=date[1]+" "+date[2]+" "+date[3];

                      const id_sport=pick.sport;
                      const id_league=pick.league;

                      let str_sport="";
                     str_sport= sports.filter((s)=>{
                          return s.id==id_sport;
                      })[0]?.name;
                      //console.log(str_sport);

                      let str_league="";
                      
                      str_league=leagues.filter((l)=>{
                          return l.id==id_league;
                      })[0]?.name;
                      ////console.log("res=",res,"for ",id_league,"in",);
                      


                      const res=icons.filter((icon)=>{
                        return icon.id==id_sport;
                    });

                    let game_icon=res[0]?.icon;
                    const pick_res=pick.pick_result;

                    let str_res="game_tie";
                    if(pick_res=="1"){
                        str_res="game_win";
                    }else if(pick_res=="0"){
                        str_res="game_lose";
                    }

                    if(selected_sport!=id_sport){
                        return  null;
                    }


                    cpt++;
                   
                      return(
                        <div className={`today_games_game history_game ${str_res}`} key={i} dataIndex={cpt}>
                        <div className="today_game_top">
                            <button className="game_name_icon">
                                {game_icon}
                                {str_league}
                               
                            </button>
                            <button className="hide">BUY</button>
                        </div>
    
                        <div className="today_game_center">
                            <div>
                                <p>{date}</p>
                                <p>Date</p>
                            </div>
                            <div>
                                <p>{str_sport}</p>
                                <p>Game</p>
                            </div>
                            <div className="today_game_teams"> 
                                <p className={away_picked}>{pick.teams[0]} ({score_away})</p>
                                <p className={home_picked}>{pick.teams[1]} ({score_home})</p>
                            </div>
                            
                        </div>
                        <div className="today_game_footer">
                            <div>
                                <button>{str_type_pick}</button>
                                {/*<button>POINTS {pickdata[6]}</button>*/}
                            </div>
                            <button className="hide">1000 Coins</button>
                            <p className="game_odd">{odd}</p>
                        </div>
                        <p style={{fontSize:"0.8rem",marginTop:"1rem"}}>{pick.infos}</p>
                  </div>
                      );
                  })
              }
           
              {
                  data_found==0 && <div className="no_records"><p>No data found</p></div>
              }

            
        </div>
    )
}

export default History
