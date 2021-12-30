import { useEffect, useState } from "react";
import SearchIcon from '@material-ui/icons/Search';
import { useDispatch, useSelector } from "react-redux";
import { selectSearchFriendText, selectUsers, setActiveSearch, setFriendChallenged, 
    setInvitedFriends, setSelectedPlayer,selectUsersStats, selectFollow ,setFriends,selectFriends} from "../features/counterSlice";
import FriendsUser from "./FriendsUser";


import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import { useHistory } from "react-router-dom";
import { auth } from "../firebase_file";

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



const Friends=(props)=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const [data,setData]=useState([]);
    const [data_follow,set_data_follow]=useState([]);
    const [data_public,set_data_public]=useState([]);
    const [search,setSearch]=useState("");
    const [index,setIndex]=useState(0);
    const u=useSelector(selectUsers);
    const s=useSelector(selectSearchFriendText);
    const [tab,setTab]=useState(0);
    const us=useSelector(selectUsersStats);
    const f=useSelector(selectFollow);
    const all_friends=useSelector(selectFriends);


    const tab_changed=(e)=>{
        const btn=e.target;
        const i=btn.dataset.index;
        
        const btns=document.querySelectorAll(".friends_header_tab>button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        btn.classList.add("active");
        setIndex(i);
    }

    useEffect(()=>{
       //setIndex(tab);
        //console.log("user is",auth?.currentUser?.email);
        const res=u.filter((user)=>{
            return user.email != auth?.currentUser?.email;
        })
        const res2=f.filter((item)=>{
            return item.user==auth.currentUser.email;
        })

        const following_users_email=res2.map((item)=>{
            return item.follow;
        })
        
        const res_follow=res.filter((item)=>{
            return following_users_email.indexOf(item.email)>=0;
        })

        const res_public=res.filter((item)=>{
            return following_users_email.indexOf(item.email)<0;
        })

        
       
        if(index==1){
           //setData(res_follow);
            set_data_follow(res_follow);
            //console.log("id_game index zero",res_follow)
            dispatch(setFriends(res_follow));
        }else{
            //setData(res_public);
            set_data_public(res_public);
            dispatch(setFriends(res_public));
            //console.log("id_game index one",res_public);
        }

        
    },[tab,index]);

    const challenge=(user,index)=>{
        const friend={...user,type:index};
        dispatch(setFriendChallenged(friend));
        dispatch(setInvitedFriends([user.email]));
        dispatch(setActiveSearch(false))
        history.push("/challenge-friend")
    }

    const go_to_user_profile=async (user)=>{
        await dispatch(setSelectedPlayer(user));
        history.push("/player-profile");
    }

    useEffect(()=>{
        const res=data_public.filter((user)=>{
            return user.username.toLowerCase().indexOf(search.toLowerCase())>=0 
            && user.email!=auth?.currentUser?.email;
        })
        setData(res);
        //console.log("we are in search now")
    },[search]);

    const handleChangeIndex=(index)=>{
        
        setIndex(index);
        setTab(index);
     }
     const handleChange=(object,value)=>{
         
         setTab(value);
         setIndex(value);
     }

     
     

     useEffect(()=>{
        let new_s=s.toLowerCase();
        const res=data_public.filter((user)=>{
            return user?.email.indexOf(new_s)>=0 || user?.username.toLowerCase().indexOf(new_s)>=0;
        })

        const res2=res.filter((user)=>{
            return user.email != auth?.currentUser?.email;
        });

        setData(res2);
        
     },[s]);

     const [total_friends,set_total_friends]=useState(0)
     useEffect(()=>{
        setData(all_friends);
        
     },[all_friends]);

     useEffect(()=>{
        
			const res=f.filter((item)=>{
				return item.user==auth?.currentUser?.email;
			});
			set_total_friends(res.length);
		
     },[f]);
    
    return (
        <div className="friends">
           
            <div>
        <Tabs  variant="fullWidth" style={styles.tabs} value={tab} onChange={handleChange}>
            <Tab label="The Public" />
            <Tab label={`My Club (${total_friends})`} />
          

        </Tabs>
        <SwipeableViews index={index}  onChangeIndex={handleChangeIndex}>
        <div className="friends_body">
               {
                   data.map((user)=>{
                       const stats=us?.filter((line)=>{
                           return line.user==user.email;
                       })

                      
                       let w=0;
                       let l=0;
                       let t=0;
                       let wp="0.000";
                       if(stats.length>0){
                           let stat=stats[0];
                           if(index==0){
                            w=stat.user_wins_h2h;
                            l=stat.user_loses_h2h;
                            t=stat.user_tie_h2h;
                            
                           }else{
                            w=stat.user_wins_sb;
                            l=stat.user_loses_sb;
                            t=stat.user_tie_sb;
                           }

                           let total=w+l;
                           if(total>0){
                               wp=w/total;
                           }
                           //console.log("wins =",index,"=",w,l,t,total,wp,user.email)
                       }

                       return(
                           <FriendsUser 
                           key={user.key} user={user} 
                           index={index} 
                           stats={stats.length>0? stats[0] : null}
                           wins={w}
                           loses={l}
                           follow={f}
                           go_to_user_profile={go_to_user_profile.bind(this,user)}
                           onClick={challenge.bind(this,user,index)}/>
                       );
                   })
               }
            </div>

            <div className="friends_body">
               {
                   data.map((user)=>{
                      
                       return(
                        <FriendsUser key={user.key} user={user} index={index} 
                        go_to_user_profile={go_to_user_profile.bind(this,user)}
                        onClick={challenge.bind(this,user,index)}/>
                       );
                   })
               }
            </div>
            
           
        </SwipeableViews>
      </div>


        </div>
    );
}
export default Friends;