import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLeagues, selectSelectedGames, 
    selectTodayTime,
    selectDefaultValues,
    selectNextGamesDates,
    selectSelectedPicks, selectSelectedTournament, selectUsers, setSelectedGames, setSelectedPicks, selectGames, selectChallengeDate, setNextGamesDates } from "../features/counterSlice";
import HeaderBack from "./HeaderBack"
import JoinSkeleton from "./skeleton/JoinSkeleton";
import {auth, db} from "../firebase_file";
import Game from "./Game";
import DeleteIcon from '@material-ui/icons/Delete';

import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import Pick from "./Pick";

import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import  firebase from "firebase";
import { useHistory } from "react-router-dom";
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
const Join=()=>{

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor:"black",
          backgroundColor:"rgba(0,0,0,0.7)",
          width:"80%",
          minHeight:"65vh",
          position:"relative",
        },
      };

    const dispatch=useDispatch();
    const history=useHistory();
    const l=useSelector(selectLeagues);
    const t=useSelector(selectSelectedTournament);
    const p=useSelector(selectSelectedPicks);
    const u=useSelector(selectUsers);
    const today_time=useSelector(selectTodayTime);
    const all_games=useSelector(selectSelectedGames)
    const games_redux=useSelector(selectGames);
    const selected_date=useSelector(selectChallengeDate);

    const [games,setGames]=useState([]);
    const [total_pick,setTotal_pick]=useState(0);
    const [picks,setPicks]=useState([]);
    const [alerte,setAlerte]=useState("");
    const [loading,setLoading]=useState(true);
    const [me,set_me]=useState({});
    const [ch_date,set_ch_date]=useState("");
    const [ch_date_text,set_ch_date_text]=useState(new Date().getTime());
    

    useEffect(()=>{
        let sd=new Date();
        if(selected_date!=""){
            sd=selected_date;
        }
       sd=sd.getTime();
      set_ch_date(sd);

      let ch_date_str=new Date(sd).toUTCString();
      ch_date_str=ch_date_str.split(" ");
      ch_date_str=ch_date_str[1]+" "+ch_date_str[2]+" "+ch_date_str[3];
      set_ch_date_text(ch_date_str);

    },[selected_date]);

    useEffect(()=>{
        if(u.length==0){
            history.push("/");
            return;
        }
    },[u]);




    let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal=()=> {
    setIsOpen(true);
    setAlerte("");
  }

  const  afterOpenModal=()=> {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  const closeModal=()=> {
    setIsOpen(false);
  }

    
    useEffect(()=>{
       
        setPicks(p);
        setTotal_pick(p.length);
       
        
    },[p]);

    useEffect(()=>{
        const res=u.filter((user)=>{
            return user.email==auth?.currentUser?.email;
        })
       
        if(res.length>0){
            set_me(res[0]);
        }
    },[u]);

    
    

    useEffect(()=>{
       const id_league=t.league;
       let league_name="";
       const res=l.filter((el)=>{
           return el.id==id_league;
       });
       if(res.length>0){
           league_name=res[0].name;
       }
       if(league_name!=""){
        dispatch(setNextGamesDates([]));
           const nexts=[];
          const res2= games_redux.filter((item,index)=>{

            //console.log("new date are",ch_date);
            let time=item.time;
            const diff=time-ch_date;


            let time_str=new Date(time).toUTCString();
            time_str=time_str.split(" ");
            time_str=time_str[1]+" "+time_str[2]+" "+time_str[3];

            let ch_date_str=new Date(ch_date).toUTCString();
            ch_date_str=ch_date_str.split(" ");
            ch_date_str=ch_date_str[1]+" "+ch_date_str[2]+" "+ch_date_str[3];
            //set_ch_date_text(ch_date_str);

            
           
            if(diff>0 && time_str!=ch_date_str && item.league==league_name ){
                //console.log("time=",time,ch_date,league_name,diff);
                nexts.push(time_str);
            }
            return item.league==league_name 
            && diff >0
            && time_str==ch_date_str
            ;
            
            return item.league==league_name 
               && parseFloat(item.heur)>0 
               && parseFloat(item.heur)<24
              ;
           })
           //console.log("time=",nexts);
           //alert("we got as result "+res2.length)
           setGames(res2);
           dispatch(setSelectedGames(res2));
           dispatch(setNextGamesDates(nexts));
           setLoading(false);
       }
    },[l,t,games_redux,ch_date]);

   

    const handle_join=(e)=>{
        setAlerte("");
        const btn=e.target;
        const has_active=btn.classList.contains("active");

        if(total_pick==t.number_game && !has_active){
          //  //console.log("done");
            clearTimeout(id_function);
            setIsOpen(true);
            
            return;
        }

        btn.classList.toggle("active");
        const id_game=btn.dataset.key;
        const type_pick=btn.dataset.type;
        const team_picked=btn.dataset.team;
        const pickdata=btn.dataset.pickdata;

        let teams=[];
        const res_current_game=all_games.filter((g)=>{
            return g.key==id_game;
        });

        if(res_current_game.length>0){
            teams=[res_current_game[0].away,res_current_game[0].home];
        }
        ////console.log(pickdata);
        
        const pick={id_game,type_pick,team_picked,pickdata,teams,league:t.league,sport:t.sport,entry:t.entry,user:auth?.currentUser?.email}
        const old_picks=[...picks];
        if(has_active){
            const res=old_picks.filter((el)=>{
                return  !(el.id_game==id_game && 
                        el.type_pick==type_pick && 
                        el.team_picked==team_picked)
            });
            setTotal_pick(total_pick-1);
            setPicks(res);
            dispatch(setSelectedPicks(res));
            if(res.length==t.number_game){
                setIsOpen(true);
                
            }
        }else{
            old_picks.push(pick);
            setTotal_pick(total_pick+1);
            setPicks(old_picks);
            dispatch(setSelectedPicks(old_picks));
            if(old_picks.length==t.number_game){
                setIsOpen(true);
                
            }
        }

        
          
       
    }
    const clear_picks=()=>{
        //alert("clearing picks");
        const btns=document.querySelectorAll(".game > div > p > button.active");
        btns.forEach((btn)=>{
            btn.classList.toggle("active");
        })
        setTotal_pick(0);
        setPicks([]);
        dispatch(setSelectedPicks([]));
        setAlerte("");
    }

    const quick_picks=()=>{
        clear_picks();
        
      //  //console.log(picks);
        make_quick_picks();
    }
    let id_function=0;
    const make_quick_picks=()=>{
        ////console.log("picks are",picks);
        ////console.log(total_pick, " and ",t.number_game);
        if(total_pick==t.number_game){
            clearTimeout(id_function);
            
        }
        const btns=document.querySelectorAll(".game > div > p > button");
        const index=Math.round(Math.random()*btns.length);
        ////console.log(index);
        const btn=btns[index];
        if(btn!=undefined){
            btn.click();
        }

        id_function=setTimeout(()=>{
            make_quick_picks();
        },3000)
        
    }

    const sendPicks=async (e)=>{
        setAlerte("Please wait...");
        const id_challenge=t.key;
        console.table([t]);
        const ch_type=t.type;
       

        const obj={
            user:auth?.currentUser?.email,
            picks,
            id_challenge,
            type_challenge:t.type,
            date:new firebase.firestore.FieldValue.serverTimestamp()
        };
      
        const btn=e.target;
        btn.disabled=true;
        btn.style.opacity="0.3";
       
        
         db.collection("psg_picks").add(obj).then(async ()=>{
            const coins_info={user:auth?.currentUser?.email,id_challenge,picks,entry:"-"+entry,date:firebase.firestore.FieldValue.serverTimestamp()};
            await db.collection("psg_users_coins").add(coins_info);
            
            const res=await 
            db.collection("psg_picks")
            .where("id_challenge","==",id_challenge)
            .get();

            const ch_nb_picks=res.docs.length;
            let can_create=false;
            if(t.parent!=undefined){
                if(ch_type==2){
                    if(ch_nb_picks==2){
                        can_create=true;
                    }
                }else if(ch_type==3){
                    if(ch_nb_picks==10){    
                        can_create=true;
                    }
                }
            }
            if(can_create==true){
                let clone_challenge={...t};
                delete clone_challenge.key;
                delete clone_challenge.fee;
                delete clone_challenge.nb_game;
                clone_challenge.parent=false;
                clone_challenge.date=new Date(ch_date)

                await  db.collection("psg_challenges").add(clone_challenge);
            }
           
            
            setAlerte("");
            dispatch(setSelectedPicks([]));
            history.replace("/main");
            
         }).catch((err)=>{
             setAlerte("Error, please try again");
             btn.disabled=false;
            btn.style.opacity="1";
         })

    }

    const [my_coins,set_my_coins]=useState(0);
    const [entry,setEntry]=useState(0);

    useEffect(()=>{
       setEntry(t.entry);
    },[t]);

    useEffect(()=>{
        const email=auth?.currentUser?.email;
        if(email==undefined){
            return;
        }
       
        const unsub=db.collection("psg_users_coins").where("user","==",email).onSnapshot((snap)=>{
            let total_coins=5000;
            snap.docs.map((doc)=>{
                const coins=parseInt(doc.data().entry);
                total_coins+=coins;
                
            })
            //console.log("ok for ",total_coins);
            set_my_coins(total_coins);
        });

        return unsub;
    },[auth,modalIsOpen]);

    const go_to_wallet=()=>{
        history.push("/wallet");
    }

    const go_to_home=()=>{
        history.push("/main");
    }


    const dv=useSelector(selectDefaultValues);
    const [sdv,set_sdv]=useState(null);
    useEffect(()=>{
        const id_l=t.league;
        const res=dv.filter((item)=>{
            return item.key==id_l;
        })
        if(res.length>0){
            set_sdv(res[0]);
        }
       // //console.log("ther resule is ",res);
    },[dv,t]);

    const [can_delete,set_can_delete]=useState(false);
    useEffect(()=>{
        if(p.length==0){
            set_can_delete(false);
        }else{
            set_can_delete(true);
        }
    },[p]);

    const nexts=useSelector(selectNextGamesDates);
    const [next,set_next]=useState("");
    useEffect(()=>{
        if(nexts.length>0){
            set_next(nexts[nexts.length-1]);
        }
    },[nexts]);

    return(
        <div className="join">
            <HeaderBack title_redux={false} title="Picks">
                <div className="join_actions">
                  <div>
                        <p>{total_pick}/{t.number_game || 0}</p>
                        {1==2 && <button onClick={clear_picks} style={{width:"100px"}}>
                            <DeleteIcon /> Delete
                        </button>}
                    </div>
                    <div>
                        <button className="btn_quick" onClick={quick_picks} style={{width:"100px"}}>
                            <FlipCameraAndroidIcon />
                             Quick Pick
                        </button>
                    </div>
                </div>
            </HeaderBack>
            <div className="join_body single_page_body">
                {
                    loading==true && 
                    [1,2,3,4,5].map((el)=>{
                        return (<JoinSkeleton key={el} />);

                    })
                }

                {
                games.map((g)=>{
                        return(
                            <Game  
                            key={g.key} 
                            game={g} 
                            btnClick={handle_join} 
                            dv={sdv} 
                            time={g.time} 
                            ch_date={ch_date}
                            />
                        );
                    })
                }

                {
                    loading==false && games.length==0 && 
                    <div style={
                        {
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"center",
                            gap:"1rem"
                            
                        }}>
                        <p className="alerte">No games available on {ch_date_text} !!!</p>
                        {/*next!="" &&<p style={{textAlign:"center"}}>But some games are available on {next}</p>*/}

                        <button className="btn_stats_follow"
                        onClick={go_to_home}
                        style={{padding:"1rem",width:"50%"}}>Go Back</button>
                    </div>
                }
                
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                ariaHideApp={false}
            >
               
                
               <div className="picks">
                   {
                       picks.map((el,i)=>{
                           const m_id_game=el.id_game;
                           const m_type_pick=el.type_pick;
                           const m_team_picked=el.team_picked;
                           const game=all_games.filter((el_g)=>{
                               return el_g.key==m_id_game;
                           })[0];
                           return(
                               <Pick game={game} key={i} pick={el}  dv={sdv} />
                           );
                       })
                   }
               </div>

               <div className="picks_info">
                   
                </div>

               <div className="modal_actions">
                    <p style={{color:"white"}}>Your current coins is : <span>{my_coins} Coins</span></p>
                    <p style={{color:"white"}}>These picks will cost you <span>{entry} coins</span></p>
                    

                   {
                       parseInt(my_coins)>= parseInt(entry) && 
                       <button onClick={sendPicks}>
                       Confirm Now
                   </button>
                   }
                    {
                       parseInt(my_coins)< parseInt(entry) && 
                       <div style={{display:"flex",alignItems:"center",flexDirection:"column"}}>
                           <p style={{
                               textAlign:"center",
                               fontSize:"0.8rem",
                               color:"indianred",
                               fontWeight:"bold",
                               paddingBottom:"0.5rem"
                           }}>You don't have suffissant coins for these picks</p>
                            <button 
                            onClick={go_to_wallet}
                            className="btn_stats_follow" style={{padding:"1rem"}}>Reload Your Account</button>
                           </div>

                    }
                    
                    {alerte != "" && <p>{alerte}</p>}
                </div>
                
               
            </Modal>
        </div>
        );
}

export default Join;