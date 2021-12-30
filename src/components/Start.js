import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import GroupIcon from '@material-ui/icons/Group';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PetsIcon from '@material-ui/icons/Pets';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectMyPicks, selectPicks, setStartPlaying } from '../features/counterSlice';
import { FormatListNumberedRtlTwoTone } from '@material-ui/icons';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({userInfo}) {
  const dispatch=useDispatch();
  const history=useHistory();
  const [open, setOpen] = useState(false);
  const [picks,setAll_picks]=useState([]);
  const [show_start,setShow_start]=useState(false);
  const p=useSelector(selectPicks)
  const mypicks=useSelector(selectMyPicks);

  useEffect(()=>{
    if(userInfo==undefined){
      if(mypicks.length>0){
        setShow_start(false);
      }else{
        setShow_start(true);
      }
      
      setAll_picks(mypicks);
    }else{
      setShow_start(false);
      const ue=userInfo.email;
      const res=p.filter((item)=>{
        //console.log(item);
        return item.user==ue;
      })
      setAll_picks(res);
    }

  },[p,mypicks]);

  const handleClickOpen = () => {
    //(true);
    history.push("/start-game")
  };

  const handleClose = () => {
    setOpen(false);
  };

  const start_playing=(type)=>{
    dispatch(setStartPlaying(type));
    history.push("/start-playing");
  }

  return (
    <div className="start">
      <div className="no_records">
        {
          picks.length==0 && <p>No records founds!</p>
        }
        {
          picks.length>0 && <p>Pending records...</p>
        }
        
		
      </div>

      {show_start ==true && <button className="btn_stats_follow"  onClick={handleClickOpen}>
        Start Playing Now
      </button>
      }
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Select a type of game"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="start_options">
              <div onClick={start_playing.bind(this,1)}>
                  <DesktopMacIcon />
                  <p>Mission with debby</p>
              </div>

              <div onClick={start_playing.bind(this,2)}>
                  <GroupIcon />
                  <p>Heads UP</p>
              </div>
            </div>


            <div className="start_options">
              <div onClick={start_playing.bind(this,3)}>
                  <GroupAddIcon />
                  <p>Sports Booth</p>
              </div>

              <div onClick={start_playing.bind(this,4)}>
                  <PetsIcon />
                  <p>Tournament</p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}