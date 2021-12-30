import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCart, selectFollow, selectProfiletab, setCart, setFriendChallenged, setInvitedFriends, setProfileTab } from "../features/counterSlice";
import { selectSelectedPlayer } from "../features/counterSlice";
import HeaderBack from "./HeaderBack";

import History from "./History";
import LockerRoom from "./LockerRoom";
import PlayerInfo from "./PlayerInfo";
import TrophyRoom from "./TrophyRoom";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import TodaysGame from "./TodaysGame";
import ProfileTopStats from "./ProfileTopStats";
import { useHistory } from "react-router-dom";

import DeleteIcon from '@material-ui/icons/Delete';
import ReplyIcon from '@material-ui/icons/Reply';
import { auth, db } from "../firebase_file";
import firebase from "firebase";

const styles = {
    tabs: {
      background: '#fff',
    },
    slide: {
      padding: 15,
      minHeight: 100,
      color: '#fff',
    },
    slide1: {
      backgroundColor: '#FEA900',
    },
    slide2: {
      backgroundColor: '#B3DC4A',
    },
    slide3: {
      backgroundColor: '#6AC0FF',
    },
  };
const PlayerProfile=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const cart=useSelector(selectCart);
    
    const p=useSelector(selectSelectedPlayer);
    const t=useSelector(selectProfiletab);
    const [player,setPlayer]=useState({});
    const [user,setUser]=useState(p);
   
    const [tab,setTab]=useState(0);
    

    useEffect(()=>{
        setTab(t);
    },[t]);

    useEffect(()=>{
        
        setPlayer(p);
        if(p.detail!=undefined){
            setUser(p.detail);
        }else{
            setUser(p);
        }
    },[p]);


    const handleChangeIndex=(index)=>{
        setTab(index);
     }
     const handleChange=(object,value)=>{
         setTab(value);
     }

     const set_profile_tab=(e)=>{
        const index=e.target.dataset.index;
        const btns=document.querySelectorAll(".profile_pages> button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })

        btns[index].classList.add("active");
        dispatch(setProfileTab(index));
    }

    const resume_buy_picks=()=>{
      history.push("resume-buy-picks")
    }
    const delete_cart=()=>{
      dispatch(setCart([]));
    }

    const challenge_player=()=>{
      dispatch(setFriendChallenged(user));
      dispatch(setInvitedFriends([user.email]))
      history.push("/challenge-friend");
  }

  const f=useSelector(selectFollow);
    const [following,setFollowing]=useState(false);
	const [nb_follow,setNb_follow]=useState(0);

	const [my_follow,setMy_follow]=useState([]);
	useEffect(()=>{
		const res=f.filter((item)=>{
			return item.user==auth.currentUser.email;
		});
		setMy_follow(res);
		
		if(user!=undefined){
			const em=user.email;
			const res2=res.filter((item)=>{
				return item.user==auth.currentUser.email && item.follow==em;
			});
			if(res2.length>0){
				setFollowing(true);
			}else{
				setFollowing(false);
			}
		}
	},[f]);

  
	const follow=async (e)=>{
		const c_user=auth.currentUser.email;
		const follow=user.email;
		
		const obj={user:c_user,follow,date:firebase.firestore.FieldValue.serverTimestamp(),accept:false}
		//console.log(obj);
		const btn=e.target;
		btn.disabled=true;
		btn.innerText="Please wait...";
		await db.collection("psg_follow").add(obj);
		
		btn.disabled=false;
		btn.innerText="Follow";
	}
	
	const unfollow=async(e)=>{
		const c_user=auth.currentUser.email;
		const follow=user.email;
		const res=my_follow.filter((item)=>{
			return item.user==c_user && item.follow==follow;
		});
		if(res.length>0){
			const key=res[0].key;
			const btn=e.target;
			btn.innerText="Please wait...";
			btn.disabled=true;
			await db.collection("psg_follow").doc(key).delete();
			btn.innerText="Unfollow";
			btn.disabled=false;
		}
	}
    return(
        <div className="profile">
             <HeaderBack 
                title_redux={false} 
                title={player?.detail?.username || player.username}
                >

                  <div style={{
                    position:"absolute",
                    right:"1rem",
                    display:"flex",
                    alignItmes:"center",
                    gap:"1rem",
                  }}>
                    {following ==false &&<button className="btn_stats_follow" 
                    onClick={follow} 
                    style={{
                      padding:"0.5rem", 
                      backgroundColor:"rgba(255,255,255,0.3)",
                      color:"whitesmoke"
                    }}
                    >Follow</button>}
			{following ==true &&<button className="btn_stats_follow" onClick={unfollow}
      style={{
        padding:"0.5rem", 
        backgroundColor:"rgba(255,255,255,0.3)",
        color:"whitesmoke"
      }}
      >Unfollow</button>}
                    <button style={{
                      padding:"0.5rem",
                      backgroundColor:"transparent",
                      border:"none",
                    }} 
                    onClick={challenge_player}
                    ><ReplyIcon  style={{color:"whitesmoke",}}/></button>
                  </div>
                </HeaderBack>
              <div className="player_profile">
                <ProfileTopStats userInfo={user} />


                <div style={{
                  display:"flex",
                  flexDirection:"column",
                  minHeight:"50vh",
                }}>
                <Tabs value={tab} fullWidth style={styles.tabs} onChange={handleChange}>
                <Tab label="Ranking" />
                <Tab label="Today's Game" />
                <Tab label="Locker Room" />
                <Tab label="Trophy Room" />
                <Tab label="History" />
                </Tabs>
                <SwipeableViews index={tab} enableMouseEvents  onChangeIndex={handleChangeIndex} 
                style={{
                  flex:1,
                  }} 
                >
                   {tab==0 && <PlayerInfo userInfo={user}/>}
                   {tab==1 && <TodaysGame userInfo={user} />}
                   {tab==2 && <LockerRoom userInfo={user}  />}
                   {tab==3 && <TrophyRoom userInfo={user} />}
                   {tab==4 && <History userInfo={user} />}
                </SwipeableViews>
            </div>
              </div>
              {
                cart.length>0 && <div className="footer footer_buy">
                      <div>
                        <p>{cart.length} picks chosen</p>
                        <p className="coins_buy">{cart.length*1000} Coins</p>
                      </div>
                      <div style={{
                        display:"flex",
                        alignItems:"center",
                        gap:"1rem"
                      }}
                      className="buy_picks_actions"
                      >
                        <button onClick={delete_cart}>
                          <DeleteIcon />
                        </button>
                        <button onClick={resume_buy_picks}>
                          Resume Now
                        </button>
                      </div>
                      
                    </div>
              }
              
        </div>
    );
}

export default PlayerProfile;