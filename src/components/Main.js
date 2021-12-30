import { useDispatch, useSelector } from "react-redux";
import { selectActiveTab, selectTournaments, selectTab,setTab, setActiveTab, setPage,setHeaderTab,selectHeaderTab, selectUsers, setSelectedPlayer, setScreenHeight, setHeaderHeight,setInvitedFriends,setFriendChallenged } 
from "../features/counterSlice";
import { auth } from "../firebase_file";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import Lobby from "./Lobby";
import Games from "./Games";
import Live from "./Live";
import Friends from "./Friends";
import Profile from "./Profile";
import { useHistory } from "react-router-dom";

import Nav from "./Nav";
import Top from "./Top";
import '@fontsource/roboto';

import Header from "./Header2";
import SwipeableViews from 'react-swipeable-views';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import { Avatar } from "@material-ui/core";
import SettingsIcon from '@material-ui/icons/Settings';

const styles = {
    slide: {
      color: 'black',
      overflow: "auto",
      padding: "1rem"
      
    },
    slide1: {
     
    },
    slide2: {
      
    },
    slide3: {
      
    },
  };

const Main=()=>{
    
    const history=useHistory();
    const dispatch=useDispatch();
    const [h,setH]=useState(0);
    const [user,set_user]=useState(null);
    const [photo,setPhoto]=useState("foo.jpg");
    const u=useSelector(selectUsers);

   

    useEffect(()=>{
        //console.log("ok for this")
        const height=window.screen.height
        const header=document.querySelector("#header")?.clientHeight;
        const dif=height-header;
        setH(dif);

        const sc=document.querySelectorAll(".slide_content");
        sc.forEach((s)=>{
            s.style.height=dif+"px";
        })
    },[])

    useEffect(()=>{
        window.addEventListener('resize', handle_resize_window, true);
        return ()=>{
            //console.log("ok")
            window.removeEventListener("resize",handle_resize_window);
        }
    },[])

    const handle_resize_window=(event)=>{
        const height=window.screen.height
        dispatch(setScreenHeight(height));
        const header=document.querySelector("#header")?.clientHeight;
        const dif=height-header;
        dispatch(setHeaderHeight(header))
        setH(dif);
        //console.log("resize is now ",dif);
    }
    
    const tab_index=useSelector(selectTab);
    const [index,setIndex]=useState(0);

    useEffect(()=>{
        setIndex(tab_index);
    },[tab_index]);

    const handleChangeIndex=(index)=>{
        dispatch(setTab(index))
        setIndex(index);
    }

    const [games_drawer,set_games_Drawer]=useState(false);
    const onGames_drawer_closed=()=>{
        set_games_Drawer(!games_drawer);
    }

    useEffect(()=>{
        if(auth.currentUser==null){
            history.replace("/");
            return;
        }

        const email=auth?.currentUser?.email;
        //console.log(email);
        /*if(info.photo=="foo.jpg"){
            up=<Avatar onClick={handleClickOpen}>{info.username[0].toLowerCase() }</Avatar>;
        }else{
            up=<img src={info.photo}  onClick={handleClickOpen}/>
        }*/
    },[auth]);


    useEffect(()=>{
       
        if(auth?.currentUser==null){
            history.push("/");
            return;
        }
        const res=u.filter((user)=>{
            return user.email==auth?.currentUser.email;
        });
        if(res.length>0){
            set_user(res[0]);
            setPhoto(res[0].photo);
        }
    },[u]);

    const go_to_profile=()=>{
        if(auth?.currentUser==null){
            history.push("/");
            return;
        }
        const email=auth?.currentUser.email;
        const res=u.filter((user)=>{
           return user.email==email;
        })
    
        const user=res[0];
        dispatch(setSelectedPlayer(user));
        history.push("/profile");
    
    }


    const go_to_friends=()=>{
        history.push("start-game");
    }
	
	const create_new_challenge=()=>{
		dispatch(setInvitedFriends([]));
		dispatch(setFriendChallenged({}))
		history.push("/challenge-friend");
	}

    return(
        

<div style={{position:"relative"}}>
<Header />
<SwipeableViews enableMouseEvents index={index} onChangeIndex={handleChangeIndex}>
    <div style={Object.assign({}, styles.slide, styles.slide1,{height:h})} className="slide" id="slide1">
        <Games drawer={games_drawer} onClose={onGames_drawer_closed} />
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide2,{height:h})} className="slide" id="slide2">
       <Live />
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide3,{height:h})} className="slide" id="slide3">
        <Friends />
    </div>
    
</SwipeableViews>
<div style={{position:"fixed",bottom:"2rem",right:"2rem",
display:"flex",flexDirection:"column",gap:"1rem"}}>
    
   <Fab arial-label="profile"  onClick={create_new_challenge} style={{
        backgroundColor:"indianred",
        color:"whitesmoke"
    }}>
        <AddIcon style={{color:"whitesmoke"}} />
    </Fab>
    {index==1 && <Fab aria-label="add" onClick={go_to_friends}><PeopleAltIcon /></Fab>}
    {index==0 && <Fab aria-label="add" onClick={onGames_drawer_closed} style={{
        backgroundColor:"indianred",
        color:"whitesmoke"
    }}><SettingsIcon style={{color:"whitesmoke"}} /></Fab> }
    
</div>


</div>
    );
}

export default Main;