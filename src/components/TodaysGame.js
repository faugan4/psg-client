import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, selectLeagues, selectMyPicks, selectPicksBought, selectSports, setCart ,
selectGames,
setTournaments} from '../features/counterSlice';
import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {icons} from "../functions";
import { auth } from '../firebase_file';
import Start from "./Start";
const TodaysGame = ({userInfo}) => {
    const c=useSelector(selectCart);
    const pb=useSelector(selectPicksBought);
    const games_redux=useSelector(selectGames)
    const dispatch=useDispatch();
    

    const p=useSelector(selectMyPicks);
    const l=useSelector(selectSports);
    const l2=useSelector(selectLeagues);
    const [my_picks,setMy_picks]=useState([]);
    const [leagues,setAll_leagues]=useState([]);
    const [can_buy,setCan_buy]=useState(false);

    const [cart,setAll_cart]=useState([]);
    useEffect(()=>{
        setMy_picks(p);
        //console.log("at the end today= ",p);

    },[p,c]);
    useEffect(()=>{
        setAll_leagues(l);
    },[l]);

    useEffect(()=>{
        setAll_cart(c);
    },[c]);


    const buy_pick=async(pick,game_icon,str_league,b)=>{
        if(b=="bought"){
            return;
        }
        let old_cart=[...cart];
       
                
        const res=old_cart.indexOf(pick);
        if(res<0){
            old_cart.push(pick);
            setAll_cart(old_cart);
            dispatch(setCart(old_cart));
        }else{
            const f=old_cart.filter((cc)=>{
                return cc!=pick;
            })
            setAll_cart(f);
            dispatch(setCart(f)); 
        }
       
        
    }

    useEffect(()=>{
        if(userInfo==undefined){
            //console.log("userinfo undefined");
            setCan_buy(false);
            //console.log("can buy is set to false")
        }else{
            const e=userInfo.email;
            const my_email=auth?.currentUser?.email;
            if(e==my_email){
                setCan_buy(false);
                //console.log("can buy is set to false")
            }else{
                setCan_buy(true);
                //console.log("can buy is set to true")
            }
        }
    },[userInfo]);

    const [alerte,setAlerte]=useState("");
    useEffect(()=>{
        //console.log("my picks are ",my_picks);
    },[my_picks]);
    let cpt=0;
    return (
        <div className="today_games">

            {my_picks.length==0 && <Start userInfo={userInfo} /> }
            {
                
                  my_picks.map((pick,i)=>{
                     // //console.log(pick);
                    // //console.log(pick);
                   

                     const res_score=games_redux.filter((item)=>{
                         return item.key==pick.id_game && item.away_score=="";
                     })
                     if(res_score.length==0){
                         return null;
                     }
                     
                     
                     //console.log("at the end c=",i,pick);
                     const tour=pick;

                     if(tour==undefined){
                         return null;
                     }
                     
                     
                      let str_type_pick="";
                      const type_pick=tour?.type_pick;
                      const team_picked=tour?.team_picked;
                      let pickdata=tour?.pickdata;
                      ////console.log("at the end picks ",i,tour,pickdata);
                      pickdata=pickdata?.split(",");

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
                         // odd=pickdata[0]+" | "+pickdata[1];
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
                          if(userInfo!=undefined){
                            str_type_pick="TOTAL";
                          }

                          ////console.log("my picks" ,pickdata)
                          odd="Total="+pickdata[6] || "";
                         
                      }

                      let date=new Date(pick.date).toUTCString();
                      date=date.split(" ");
                      date=date[1]+" "+date[2]+" "+date[3];

                      const id_sport=pick.sport;
                      const id_league=pick.league;

                      let str_sport="";
                     str_sport= leagues.filter((s)=>{
                          return s.id==id_sport;
                      })[0]?.name;

                      let str_league="";
                      str_league=l2.filter((l)=>{
                          return l.id==id_league;
                      })[0]?.name;

                      const res=icons.filter((icon)=>{
                          return icon.id==id_sport;
                      });

                      let game_icon=res[0]?.icon;
                      
                      if(userInfo!=undefined){
                          home_picked="";
                          away_picked="";
                          odd="";
                          
                      }

                     let str_bought="";
                      
                      let checked_icon=<CheckBoxOutlineBlankIcon /> 
                      ////console.log(cart);
                      const r=cart.filter((item)=>{
                          return item.id_challenge==pick.id_challenge 
                                && item.key==pick.key
                                && item.user==pick.user
                                && item.type_pick==pick.type_pick
                                && item.team_picked==pick.team_picked
                                && item.entry==pick.entry
                                && item.league==pick.league
                                ;
                      })
                      
                      if(r.length>0){
                          //console.log("found")
                          checked_icon=<CheckBoxIcon />
                      }else{
                          //console.log("not found");
                          const r2=pb.filter((item)=>{
                            return item.id_challenge==pick.id_challenge 
                                  && item.key==pick.key
                                  && item.user==pick.user
                                  && item.pick.type_pick==pick.type_pick
                                  && item.pick.team_picked==pick.team_picked
                                  && item.pick.entry==pick.entry
                                  && item.pick.league==pick.league
                                  ;
                        })
                        if(r2.length>0){
                            checked_icon=<CheckBoxIcon />
                            str_bought="bought";
                        }

                      }

                      cpt++;
                     

                      return(
                        <div className="today_games_game" key={i}>
                        <div className="today_game_top">
                            <button className="game_name_icon">
                                {game_icon}
                                {str_league} 
                                
                            </button>
                            {userInfo==undefined && <button className="hide">Can't buy</button>}
                            {can_buy==true && <button 
                            className={str_bought} 
                            onClick={buy_pick.bind(this,pick,game_icon,str_league,str_bought)}>
                                {checked_icon}
                                BUY {can_buy}
                                </button>}
                            
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
                                <p className={away_picked}>{pick.teams[0]}</p>
                                <p className={home_picked}>{pick.teams[1]}</p>
                            </div>
                            
                        </div>
                        <div className="today_game_footer">
                            <div>
                                <button>{str_type_pick}</button>
                                {/*<button>POINTS {pickdata[6]}</button>*/}
                            </div>
                            {userInfo!=undefined && <button>1000 Coins</button>}
                            {userInfo==undefined && <button className="hide">1000 Coins</button>}
                            {userInfo==undefined &&<p className="game_odd">{odd}</p>}
                        </div>
                  </div>


                      );
                  })

                  
              }

              {cpt==0 &&  <div className="no_records"><p>No records found!!!</p></div>}
             

              
        </div>
    )
}

export default TodaysGame
