import logo from "./img/logo.png" ;
import SettingsIcon from '@material-ui/icons/Settings';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SearchIcon from '@material-ui/icons/Search';
import { useSelector,useDispatch } from "react-redux";
import { selectPageName,setActiveTab,selectUsers,selectHeaderTab,setHeaderTab,setSelectedPlayer } from "../features/counterSlice";
import { useEffect } from "react";
import { useState } from "react";
import { auth } from "../firebase_file";
import { useHistory } from "react-router-dom";
import { load_games_picked } from "../functions";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
const Header=()=>{
    const pn=useSelector(selectPageName);
    const [page_name,setPage_name]=useState("");
    const history=useHistory();
    const dispatch=useDispatch();
    const [old_tab,setOlb_tab]=useState(0);

    const [index,setIndex]=useState(0);
    const header_tab=useSelector(selectHeaderTab);

    useEffect(()=>{
        setIndex(header_tab);
        const btns=document.querySelectorAll(".header_tabs > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })

        btns[header_tab].classList.add("active");

        if(header_tab==2){
            document.querySelector(".header_title").style.display="none";
            document.querySelector(".header_zone_search").style.display="flex";
            document.querySelector(".header_search_btn").style.display="none";
        }else{
            document.querySelector(".header_title").style.display="block";
            document.querySelector(".header_zone_search").style.display="none";
            document.querySelector(".header_search_btn").style.display="block";
        }
    },[header_tab])


    const u=useSelector(selectUsers);
    const [info,setInfo]=useState([]);
    const [photo,setPhoto]=useState("foo.jpg");

    useEffect(()=>{
        setInfo(u);
        const res=u.filter((user)=>{
            return user.email==auth?.currentUser.email;
        });
        if(res.length>0){
            setPhoto(res[0].photo);
        }
    },[u]);


    useEffect(()=>{
        setPage_name(pn);
    },[pn])

    useEffect(()=>{
         //load_games_picked();
    },[]);

    const logout=()=>{
        auth.signOut();
        history.replace("/");      
    }

    const go_to_home=()=>{
        dispatch(setActiveTab(0)); 
    }


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const go_to_bought_picks=()=>{
        history.push("/bought-picks");
    }

    const set_header_tab=(index)=>{
        dispatch(setHeaderTab(index))
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

    const make_search=()=>{
        setOlb_tab(header_tab);
        dispatch(setHeaderTab(2));
        /*document.querySelector(".header_title").style.display="none";
        document.querySelector(".header_zone_search").style.display="block";*/
    }
    const go_back=()=>{
        /*dispatch(setHeaderTab(old_tab));
        document.querySelector(".header_title").style.display="block";
        document.querySelector(".header_zone_search").style.display="none";*/
    }

    return(
        <div className="header">
            <div className="header_first_line">
                
                <h1 onClick={go_to_home} className="header_title">
                   ProSport.Guru
                </h1>
                <div className="header_zone_search">
                    <button onClick={go_back}>
                        <SearchIcon />
                    </button>
                    <input type="search" autoFocus className="header_search" placeholder="Search friends" />
                </div>
                
                <div className="header_first_line_right">
                  
                    <button className="header_search_btn" onClick={make_search}><SearchIcon /></button>

                    <Button aria-controls="simple-menu" id="btn_menu" aria-haspopup="true" onClick={handleClick}>
                    {
                        photo !="foo.jpg" && <img src={photo} style={
                            {width:"3rem", height:"3rem", borderRadius:"50%",
                            borderWidth:2,
                            borderColor:"whitesmoke"
                        }} />
                    }
                    {photo=="foo.jpg" && <AccountCircleIcon style={{width:"3rem",height:"3rem",borderRadius:"50%"}} />}
                    
                    </Button>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={go_to_profile}>Profile</MenuItem>
                        <MenuItem onClick={go_to_bought_picks}>Picks Bought</MenuItem>
                        <MenuItem onClick={handleClose}>My wallet</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>

            <div className="header_tabs">
               <button onClick={set_header_tab.bind(this,0)}>GAMES</button>
               <button onClick={set_header_tab.bind(this,1)}>LIVE</button>
               <button onClick={set_header_tab.bind(this,2)}>FRIENDS</button>
            </div>
           
        </div>
    );
}

export default Header;