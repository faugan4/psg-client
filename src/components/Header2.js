import React,{useState,useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import {useSelector,useDispatch} from "react-redux";
import {selectChallengeDate,selectTab,selectUsers,setActiveSearch,setActiveTab,setChallenge_date,setSelectedPlayer,setTab} from "../features/counterSlice";
import { Avatar } from "@material-ui/core";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { auth, db } from '../firebase_file';
import { useHistory } from 'react-router';
import { Badge } from '@material-ui/core';
import logo from "./img/psg2.png";
import DatePicker from "react-horizontal-datepicker";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    color:"white"
   
  },
  toolbar: {
    minHeight: 60,
    alignItems: 'center',
    backgroundColor:"black",
    color:"white"
    
  },
  title: {
    flexGrow: 1,
    alignSelf: 'flex-end',
    opacity:0,
  },

  bottom:{
      display:"flex",
      justifyContent:"center",
      backgroundColor:"black",
      "& > button":{
          flex:1,
          padding:"0.3rem",
          border:"none",
          backgroundColor:"transparent",
          color:"white",
          fontSize:"1.2rem",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          outline:"none",
          cursor:"pointer",
          "&.active":{
            borderBottom:"3px solid indianred",
            fontWeight:"bold"
          }
      }
  }

}));

export default function ProminentAppBar() {

    const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const history=useHistory();

  const u=useSelector(selectUsers);

  const classes = useStyles();
  const [tab,set_tab]=useState(0)
  const dispatch= useDispatch();

  const tab_index=useSelector(selectTab);
  useEffect(()=>{
    set_tab(tab_index);
    const btns=document.querySelectorAll("#top_btns > button");
    btns.forEach((btn)=>{
        btn.classList.remove("active");
    })
    //console.log("the real index is ",tab_index)
    btns[tab_index]?.classList.add("active");
  },[tab_index]);

  const handle_set_tab=(index)=>{
      //console.log(index);
      if(index==undefined){
          return;
      }
      dispatch(setTab(index));
     // set_tab(index);
     //console.log("here we go",index)
  }

  const go_to_bought_picks=()=>{
    history.push("/bought-picks");
  }
  const go_to_profile=()=>{
    const email=auth.currentUser.email;
    const res=u.filter((user)=>{
       return user.email==email;
    })

    const user=res[0];
    dispatch(setSelectedPlayer(user));
    history.push("/profile");

}

const logout=()=>{
  auth.signOut();
  history.replace("/");      
}

const go_to_home=()=>{
  dispatch(setActiveTab(0)); 
}


const go_to_lobby=()=>{
  history.push("/lobby");
}

const go_to_friends=()=>{
  dispatch(setActiveSearch(true))
  history.push("/start-game");
}
const go_to_wallet=()=>{
  history.push("/wallet");
}

const go_to_subscription=()=>{
	history.push("/subscription");
}

const [invite,setInvite]=useState(0)
useEffect(()=>{
 const unsub= db.collection("psg_challenges").onSnapshot((snap)=>{
    const total_invite=[];
    snap.docs.map((doc)=>{
      const id_challenge=doc.id;
      const friend=doc.data()?.friend;
      //console.log("freinds are ",friend);
      const user=doc.data()?.user;
      if(friend?.indexOf(auth?.currentUser.email)>=0 || user==auth?.currentUser.email){
        total_invite.push(id_challenge);
      }
    });
    let i=0;
    console.log("total is now ",total_invite);
    total_invite.map((ch)=>{
      
      const res=db.collection("psg_picks")
      .where("id_challenge","==",ch)
      .where("user","==",auth?.currentUser.email)
      .onSnapshot((snap)=>{
        if(snap.docs.length==0){
          i++;
          setInvite(i);
        }
      })
      
    })
  })

  return unsub;
},[]);

const [photo,set_photo]=useState("foo.jpg");
useEffect(()=>{
  if(auth?.currentUser!=null){
    set_photo(auth.currentUser.photoURL);
  }
},[auth]);



const selectedDay = (val) =>{
  //alert(val);
  dispatch(setChallenge_date(val));
  
};

const scd=useSelector(selectChallengeDate);
const [calenda,set_calenda]=useState(scd);
useEffect(()=>{
  if(scd!=""){
    set_calenda(scd);
  }
},[scd]);

useEffect(()=>{
  
},[]);

  return (
    <div className={classes.root} id="header">
      <AppBar position="static">
        <Toolbar className={classes.toolbar} >
          <h1 style={{display:"flex",alignItems:"center"}} onClick={go_to_lobby}>
           <img src={logo} style={{width:50,height:40}}/>
          </h1>
          <Typography className={classes.title} variant="h5" noWrap>
            Material-UI
          </Typography>
          <IconButton aria-label="search" color="inherit" onClick={go_to_friends}>
            <SearchIcon style={{color:"white"}} />
          </IconButton>
          <IconButton aria-label="display more actions" edge="end" color="inherit" onClick={handleClick}>
            {/*<MoreIcon style={{color:"white"}} /> */}
            {photo =="foo.jpg" && <Avatar style={{width:"40px",height:"40px",borderRadius:"50%"}}>{auth?.currentUser?.displayName[0].toLowerCase() }</Avatar>}
            {photo != "foo.jpg" && <img src={photo} style={{width:"40px",height:"40px",borderRadius:"50%"}} />}
          </IconButton>

         
          

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            >
           <MenuItem onClick={go_to_profile}>Profile</MenuItem>
           <MenuItem onClick={go_to_subscription}>Subscription</MenuItem>
           <MenuItem onClick={go_to_wallet}>My wallet</MenuItem>
            <MenuItem onClick={go_to_bought_picks}>Picks Bought</MenuItem>
            
            <MenuItem onClick={logout}>Logout</MenuItem>
         </Menu>


        </Toolbar>
        <div className={classes.bottom} id="top_btns">
           <button onClick={(e)=>{handle_set_tab(0)}}>Games</button>
           <button onClick={(e)=>{handle_set_tab(1)}} style={{
             display:"flex",
             alignItems:"center",
             gap:"1rem"
           }}>Live
           
           {invite>0 && <Badge badgeContent={invite} color="secondary"></Badge>}
           </button>
           <button onClick={(e)=>{handle_set_tab(2)}}>Friends</button>
        </div>

        {(tab_index==0 || tab_index==1) && <div style={{
          backgroundColor:"black",
          paddingTop:"0.6rem"
        }}>
       <DatePicker getSelectedDay={selectedDay}
                    endDate={50}
                    selectDate={calenda}
                    labelFormat={"MMM yyyy"}
                    color={"whitesmoke"}  
                           
                />
        </div>
}

        
      </AppBar>
    </div>
  );
}
