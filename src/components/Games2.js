import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectGames, selectGames_drawer, selectLeagues, selectPicks, selectSports, selectTournaments, setSelectedTournament, setSinglePageName, set_games_Drawer } from "../features/counterSlice";
import { challenged_closed, icons } from "../functions";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {auth, db} from "../firebase_file";
import { useHistory } from "react-router-dom";

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SettingsIcon from '@material-ui/icons/Settings';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import Drawer from '@material-ui/core/Drawer';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@material-ui/core/Switch';

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Fab, Link, Typography } from "@material-ui/core";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { bounce } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import DatePicker from "react-horizontal-datepicker";

const useStyles = makeStyles({
    table: {
      maxWidth: "100%",
    },

    bounce: {
        animation: 'x 1s',
        animationName: Radium.keyframes(bounce, 'bounce')
      }

  });
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
 
  
const Games=(props)=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const classes = useStyles();

    const s=useSelector(selectSports);
    const l=useSelector(selectLeagues);
    const tournaments=useSelector(selectTournaments);
    const picks=useSelector(selectPicks) ;

    const [sports,setAll_sports]=useState([]);
    const [leagues,setAll_leagues]=useState([]);

    const gd=useSelector(selectGames_drawer);
    const gm=useSelector(selectGames)

    const [selected_sport,setSelected_sport]=useState(gd.sport);
    const [selected_league,setSelected_league]=useState(gd.league);
    const [selected_mode,setSelected_mode]=useState(gd.mode);
    const [selected_type,setSelected_type]=useState(gd.type);

    
    const [play_type,setPlay_type]=useState(gd.real);
    const [real_play,set_real_play]=useState(gd.real);
    const [entry,setEntry]=useState(gd.entry);

    const [games,setAll_games]=useState([]);
    const [loading,set_loading]=useState(false);
    

    useEffect(()=>{
        setAll_sports(s);
    },[s]);

    useEffect(()=>{
        setAll_leagues(l);
    },[l])

    useEffect(()=>{
        const res=l.filter((i)=>{
            return i.id_sport==selected_sport;
        })
        setAll_leagues(res);
    },[selected_sport]);
    const sport_clicked=(id_sport)=>{
       const btns=document.querySelectorAll(".games_sports>button");
       btns.forEach((btn)=>{
           btn.classList.remove("active");
       })
       const btn=document.querySelector("button[data-idSport='"+id_sport+"']");
       btn.classList.add("active");
       setSelected_sport(id_sport);
       setSelected_league(0);
    }

    const set_play_type=(entry)=>{
        setPlay_type(entry);
        const btns=document.querySelectorAll(".games_btns_free_money > button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })

        btns[entry].classList.add("active");
    }

    const set_entry=(index,entry)=>{
        const btns=document.querySelectorAll(".games_btns_entries>button");
        btns.forEach((btn)=>{
            btn.classList.remove("active");
        })
        btns[index]?.classList.add("active");
        setEntry(entry);
    }

    useEffect(()=>{

      set_loading(true);
       const unsub= db.collection("psg_challenges")
        .onSnapshot((snap)=>{
          
            const g=[];
            snap.docs.map((doc)=>{
                const id=doc.id;
                const data=doc.data();
                data.key=id;
                let name=data.name;
                const nb_game=data.number_game;
                const league=data.league;
                const mode=data.mode;
                const sport=data.sport;
                const fee=data.entry;
                const type=data.type;
                const new_type=selected_type+1;
                
                if(new_type==0 || (new_type!=0 && type==new_type) ){
                   
                }
                if(selected_type==0 || (new_type!=0 && type==new_type)){
                    //console.log("we are in for ",type,new_type);
                    const z_data=data.z_data;
                    const game={name,nb_game,league,sport,mode,fee,type,z_data,key:id};
                    g.push(game);
                }
               
            })

            setAll_games(g)
            set_loading(false);
        })

        return unsub;
    },[selected_sport,selected_type]);

    const go_to_tournament=(key,game_started,closed)=>{
        ////console.log(key);
        ////console.log(tournaments);
        const t= tournaments.filter((line)=>{
            //console.log(line.key,key);
            return line.key==key;
        })
        //console.log(t);
        if(t.length>0){
            const selected_t=t[0];
            const el={...selected_t,closed,started:game_started};
            dispatch(setSelectedTournament(el));
            dispatch(setSinglePageName(el.name));
            history.push("/challenge");
            
        }
    }
   
    const [drawer,setDrawer]=useState(false);
   
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawer(open);
      };

    const handle_switch=(e)=>{
        const ps=document.querySelectorAll(".drawer_switch_box > p");
        ps.forEach((p)=>{
            p.classList.remove("active");
        })
    
        if(real_play==false){
            ps[1].classList.add("active")      
        }else{
            ps[0].classList.add("active");
        }
        const old={...gd,entry:0}  
        dispatch(set_games_Drawer(old));
        set_money_name("Free");

        set_real_play(!real_play);
    }

    const handleClick=()=>{
        
    }

    const [sport_name,set_sport_name]=useState("All Sports");
    useEffect(()=>{
        const old={...gd,sport:selected_sport};
        dispatch(set_games_Drawer(old));

        const res=s.filter((sport)=>{
            return sport.id==selected_sport;
        })
        if(res.length==0){
            set_sport_name("All Sports");
            return;
        }
        set_sport_name(res[0]?.name);
        
    },[selected_sport]);

    const [league_name,set_league_name]=useState("All Leagues");
    useEffect(()=>{
        const old={...gd,league:selected_league};
        dispatch(set_games_Drawer(old));
        const res=l.filter((league)=>{
            return league.id==selected_league;
        })
        if(res.length==0){
            set_league_name("All Leagues");
            return;
        }
        set_league_name(res[0]?.name);
    },[selected_league]);

    const [mode_name,set_mode_name]=useState("All Mode");
    useEffect(()=>{
        const old={...gd,mode:selected_mode};
        dispatch(set_games_Drawer(old));
        if(selected_mode=="0"){
            set_mode_name("All Mode");
        }else if(selected_mode=="1"){
            set_mode_name("Most Wins");
        }else if(selected_mode=="2"){
            set_mode_name("Longest Winning Streak");
        }
    },[selected_mode]);

    const [type_name,set_type_name]=useState("All Type");
    useEffect(()=>{
        const old={...gd,type:selected_type};
        dispatch(set_games_Drawer(old));
        if(selected_type=="0"){
            set_type_name("All Type");
        }else if(selected_type=="1"){
            set_type_name("Heads Up");
        }else if(selected_type=="2"){
            set_type_name("Sports Booth");
        }else if(selected_type=="3"){
            set_type_name("Tournament");
        }
    },[selected_type]);

    const [play_type_name,set_play_type_name]=useState("Free to Play");

    useEffect(()=>{
        const old={...gd,real:real_play};
        dispatch(set_games_Drawer(old));
        if(real_play){
            set_play_type_name("Real Money Play");
        }else{
            set_play_type_name("Free to Play");
        }
    },[real_play]);

    const [money_name,set_money_name]=useState("")
    useEffect(()=>{
        const old={...gd,entry:entry};
        dispatch(set_games_Drawer(old));
        if(entry=="0"){
            set_money_name("Free");
            return;
        }
        if(real_play){
            set_money_name("$"+entry);
        }else{
            set_money_name(entry+" Coins");
        }
        
    },[entry]);

    const [empty,setEmpty]=useState(true);

   
    const [calenda,set_calenda]=useState(new Date());
    const selectedDay = (val) =>{
        //alert(val);
       // set_calenda(val);
    };
    
    return(
        <div className="games" style={{position:"relative"}}>
            <div style={{
                display:"flex",
                justifyContent:"center",
                alignItmes:"center",
                flexDirection: "column",
                position:"sticky",
                top:"0"
            }}>
                <button   onClick={props.onClose} style={{
                border:"none",
                flex:1,
                padding:"1rem",
                display:"none",
                fontWeight:"bold",
                alignItems:"center",
                justifyContent:"center",
                backgroundColor:"indianred",
                color:"white",
            }}>
        Select Your Game </button>

            <Breadcrumbs aria-label="breadcrumb"  style={{display:"none",justifyContent:"center"}}>
                <Link color="inherit" href="#" onClick={handleClick} style={{fontSize:"0.8rem"}}>
                   {sport_name}
                </Link>
                <Link color="inherit" href="#" onClick={handleClick} style={{fontSize:"0.8rem"}}>
                    {league_name}
                </Link>
                <Link color="inherit" href="#" onClick={handleClick} style={{fontSize:"0.8rem"}}>
                    {mode_name}
                </Link>
                <Link color="inherit" href="#" onClick={handleClick} style={{fontSize:"0.8rem"}}>
                    {type_name}
                </Link>
                
                <Typography color="textPrimary" style={{fontSize:"0.8rem"}}>{play_type_name}</Typography>
                <Link color="inherit" href="#" onClick={handleClick} style={{fontSize:"0.8rem"}}>
                    {money_name}
                </Link>
            </Breadcrumbs>

            
            </div>




            <div className="games_body">
                {/*<DatePicker getSelectedDay={selectedDay}
                    endDate={100}
                    selectDate={calenda}
                    labelFormat={"MMMM"}
                    color={"black"}  
                           
                />
                
                <div style={{marginBottom:"2rem"}} />
                */}
                {/*<TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table" >
                <TableHead>
                <TableRow>
                    <TableCell>Sport</TableCell>
                    <TableCell align="right">Games</TableCell>
                    <TableCell align="right">Winning</TableCell>
                    <TableCell align="right">Players</TableCell>
                    <TableCell align="right">Status</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>*/}
                {games.map((row) => {
                   
                    const row_sport=row.sport;
                    const row_league=row.league;
                    const row_mode=row.mode;

                    let league_name="";
                    //console.log("all leagues are ",l);
                    league_name=l.filter((lg)=>{
                        return lg.id==row_league;
                    })[0]?.name;

                    //console.log("showing ",selected_sport,selected_league,selected_mode,row_mode);

                    let can_show=true;
                    if(selected_sport!=0 && selected_sport!=row_sport){
                        can_show=false;
                    }

                    if(selected_league!=0 && selected_league!=row_league){
                        can_show=false;
                    }

                    if(selected_mode!=0 && selected_mode!=row_mode){
                        can_show=false;
                    }
                   if(can_show==false){
                       return null;
                   }

                   const key=row.key;
                   const res=picks.filter((pick)=>{
                       return pick.id_challenge==key;
                   })

                   
                   const res3=res.filter((pick)=>{
                       return pick.user==auth?.currentUser.email;
                   })
                   
                   if(res3.length>0){
                       return null;
                   }

                   const nb_player=res.length;
                   const fee=row.fee;
                   let winning=0;
                   if(fee==0){
                        winning=100;
                   }else{
                       winning=parseInt(fee)*nb_player;
                   }
				   
				   let str_player="";
				   const type=row.type;
				   if(type=="1"){
					   return null;
				   }
				   
				   if(type=="2" || type=="5"){
					   str_player=nb_player+"/2";
				   }else if(type=="3"){
					   str_player=nb_player+"/10";
				   }else {
					   str_player=nb_player;
				   }
				   //console.log(row.type);
                   let icon_name=null;
                   const res_icon=icons.filter((icon)=>{
                       return icon.id==row_sport;
                   })
                   if(res_icon.length>0){
                       icon_name=res_icon[0].icon;

                   }

                   if(row.type==5 && nb_player==1){
                       return null;
                   }
                   //console.log("icons=",icons,row_league,league_name,res_icon)
                   if(empty==true){
                       setEmpty(false);
                   }

                   let {closed,game_started}=challenged_closed(key,type,nb_player,res,gm);
                  
                   if(closed==true || game_started==true){
                       return null;
                   }

                   return (
                       <div style={{marginBottom:"2.5rem"}} 
                       className="a_game_line" 
                       onClick={go_to_tournament.bind(this,row.key,game_started,closed)}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                                    {icon_name}
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                        <p style={{fontWeight:"bold"}}>{row.name}</p>
                                        <p style={{fontSize:"0.8rem",color:"gray"}}>{league_name}</p>
                                    </div>
                                </div>
                                <div>
                                    <button style={{
                                        padding:"1rem",
                                        width:"100px",
                                        border:"none",
                                        outline:"none",
                                        fontWeight:"bold",
                                        backgroundColor:"rgba(0,0,0,0.1)"

                                    }}
                                    onClick={go_to_tournament.bind(this,row.key,game_started,closed)}
                                    >Play</button>
                                </div>
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.5rem"}}>
                                <div className="game_sub_line">
                                    <p>{row.nb_game}</p>
                                    <p>#Games</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{row.fee=="0"?"Free":row.fee}</p>
                                    <p>Entry</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{winning}</p>
                                    <p>Winning</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{str_player}</p>
                                    <p>Players</p>
                                </div>
                            </div>
                       </div>
                   );

                   
                })}
                

            {
                empty  && loading==false && <div className="no_records" style={{marginTop:"1rem"}}>
                    <p style={{textAlign:"center"}}>No records founds!</p>
                    </div>
            }

            {
                 loading==true && <div className="no_records" style={{marginTop:"1rem"}}>
                    <p style={{textAlign:"center"}}>Loading...</p>
                    </div>
            }
            </div>

            <div className="side_actions" style={{display:"none"}}>
                <button onClick={e=>setDrawer(true)}>
                    <SettingsIcon />
                </button>
                <button>
                    <CreateNewFolderIcon />
                </button>
            </div>

            <Drawer anchor={"left"} open={props.drawer} onClose={props.onClose}>
                <div className="drawer_left">
                   <div>
                        <label>Sports</label>
                       

                        <Select value={selected_sport} onChange={e=>setSelected_sport(e.target.value)}>
                <MenuItem value={0}>All Sports</MenuItem>
                    {
                        sports.map((sport)=>{
                            return(
                                <MenuItem key={sport.key} value={sport.id}>{sport.name}</MenuItem>
                            );
                        })
                    }
                   
                </Select>
                    </div>

                    <div>
                        <label>Leagues</label>
                        <Select value={selected_league} onChange={e=>setSelected_league(e.target.value)}>
                            <MenuItem value={0}>Select Your League</MenuItem>
                            {
                                leagues.map((league)=>{
                                    return(
                                        <MenuItem key={league.key} value={league.id}>{league.name}</MenuItem>
                                    );
                                })
                            }
                        
                        </Select>
                    </div>

                    <div>
                        <label>Game Mode</label>
                        <Select value={selected_mode} onChange={e=>setSelected_mode(e.target.value)}>
                            <MenuItem value={0}>Select Game Mode</MenuItem>
                            <MenuItem value={1}>Most Wins</MenuItem>
                            <MenuItem value={2}>Longest Winning Streak</MenuItem>
                        </Select>
                    </div>

                    <div>
                        <label>Game Type</label>
                        <Select value={selected_type} onChange={e=>setSelected_type(e.target.value)}>
                            <MenuItem value={0}>Select Game Type</MenuItem>
                            <MenuItem value={1}>Heads Up Wins</MenuItem>
                            <MenuItem value={2}>Sports Booth</MenuItem>
                            <MenuItem value={3}>Tournament</MenuItem>
                        </Select>
                    </div>

                    <div className="drawer_switch_box">
                        <p className="active">Free to Play</p>
                    <Switch
                        checked={real_play}
                        onChange={handle_switch}
                        name="checkedA"
                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                    />
                        <p>Real Money Play</p>
                    </div> 

                    {
                        real_play==false &&  <div className="games_btns_entries">
                        <button className={gd.entry==0? "active":""} onClick={set_entry.bind(this,0,0)}>Free</button>
                        <button className={gd.entry==1000? "active":""} onClick={set_entry.bind(this,1,1000)}>1,000 Coins</button>
                        <button className={gd.entry==2000?  "active":""} onClick={set_entry.bind(this,2,2000)}>2,000 Coins</button>
                        <button className={gd.entry==5000? "active":""} onClick={set_entry.bind(this,3,5000)}>5,000 Coins</button>
                    </div>
                    }
                   

                    {
                        real_play==true && <div className="games_btns_entries">
                        <button className={gd.entry==0? "active":""} onClick={set_entry.bind(this,0,0)}>Free</button>
                        <button className={gd.entry==1? "active":""} onClick={set_entry.bind(this,1,1)}>$1</button>
                        <button className={gd.entry==2? "active":""} onClick={set_entry.bind(this,2,2)}>$2</button>
                        <button className={gd.entry==5? "active":""} onClick={set_entry.bind(this,3,5)}>$5</button>
                    </div>
                    }
                    



                </div>
            </Drawer>
         
        </div>
    );
}

export default Games;