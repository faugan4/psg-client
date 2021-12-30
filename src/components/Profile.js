import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectProfiletab, setProfileTab } from "../features/counterSlice";
import History from "./History";
import LockerRoom from "./LockerRoom";
import PlayerInfo from "./PlayerInfo";
import ProfileTopStats from "./ProfileTopStats";
import TrophyRoom from "./TrophyRoom";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import TodaysGame from "./TodaysGame";
import HeaderBack from "./HeaderBack";
import { auth } from "../firebase_file";
import EditIcon from '@material-ui/icons/Edit';
import { useHistory } from "react-router";
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

const Profile=()=>{
    const t=useSelector(selectProfiletab);
    const dispatch=useDispatch();
    const [tab,setTab]=useState(0);
    
    const history=useHistory();
    useEffect(()=>{
        setTab(t);
    },[t]);

   

    const set_profile_tab=(e)=>{
        const index=e.target.dataset.index;
        const btns=document.querySelectorAll(".profile_pages> button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })

        btns[index].classList.add("active");
        dispatch(setProfileTab(index));
    }

    const handleChangeIndex=(index)=>{
       setTab(index);
    }
    const handleChange=(object,value)=>{
        setTab(value);
    }

    useEffect(()=>{
      //console.log("the current tab is ",tab);
    },[tab]);

    const edit_profil=()=>{
      history.push("profile-edit");
    }
    return (
        <div className="profile">
            
            <HeaderBack 
                title_redux={false} 
                title={auth?.currentUser?.displayName}
                >
                  <button style={{
                    position:"absolute",
                    right:"1rem",
                    padding:"0.5rem",
                    backgroundColor:"transparent",
                    border:"none",

                  }}
                  onClick={edit_profil}
                  >
                    <EditIcon style={{color:"white",}} />
                  </button>
                </HeaderBack>

                {/*<ProfileTopUsers />*/}
                <div className="player_profile">
                <ProfileTopStats />
               
                


                <div style={{
                  display:"flex",
                  flexDirection:"column",
                  minHeight:"50vh",
                }}>
        <Tabs value={tab}  style={styles.tabs} onChange={handleChange} variant="fullWidth">
          <Tab label="Ranking" />
          <Tab label="Today's Game" />
          <Tab label="Locker Room" />
          <Tab label="Trophy Room" />
          <Tab label="History" />
        </Tabs>
        <SwipeableViews index={tab} enableMouseEvents  onChangeIndex={handleChangeIndex} style={{
          flex:1,
          }} >
          {tab==0 && <PlayerInfo />}
          {tab==1 && <TodaysGame />}
          {tab==2 && <LockerRoom />}
          {tab==3 && <TrophyRoom />}
          {tab==4 && <History />}
        </SwipeableViews>
      </div>
      </div>
            
        </div>
    )
}

export default Profile;