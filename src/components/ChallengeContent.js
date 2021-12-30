import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPicks, selectSelectedTournament, selectSinglePageName, selectUsers, 
    setSelectedPlayer, setSinglePageName ,selectGames} from "../features/counterSlice";
import HeaderBack  from "./HeaderBack";
import Challenge from "./Challenge";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase_file";

import Player from "./Player";
import PlayerSkeleton from "./skeleton/PlayerSkeleton";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {challenged_closed} from "../functions";

const ChallengeContent=()=>{
    
    const c=useSelector(selectSelectedTournament);
    const u=useSelector(selectUsers);
    const picks=useSelector(selectPicks);
    const games=useSelector(selectGames);
    const old_page=useSelector(selectSinglePageName)
    const dispatch=useDispatch();
    const history=useHistory();
    
    const [challenge,setChallenge]=useState(c);

    const [players,setPlayers]=useState([]);
    const [r_users,setAll_users]=useState([]);
    const [loading,setLoading]=useState(true);
    //console.log("the selected tournmaent is ",c);
    const [started,set_started]=useState(c.started);
    const [closed,set_closed]=useState(c.closed);
    const all_picks=useSelector(selectPicks);
    


    useEffect(()=>{
        if(u.length==0){
            history.push("/");
            return;
        }
        setAll_users(u);
    },[u])

     

    useEffect(()=>{
        setChallenge(c);

        const key=c.key;
        if(key==undefined){
            return;
        }

        load_players(key);
    },[c]);

    useEffect(()=>{
        const res=picks.filter((pick)=>{
            return pick.id_challenge==c?.key;
        })
        const r=challenged_closed(c?.key,c?.type,res.length,res,games );
        set_closed(r.closed);
        set_started(r.game_started);

        //console.log("the res is now ",r);
    },[picks,c,games]);

    const load_players= (id_challenge)=>{

        const ch_picks=picks.filter((pick)=>{
            return pick.id_challenge==id_challenge;
        })

        const users=[];
        ch_picks.map((pick)=>{
            const item={...pick};
            const email=item.user;
            const res=u.filter((user)=>{
                return user.email==email;
            })
            if(res.length>0){
                item.detail=res[0];
            }else{
                item.detail={};
            }
            users.push(item);
        })
        setPlayers(users);
        setLoading(false);

    }
    const join=(e)=>{
        const btn=e.target;
        if(btn.dataset.joined=="true"){
            //console.log("already joined");
            return;
        }
        dispatch(setSinglePageName(old_page+" > Join"));
        history.push("/join");
    }

    const view_player_picks=(player,closed,started)=>{
       // //console.log(player,closed,started);
        const res=all_picks.filter((item)=>{
            return player.id_challenge==item.id_challenge;
        })
        const users=res.map((item)=>{
            return item.user;
        })
        const me=auth?.currentUser.email;
        const index=users.indexOf(me);
        if(index>=0){
            dispatch(setSelectedPlayer({...player,closed,started}));
             history.push("/player-picks");
        }else{
            set_opend(true);
        }
        
    }

    const share_challenge=async ()=>{
       try{
           await navigator.share({
                title:"Partage du challenge",
                url:"https://prosportguru-a0569.web.app",
                text:"Hey! I am on PS.GURU, join me there for a challenge"
            })
            alert("share successful")
       }catch(err){
           alert(err);
       }
    }

    const [opend,set_opend]=useState(false);
    return(
        <div className="challenge_content">
            <HeaderBack title_redux={true}/>
            <div className="challenge_content_body single_page_body">
                <Challenge  
                    tournament={challenge}
                    btnText="Join"
                    btnClick={join}
                    detail={true}
                    share_challenge={share_challenge}
                    closed={closed}
                    started={started}
                />
                <div>

                    {
                        players.length ==0 && loading ==true && (
                        
                            [1,2,3,4,5].map((e)=>{
                                return  <PlayerSkeleton key={e} />
                            })
                       
                        )
                    }
                    
                    {
                        players.map((player)=>{
                            return(
                                <Player 
                                player={player} 
                                key={player.key} 
                                type={c?.type}
                                challenge={challenge}
                                onClick={view_player_picks.bind(this,player,closed,started)}
                                />
                            );
                        })
                    }
                </div>
            </div>

            <Dialog onClose={()=>{
                set_opend(!opend);
            }} aria-labelledby="simple-dialog-title" open={opend}>
                <DialogTitle id="simple-dialog-title">You want to view the picks ?</DialogTitle>
                <p style={{padding:"1rem",textAlign:"center"}}>
                    Since you are not part of this challenge 
                    you have to go users profile and buy the picks
                </p>
                {
                    closed==false && <p style={{padding:"1rem",textAlign:"center"}}>Or you can join this challenge</p>
                }

                {
                    closed==false && <button style={{
                        padding:"1rem",
                        width:100,
                        margin:"auto",
                        marginBottom:"1rem",
                        border:"none",
                        outline:"none",
                        backgroundColor:"indianred",
                        color:"white",
                    }}
                    onClick={join}
                    >Join</button>
                }
            </Dialog>
        </div>
    );
}

export default ChallengeContent;