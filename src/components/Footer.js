import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import AdjustIcon from '@material-ui/icons/Adjust';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { selectActiveTab, selectUsers, setActiveTab, setPageName } from '../features/counterSlice';
import { auth } from '../firebase_file';
const Footer=()=>{

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
    const dispatch=useDispatch();
    const [active_tab,setActive_tab]=useState(0)
    
    const at=useSelector(selectActiveTab);
    useEffect(()=>{
        setActive_tab(at);
        set_active_tab(at);
        
    },[at]);
    const set_active_tab=(i)=>{
        dispatch(setActiveTab(i));
        var btns=document.querySelectorAll(".footer > button");
        for(var x=0; x<btns.length; x++){
            btns[x].classList.remove("active");
        }
        btns[i].classList.add("active");

        if(i==0){
            dispatch(setPageName("Loby"));
        }else if(i==1){
            dispatch(setPageName("Games"));
        }else if(i==2){
            dispatch(setPageName("Live"));
        }else if(i==3){
            dispatch(setPageName("Friends"));
        }else if(i==4){
            dispatch(setPageName("Profile"));
        }
    }
    return (
        <div className="footer">
            <button  onClick={set_active_tab.bind(this,0)}>
                <HomeIcon />
                Lobby
            </button>

            <button onClick={set_active_tab.bind(this,1)}>
                <ListIcon />
                Games
            </button>

            <button onClick={set_active_tab.bind(this,2)}>
                <AdjustIcon />
                Live
            </button>

            <button onClick={set_active_tab.bind(this,3)}>
                <PeopleIcon />
                Friencds
            </button>

            <button onClick={set_active_tab.bind(this,4)}>
                {
                    photo !="foo.jpg" && <img src={photo} style={
                        {width:"1.5rem", height:"1.5rem", borderRadius:"50%",
                        borderWidth:2,
                        borderColor:"whitesmoke"
                    }} />
                }
                {photo=="foo.jpg" && <AccountCircleIcon />}
                {auth?.currentUser?.displayName?.[0].toUpperCase()}
                {auth?.currentUser?.displayName?.substr(1,5).toLowerCase()}
            </button>

        </div>
    )
}
export default Footer;