import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers, setSelectedPlayer } from '../features/counterSlice';
import Avatar from '@material-ui/core/Avatar';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { useHistory } from 'react-router-dom';
import { auth } from '../firebase_file';

const ProfileTopUsers = () => {
    const history=useHistory();
    const dispatch=useDispatch();
    const [users,setAll_users]=useState([]);
    const u=useSelector(selectUsers);

    useEffect(()=>{
        const other_users=u.filter((user)=>{
            return user.email!=auth.currentUser?.email;
        })
        setAll_users(other_users);
    },[u]);
    const go_to_profil=(user)=>{
        dispatch(setSelectedPlayer(user));
        history.push("/player-profile");
    }
    return (
        <div className="profileTopUsers">
            <div className="users">
           {
               users.slice(0,5).map((user)=>{
                   let user_photo=null;
                   if(user.photo==="foo.jpg"){
                    user_photo=<Avatar>{user.username[0].toLowerCase() }</Avatar>
                   }else{
                       user_photo=<img src={user.photo} />;
                   }
                   let username=user.username;
                   if(username.length>6){
                       username=username.substring(0,6)+"...";
                   }
                   return(
                       <div className="user" key={user.key} onClick={go_to_profil.bind(this,user)}>
                           {user_photo}
                           <p>{username[0].toUpperCase()}{username.substring(1,username.length).toLowerCase()}</p>
                        </div>
                   );
               })
           }
           </div>
           <div className="next_users">
               <button>
                   <NavigateNextIcon />
               </button>
           </div>
        </div>
    )
}

export default ProfileTopUsers
