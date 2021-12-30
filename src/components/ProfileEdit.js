import React,{useState,useEffect} from 'react'
import HeaderBack from './HeaderBack'
import { useDispatch, useSelector} from 'react-redux'
import { selectPicksBought,selectUsers } from '../features/counterSlice'
import { auth, db,storage } from '../firebase_file'
import { Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';


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

import ImageGallery from 'react-image-gallery';
import CircularProgress from '@material-ui/core/CircularProgress';
import firebase from "firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '80vw',
	  display:"flex",
	  flexDirection:"column",
	  alignItems:"center",
	  gap:"1rem"
    },
  },
}));
const ProfileEdit = () => {
	const u=useSelector(selectUsers);
	const [user,setUser]=useState({});
	const [user_photo,setUser_photo]=useState(null);
	const classes = useStyles();
	
	 const [profile_update,setProfile_updated]=useState(false);
    const [loading,setLoading]=useState(false);
    const [progress,setProgress]=useState(0);
	const [following,setFollowing]=useState(false);
	const [username,setUsername]=useState("");
	const [email,setEmail]=useState("");

	useEffect(()=>{
		const email=auth.currentUser.email;
		const res=u.filter((item)=>{
			return item.email==email;
		});
		if(res.length>0){
			const me=res[0];
			setUser(me);
			setUsername(me.username);
			setEmail(me.email);
			
			const photo=me.photo;
			let up="";
			if(photo=="foo.jpg"){
				up=<Avatar onClick={handleClickOpen}>{me.username[0].toLowerCase() }</Avatar>;
			}else{
				up=<img src={photo}  onClick={handleClickOpen}/>
			}
			setUser_photo(up);
		}
	},[,auth,u]);
	
	
	 const [open, setOpen] = useState(false);
    const [alerte,setAlerte]=useState("");

    const handleClickOpen = () => {
        
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
	
	const update_profile=async (e)=>{
		const btn=e.target;
		const key=user.key;
		btn.innerText="Please wait...";
		btn.disabled=true;
		await db.collection("psg_users").doc(key).update(
		{username},
			{merge:true}
		);
		
		await auth.currentUser.updateProfile({
			displayName:username
		});
		btn.innerText="Update Now";
		btn.disabled=false;
	}
	
	
    return (
        <div className="profile_edit ">
            <HeaderBack title_redux={false} title="Edit My Profile"></HeaderBack>
			<div className="profile_edit_body top_img ">
			{user_photo}
			{
                    loading==true &&  <div className="progress_box">
                    <CircularProgress variant="determinate" value={progress} />
                    </div>
                }
			 <form className={classes.root} noValidate autoComplete="off" >
			 <TextField label="" className="input_edit_profile" value={username} 
        onChange={e=>setUsername(e.target.value)}/>
			 </form>
			 <button onClick={update_profile} style={{marginTop:"1rem"}}>
					Update Now
			 </button>
			</div>
			
			
			
			
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

export default ProfileEdit
