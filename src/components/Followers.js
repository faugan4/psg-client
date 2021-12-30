import React,{useState,useEffect} from 'react'
import HeaderBack from './HeaderBack'
import { useDispatch, useSelector } from 'react-redux'
import { selectPicksBought,selectFollow,selectUsers,setSelectedPlayer,selectUsersStats } from '../features/counterSlice'
import { auth, db } from '../firebase_file'
import Avatar from '@material-ui/core/Avatar';
import {useHistory} from "react-router-dom";


const Followers = () => {
	const f=useSelector(selectFollow);
	const u=useSelector(selectUsers);
    const us=useSelector(selectUsersStats);
	const [followers,setFollowers]=useState([]);
	const [data,setData]=useState([]);
	
	const dispatch=useDispatch();
	const history=useHistory();
	
	useEffect(()=>{
		const res=f.filter((item)=>{
			return item.user==auth.currentUser.email;;
		});
		setFollowers(res);

		const g=[];
		res.map((item)=>{
			const e=item.follow;
			const res2=u.filter((item2)=>{
				return item2.email==e;
			});
			if(res2.length>0){
				g.push(res2[0]);
			}
		});
		setData(g);
        console.log("followers",g);
	},[f,u]);
	
	const go_to_user_profile=(user)=>{
		dispatch(setSelectedPlayer(user));
		history.push("/player-profile");
	}
	
	const challenge_user=()=>{
		console.log("going to challenge the user");
	}
    return (
        <div className="picks_bought">
            <HeaderBack title_redux={false} title="My Club"></HeaderBack>
			<div className="picks_bought_body">
                {
                data.length==0 && 
                <div className="no_records">
                    <p>No followers !!!</p>
                </div>    
                }
			{
				data.map((user,i)=>{
                    const user_email=user.email;
                    const res=us.filter((item)=>{
                        
                        return item.user==user_email;
                    })

                    let wins=0;
                    let loses=0;
                    let ties=0;
                    let wp=".000";
                    let last_200="0-0";
                    if(res.length>0){
                        wins=res[0].user_wins;
                        loses=res[0].user_loses;
                        ties=res[0].user_tie;
                        last_200=res[0].user_wins+"-"+res[0].user_loses;

                        let total=parseFloat(wins+loses);
                        if(total>0){
                            wp=wins/total;
                            wp=parseFloat(wp).toFixed(3);
                            wp=(""+wp).replace("0.",".");
                        }
                    }
					return(
						<div className="player" key={user.key}>
            <div className="player_header">
                <div onClick={go_to_user_profile.bind(this,user)}>
                    {
                        user.photo=="foo.jpg" && <Avatar>{user.username[0].toLowerCase() } </Avatar>
                    }
                    {
                        user.photo!="foo.jpg" && <img src={user.photo} />
                    }
                    
                    
                    <div>
                        <p>
                            {user.username[0].toUpperCase()}
                            {user.username.substring(1,user.username.length).toLowerCase()}
                        </p>
                        <p>{"title index"}</p>
                    </div>  
                </div>
                <div>
                    <button onClick={challenge_user.bind(this,user)}>
                       challenge
                    </button>
                </div>
                     
            </div>
            <div className="player_body">
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
                    <p>Tie</p>
                </div>

                <div>
                    <p>{last_200}</p>
                    <p>Last 200</p>
                </div>


            </div>
        </div>
					);
				})
			}
			</div>
        </div>
    )
}

export default Followers
