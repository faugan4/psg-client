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
import Lobby from "./Lobby";

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
    return (
        <div className="profile">
            
            <HeaderBack 
                title_redux={false} 
                title="Lobby"
                >
                </HeaderBack>
                <div style={{padding:"1rem"}}><Lobby /></div>
               
            
        </div>
    )
}

export default Profile;