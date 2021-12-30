import React,{useState,useEffect} from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { selectInvitedFriend, selectMultipleFriend, selectUsersStats, setInvitedFriends, setSelectedPlayer } from '../features/counterSlice';
import { useHistory } from 'react-router-dom';
import {makeStyles} from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';


const FriendUser=({user,index,onClick,go_to_user_profile,stats,wins,loses,follow})=>{
    const titles=["Game Record","Game Record"]
    if(loses!=undefined){
       // //console.log('wins = a friend ',index,wins,loses,user.email);
    }
   
    const c=useSelector(selectMultipleFriend);
    const fi=useSelector(selectInvitedFriend);
    const [check,set_check]=useState(false);
    const [users_checked,set_users_checked]=useState([]);
    const dispatch=useDispatch();




   useEffect(()=>{
    set_check(c);
   },[c]);

   useEffect(()=>{
    ////console.log(users_checked);
   },[users_checked]);

   useEffect(()=>{
    set_users_checked(fi);
   },[fi])

  
   


   const us=useSelector(selectUsersStats);
   const [l,set_l]=useState(0);
   const [w,set_w]=useState(0);
   const [t,set_t]=useState(0);
   const [wp,set_wp]=useState(".000");
   const [l200,set_l200]=useState("0-0");

   useEffect(()=>{
   // //console.log("id_game follow",follow);
        const res=us.filter((item)=>{
            return item.user==user.email;
        })
        if(res.length>0){
            //console.log(res[0].user)
            set_l200(res[0].user_wins+"-"+res[0].user_loses);
            if(index==0){
                set_l(res[0].user_loses);
                set_w(res[0].user_wins);
                set_t(res[0].user_tie);
                let total=res[0].user_wins + res[0].user_loses;
                if(total>0){
                    let per=w/total;
                    per=per.toFixed(3);
                    per=(""+per).replace("0.",".");
                    set_wp(per);
                }
            }else{
                set_l(res[0].user_loses);
                set_w(res[0].user_wins);
                set_t(res[0].user_tie);
                let total=res[0].user_wins + res[0].user_loses;
                if(total>0){
                    let per=w/total;
                    per=per.toFixed(3);
                    per=per.replace("0.",".");
                    set_wp(per);

                }
            }

           
        }
        
    },[us,index,wp,w,l,t]);      
   
   

    return(
        <div className="player" style={{position:"relative"}}>
            <div className="player_header">
               
                <div onClick={go_to_user_profile}>
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
                        <p>{titles[index]}</p>
                    </div>  
                </div>
                <div>
                    {
                        check==true &&  <Checkbox
                        checked={users_checked.indexOf(user.email)>=0}
                        onChange={e=>{
                            const i=users_checked.indexOf(user.email);
                            if(i>=0){
                                const res=fi.filter((item)=>{
                                    return item!=user.email;
                                })
                                dispatch(setInvitedFriends(res));
                            }else{
                                const old=[...fi];
                                old.push(user.email);
                                dispatch(setInvitedFriends(old))
                                //set_users_checked(old);
                            }
                        }}
                        
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                      />
                    }
                    {
                     check==false &&  <button onClick={onClick}> challenge</button>
                    }
                </div>
                     
            </div>
            <div className="player_body">
                <div>
                    <p>{w} </p>
                    <p>Wins</p>
                </div>

                <div>
                    <p>{l}</p>
                    <p>Loses </p>
                </div>

                <div>
                    {t}
                    <p>Tie</p>
                </div>

                <div>
                    {l200}
                    <p>Last 200</p>
                </div>

                <div style={{display:"none"}}>
                    {wp}
                    <p>Hitting %</p>
                </div>


            </div>
        </div>
    );
}

export default FriendUser;