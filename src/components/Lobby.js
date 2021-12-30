import React,{useState,useEffect} from 'react';
import Tournament from './Tournament';
import {useSelector} from 'react-redux';
import {selectGames, selectTournaments,selectPicks} from "../features/counterSlice";

const Lobby=()=>{
    const t=useSelector(selectTournaments);
    const games=useSelector(selectGames);
    const picks=useSelector(selectPicks);

    const [missions,set_missions]=useState([]);
    const [headsup,set_headsup]=useState([]);
    const [sport_booth,set_sport_booth]=useState([]);
    const [tournaments,set_tournaments]=useState([]);
    
    useEffect(()=>{

        set_tournaments(t.filter((item)=>{
            return item.type=="5";
        }));  

        set_missions(t.filter((item)=>{
            return item.type=="1";
        }));  

        set_headsup(t.filter((item)=>{
            return item.type=="2";
        }));  

        set_sport_booth(t.filter((item)=>{
            return item.type=="3";
        }));  

    },[t]);
    
    return(
        <div className="lobby">
            {
                tournaments.length>0 && <div>
                <h2 className="lobby__title">Tournaments</h2>
                <Tournament type={4} 
                games={games} 
                picks={picks}
                />
            </div>
            }
            
            
            {
                headsup.length>0 && <div>
                <h2 className="lobby__title">Heads Up</h2>
                <Tournament 
                    type={2} 
                    games={games} 
                    picks={picks}
                />
                </div>
            }

            {
                sport_booth.length>0 &&  <div>
                <h2  className="lobby__title">Sports Booth</h2>
                <Tournament type={3}
                games={games} 
                picks={picks}
                />
            </div>
            }
            
            
           


            {/*
            <div>
                <h2  className="lobby__title">Play with Debbie</h2>
                <Tournament type={1} />
            </div>*/}
        
        </div>
    );
}
export default Lobby;