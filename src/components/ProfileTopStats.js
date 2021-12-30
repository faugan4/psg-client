import { Avatar } from '@material-ui/core';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUsers, setMyPicks,selectFollow, 
    selectUsersStats,
    setFriendChallenged, setInvitedFriends, selectPicks, selectTournaments } from '../features/counterSlice';
import { auth, db, storage } from '../firebase_file';
import StarIcon from '@material-ui/icons/Star';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import logo from "./img/logo.png";

import ReplyIcon from '@material-ui/icons/Reply';



import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';


import ImageGallery from 'react-image-gallery';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from "firebase";

import { useHistory } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });



const ProfileTopStats = ({userInfo}) => {
    const dispatch=useDispatch();
	const history=useHistory();
    const u=useSelector(selectUsers);
	
    const all_picks=useSelector(selectPicks);
    const challenges=useSelector(selectTournaments);

    const us=useSelector(selectUsersStats);

    const [username,setUsername]=useState(null);
    const [useremail,setUseremail]=useState(null);
    const [date,setDate]=useState(null);
    const [info,setInfo]=useState(null);
    const [nb_picks,setNb_picks]=useState(0);
    const [nb_games,setNb_games]=useState(0);
    const [status,set_status]=useState("Clown");
    const [stars,set_stars]=useState(1);
    const [user_photo,setUser_photo]=useState(null);
    const [profile_update,setProfile_updated]=useState(false);
    const [loading,setLoading]=useState(false);
    const [progress,setProgress]=useState(0);
	
    const f=useSelector(selectFollow);
    const [following,setFollowing]=useState(false);
	const [nb_follow,setNb_follow]=useState(0);

	const [my_follow,setMy_follow]=useState([]);
	useEffect(()=>{
		const res=f.filter((item)=>{
			return item.user==auth.currentUser.email;
		});
		setMy_follow(res);
		
		if(userInfo!=undefined){
			const em=userInfo.email;
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

    useEffect(()=>{
       // //console.log("the u is ",u);
        let ue="";
        if(userInfo==undefined){
            setUsername(auth.currentUser?.displayName);
            ue=auth.currentUser?.email;
            setUseremail(ue);
        }else{
            setUsername(userInfo.username);
            ue=userInfo.email;
            setUseremail(ue);
        }

        //console.log("the email is ",ue);
        
        const res=u.filter((user)=>{
            return user.email==ue;
        })

        //console.log("ok for ",res);

        if(res.length>0){
            setInfo(res[0]);
            let dt=new Date(parseInt(res[0].date)*1000).toUTCString();
            dt=dt.split(" ");
            setDate(dt[2]+" "+dt[3]);
        }
    },[u]);

    
    useEffect(()=>{
        //console.log("we are updating again that");
        if(info==null){
            return;
        }

        let up="";
        if(info.photo=="foo.jpg"){
            up=<Avatar onClick={handleClickOpen}>{info.username[0].toLowerCase() }</Avatar>;
        }else{
            up=<img src={info.photo}  onClick={handleClickOpen}/>
        }
        setUser_photo(up);

        
        
        const res=all_picks.filter((item)=>{
            return item.user==info.email;
        })
        
        const res2=res.filter((item)=>{
            ////console.log("we can ",item);
            let exists=false;
            challenges.forEach((i)=>{
                if(i.key==item.id_challenge){
                    exists=true;
                }
            })
    
            return exists;
        })
        let games=[];
        let my_picks=[];
        
        setNb_games(res2.length);
        //console.log("at the end res=",res2);
        res2.map((pick)=>{
            const date2=pick.date*1000;
            const pick2=pick.picks;
            const pick_res=pick.results;
            if(pick_res==undefined){
                //return false;
            }
            const id_ch=pick.id_challenge;
            let infos="";
            if(pick.infos!=undefined){
                infos=pick.infos;
            }
            //const infos=pick.infos;
            let cpt=0;
            pick2.map((pickx)=>{
                const id_game2=pickx.id_game;
                let pick_result="";
                if(pick_res!=undefined){
                     pick_result=pick_res[cpt];
                }
                
                
                const a_pick2={...pickx,id_game:id_game2,pick:pick2,date:date2,pick_result,id_challenge:id_ch,infos:infos[cpt]};
                const type_pick=pickx.type_pick;
                const team_picked=pickx.team_picked;
                //console.log("at the end pd=",id_game2,type_pick,team_picked);
                my_picks.push(a_pick2);
                cpt++;
                if(games.indexOf(id_game2)<0){
                    games.push(id_game2);
                }
            })
        })
        //setNb_games(games.length);
        dispatch(setMyPicks(my_picks));
       // setNb_picks(my_picks.length);


        //console.log("at the end ",games.length)
        //console.log("at the end ",my_picks.length,info.email);
        //console.log("at the end ",my_picks);
       
        


    },[info,profile_update,u,all_picks]);

    useEffect(()=>{
        const res=us.filter((item)=>{
            return item.user==useremail;
        })
        if(res.length>0){
            const stats=res[0];
            set_status(stats.status);
            set_stars(stats.stars);
            setNb_picks(stats.user_total_picks);
        }
    },[us,useremail]);


    const [open, setOpen] = React.useState(false);
    const [alerte,setAlerte]=useState("");

    const handleClickOpen = () => {
        if(userInfo!=undefined){
            return;
        }
        setAlerte("");
        setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    const delete_photo=async (e)=>{
        var btn=e.target;
        btn.disabled=true;
        setAlerte("Please wait...");
        const email=auth.currentUser.email;
        const res=u.filter((user)=>{
            return user.email==email;
        })
       const key=res[0]?.key;

     await  db.collection("psg_users").doc(key).update(
          {photo:"foo.jpg"},
          {merge:true}
      )

      setAlerte("");
      setOpen(false);
    }

    const galery_photo=async (e)=>{
        document.querySelector("#file").click();
        setOpen(false);
        setAlerte("");
    }

    const file_changed=async (e)=>{
        const files=e.target.files;
        //console.log("ok it has changed");
        if(files.length==0){
            setOpen(true);
            setAlerte("");
            return;
        }

        setLoading(true);
        setProgress(5);
        const file=files[0];
        let name=file.name;
         const email=auth.currentUser.email;
         const key=u.filter((user)=>{
             return user.email==email
         })[0]?.key;

         //console.log("Please wait...");

        const res=await storage.ref("profiles/"+name).put(file);
        setProgress(33);
        //console.log("done");
        //console.log("downloading url");

        const url=await storage.ref("profiles/"+name).getDownloadURL();
        //console.log("done ");
        //console.log(url);
        setProgress(66);

        //console.log("updateing");

        await  db.collection("psg_users").doc(key).update(
            {photo:url},
            {merge:true}
        )
        setProgress(100);
        setProfile_updated(true);
        setLoading(false);
        setProgress(0);


       
    }

	const follow=async (e)=>{
		const user=auth.currentUser.email;
		const follow=userInfo.email;
		
		const obj={user,follow,date:firebase.firestore.FieldValue.serverTimestamp()}
		
		const btn=e.target;
		btn.disabled=true;
		btn.innerText="Please wait...";
		await db.collection("psg_follow").add(obj);
		
		btn.disabled=false;
		btn.innerText="Follow";
	}
	
	const unfollow=async(e)=>{
		const user=auth.currentUser.email;
		const follow=userInfo.email;
		const res=my_follow.filter((item)=>{
			return item.user==user && item.follow==follow;
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
	
	const edit_profil=()=>{
		history.push("profile-edit");
	}
   
   
   useEffect(()=>{
		if(useremail!=null){
			const res=f.filter((item)=>{
				return item.user==useremail;
			});
			setNb_follow(res.length);
		}
	},[f,useremail]);


	const view_followers=()=>{
		if(userInfo==undefined){
			history.push("/followers");
		}
	}

    const challenge_player=()=>{
        dispatch(setFriendChallenged(userInfo));
        dispatch(setInvitedFriends([userInfo.email]))
        history.push("/challenge-friend");
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose2 = () => {
      setAnchorEl(null);
    };
  
    const open2 = Boolean(anchorEl);
    const id = open2 ? 'simple-popover' : undefined;

    
    const open_status_modal=()=>{
        alert("ok going to open it");
    }
    return (
        <div className="profileTopStats_parent">
           
            <div className="profileTopStats">
            <div className="top_img">
                {user_photo}
                <p className="top_img_username">
                    {username?.[0].toUpperCase()}{username?.substring(1,username?.length)}
                </p>
                <p style={{color:"gray",fontSize:"0.8rem"}}>{status}</p>
                <div className="btns" onClick={handleClick} >
                    <StarOutlineIcon className="active"/>
                    <StarOutlineIcon className={stars>=2? "active":""}/>
                    <StarOutlineIcon className={stars>=3? "active":""}/>
                    <StarOutlineIcon className={stars>=4? "active":""}/>
                    <StarOutlineIcon className={stars>=5? "active":""}/>
                </div>
                <Popover
                    id={id}
                    open={open2}
                    anchorEl={anchorEl}
                    onClose={handleClose2}
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                    }}
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                    }}
                >
                    <div className="status_line">
                        <div>
                            <StarOutlineIcon className="active"/> 
                        </div>
                        <p>Clown</p>
                    </div>

                    <div className="status_line">
                        <div>
                            <StarOutlineIcon className="active"/>
                            <StarOutlineIcon className="active"/>
                        </div>
                         <p>Pretender</p>
                    </div>

                    <div className="status_line">
                        <div>
                            <StarOutlineIcon className="active"/>
                            <StarOutlineIcon className="active"/>
                            <StarOutlineIcon className="active"/>
                        </div>
                         <p>Player</p>
                    </div>

                    <div className="status_line">
                        <div>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        </div>
                         <p>Capper</p>
                    </div>

                    <div className="status_line">
                        <div>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        <StarOutlineIcon className="active"/>
                        </div>
                        <p>Sharp</p>
                    </div>
                </Popover>
                
                <p className="top_img_joined_date">Joined {date}</p>
                {
                    loading==true &&  <div className="progress_box">
                    <CircularProgress variant="determinate" value={progress} />
                    </div>
                }
                <div className="top_img_actions">
                    <p>{info?.coins} Coins</p>
                    <button>Deposit</button>
                </div>
            </div>
            
            <div className="profile_top_stats_bottom">
                <div>
                    <p>{nb_games}</p>
                    <p>Games</p>
                </div>
                <div>
                    <p>{nb_picks}</p>
                    <p>Picks</p>
                </div>
                <div onClick={view_followers}>
                    <p>{nb_follow}</p>
                    <p>My Club</p>
                </div>
            </div>

           
        </div>

		{
			userInfo !=  undefined && <div className="profile_top_stats_actions">
			{following ==false &&<button className="btn_stats_follow" onClick={follow} style={{
                display:"none"
            }}>Follow</button>}
			{following ==true &&<button className="btn_stats_follow" onClick={unfollow}
            style={{display:"none"}}
            >Unfollow</button>}
                <button className="btn_stats_challenge" onClick={challenge_player} style={{
                    display:"none"
                }}><ReplyIcon /></button>
        </div>
		}
		
		{
			userInfo ==  undefined && <div className="profile_top_stats_actions" style={{
                display:"none"
            }}>
                <button className="btn_stats_follow" onClick={edit_profil}>Edit Profile</button>
        </div>
		}
		
		
		
        
		  
        <div>
     
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Profile picture"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
              <div>
                <button id="btn_delete_photo" onClick={delete_photo}>
                        <DeleteOutlinedIcon />
                </button>
                <p>Delete</p>
              </div>

              <div>
                <button id="btn_delete_photo" onClick={galery_photo}>
                        <InsertPhotoOutlinedIcon />
                </button>
                <p>Change picture</p>
              </div>

              <div style={{display:"none"}}>
                  <input type="file" id="file" onChange={file_changed} accept="image/png, image/gif, image/jpeg"   />
              </div>
              
           
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <p>{alerte}</p>
        </DialogActions>
      </Dialog>
    </div>
            
        </div>
    )
}

export default ProfileTopStats
