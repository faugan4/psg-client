import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers, setSelectedPlayer ,selectUsersStats} from '../features/counterSlice';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';


const Player=({player,onClick,type,challenge})=>{
    ////console.log("info=",player)
    const dispatch=useDispatch();
    const history=useHistory();
    const u=useSelector(selectUsers);
    const stats=useSelector(selectUsersStats);
    const [wins,set_wins]=useState(0);
    const [loses,set_loses]=useState(0);
    const [tie,set_tie]=useState(0);
    const [wp,set_wp]=useState(".000");

    const go_to_profil=async (player)=>{
        const email=player.user;
        const res=u.filter((user)=>{
            return user.email==email;
        })
       
        if(res.length==0){
            return;
        }
        
        dispatch(setSelectedPlayer(res[0]));
        history.push("/player-profile");
    }

    const [photo,setPhoto]=useState(<Skeleton variant="circle" width={40} height={40} /> );

    useEffect(()=>{
        const photo=player?.detail?.photo;
        const username=player?.detail?.username;
        if(photo=="foo.jpg"){
            setPhoto(<Avatar>{username[0]?.toLowerCase()}</Avatar>);
        }else{
            setPhoto(<img src={photo} />);
        }
    },[player]);

    useEffect(()=>{
       const player_email=player?.detail?.email;
       const res=stats.filter((item)=>{
           return item.user==player_email;
       }) 

       if(res.length>0){
           if(parseInt(type)==2){
               let w=res[0].user_wins_h2h;
               let l=res[0].user_loses_h2h;
               w=parseFloat(w);
               l=parseFloat(l);
               
                set_wins(w);
                set_loses(l);
                set_tie(res[0].user_tie_h2h);
                
                let total=w+l;
                if(total>0){
                    let per=w/total;
                    per=per.toFixed(3);
                    per=(""+per).replace("0.",".");
                    set_wp(per);
                }
               
           }else if(parseInt(type)==3){
                let w=res[0].user_wins_sb;
                let l=res[0].user_loses_sb;
                w=parseFloat(w);
                l=parseFloat(l);
                
                set_wins(w);
                set_loses(l);
                set_tie(res[0].user_tie_sb);
                
                let total=w+l;
                if(total>0){
                    let per=w/total;
                    per=per.toFixed(3);
                    per=(""+per).replace("0.",".");
                    set_wp(per);
                }
           }else{
                let w=res[0].user_wins;
                let l=res[0].user_loses;
                w=parseFloat(w);
                l=parseFloat(l);
                
                set_wins(w);
                set_loses(l);
                set_tie(res[0].user_tie);
                
                let total=w+l;
                if(total>0){
                    let per=w/total;
                    per=per.toFixed(3);
                    per=(""+per).replace("0.",".");
                    set_wp(per);
                }
           }
       }
    },[stats]);

    const [result,set_result]=useState("");
    const [color,set_color]=useState("");
    useEffect(()=>{
        const player_email=player.user;
        const winners=challenge.winners;
        //console.log("the player ",winners)
        const players=challenge.wins;
        if(winners==undefined || winners==null || winners.length==0){
            return;
        }

        const res=winners.filter((item)=>{
            return item.user==player_email;
        })

        if(winners.length==players.length){
            //tie
            set_result("TIE");
            set_color("orange");
        }else if(res.length==0){
            //lose
            set_result("LOSE")
            set_color("indianred");
        }else{
            //wins
            set_result("WIN");
            set_color("green");
        }
        
    },[challenge,player]);
    return(
        <div className="player">
            <div className="player_header">
                <div onClick={go_to_profil.bind(this,player)}>
                    {photo}
                    
                    <div>
                        <p>{player.detail?.username}</p>
                        <p>{player.detail?.status}</p>
                    </div>  
                </div>
                <div>
                    <p style={{color:color,fontWeight:"bold",fontSize:"1rem"}}>{result}</p>
                </div>
               
                <div>
                    
                    <button onClick={onClick}>
                        View picks 
                    </button>
                </div>
                     
            </div>
            <div className="player_body">
                <div>
                    <p>{wins}</p>
                    <p>Wins </p>
                </div>

                <div>
                    <p>{loses}</p>
                    <p>Loses</p>
                </div>

                <div>
                    <p>{tie}</p>
                    <p>Tie</p>
                </div>

                <div>
                    <p>{wp}</p>
                    <p>Hitting %</p>
                </div>


            </div>
        </div>
    );
}

export default Player;