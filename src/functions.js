import SportsBaseballIcon from '@material-ui/icons/SportsBaseball';
import SportsBasketballIcon from '@material-ui/icons/SportsBasketball';
import SportsSoccerIcon from '@material-ui/icons/SportsSoccer';
import SportsFootballIcon from '@material-ui/icons/SportsFootball';
import HeadsetMicIcon from '@material-ui/icons/HeadsetMic';
import SportsMmaIcon from '@material-ui/icons/SportsMma';
import SportsHockeyIcon from '@material-ui/icons/SportsHockey';
import {db} from "./firebase_file";
import firebase from "firebase";

const baseball_icon=<SportsBaseballIcon />;
const basketball_icon=<SportsBasketballIcon />;
const soccer_icon=<SportsSoccerIcon/>;
const football_icon=<SportsFootballIcon/>;
const esport_icon=<HeadsetMicIcon/>;
const mma_icon=<SportsMmaIcon/>;
const hockey_icon=<SportsHockeyIcon/>;

const icons=[
  {id:1,icon:football_icon},
  {id:2,icon:basketball_icon},
  {id:3,icon:hockey_icon},
  {id:4,icon:esport_icon},
  {id:5,icon:soccer_icon},
  {id:6,icon:baseball_icon},
  {id:7,icon:mma_icon}
]

const get_today_time=async ()=>{
 
  await db.collection("psg_today").doc("date").set({date:firebase.firestore.FieldValue.serverTimestamp()});
  const res_date=await db.collection("psg_today").doc("date").get();
  const today_date=res_date.data().date;
  const today_time=today_date?.seconds*1000;
  return today_time;
  //dispatch(setTodayTime(today_time));
}



const challenged_closed=(key,type,nb_player,res,gm )=>{
      let closed=false;
      if(type=="2" && nb_player==2){
        closed=true;
    }

    if(type=="3" && nb_player==10){
        closed=true;
    }

    const all_games=[];
    res.forEach((item)=>{
        
        const a_user_picks=item?.picks;
        ////console.log("picks of ",key,a_user_picks)
        a_user_picks.forEach((pick_line)=>{
            const id_game_picked=pick_line.id_game;
            all_games.push(id_game_picked);
        })
    })

    let game_started=false;
    all_games.forEach((id)=>{
        const rp=gm.filter((item)=>{
            return id==item.key && item.diff>0 ;
        })
        if(rp.length==0){
            game_started=true;
        }
    })

    if(game_started==true){
        closed=true;
    }
  return {closed,game_started};

}

const get_pick_key=(pick)=>{
    const pick_league=pick.league;
    const pick_id_game=pick.id_game;
    const pick_type_pick=pick.type_pick;
    const pick_team_picked=pick.team_picked;

    const pick_uniq_key=`${pick_id_game}-${pick_league}-${pick_type_pick}-${pick_team_picked}`;
    return pick_uniq_key;
    
}

function get_user_status(nb_pick,wp){

    let status="Clown";
    let stars=1;
    if(nb_pick<20){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    } else if(nb_pick<40){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Sharp";
            stars=5;
        }
    }else if(nb_pick<60){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }else if(nb_pick<20){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }else if(nb_pick<80){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }else if(nb_pick<100){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }else if(nb_pick<120){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }else if(nb_pick<160){
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }else{
        if(wp<0.25){
            status="Clown";
            stars=1;
        }else if(wp<0.35){
            status="Pretender";
            stars=2;
        }else if(wp<0.5){
            status="Player";
            stars=3;
        }else if(wp<0.6){
            status="Capper";
            stars=4;
        }else{
            status="Capper";
            stars=5;
        }
    }



    return {status,stars};
}
export {icons,get_today_time,challenged_closed,get_pick_key,get_user_status};