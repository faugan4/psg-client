import { useEffect, useState } from "react";
import {auth,db} from "../firebase_file";
import {get_pick_key, get_user_status, load_user_picks} from "../functions";
import {get_today_time} from "../functions";
import logo from "./img/logo.png";
import ReactLoading from 'react-loading';
import { useDispatch, useSelector } from "react-redux";
import { selectPicks, setActiveTab, setLeagues, setUsersStats,setPage, setPageName, selectRegistration,
    setPicks, setDefaultValues, setSports, setToday, setTodayTime,setTournaments, setUsers,
    setMyPicksBought,setPicksBought ,setFollow, setGames, selectTodayTime, setTransactions, setMainChallenges} from "../features/counterSlice";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { challenged_closed } from "../functions";


const Splash=()=>{
    const dispatch=useDispatch();
    const history=useHistory();
    const r=useSelector(selectRegistration)
   
    useEffect(()=>{
        window.addEventListener('popstate', function (e) {
            var state = e.state;
            //console.log("oh you want to go back");
            return false;
        });
    },[]);


    useEffect(()=>{
      //  auth.signOut();
       
        
        auth.onAuthStateChanged((user)=>{
            setTimeout(async ()=>{
                if(user==null){
                    //go to login
                    dispatch(setPage(1));
                    
                    await load_sports();
                    await load_leagues();
                    await load_users();
                    await load_picks();
                    await load_tournaments();
                    await load_bought_picks();
					await load_follow();
                    await load_today_time();
                    await load_games();
                    await load_default_values();
                    await load_users_coins()
                    await load_main_challenges();
                    history.replace("/login")
    
                }else{
                    await load_sports();
                    await load_leagues();
                    await load_users();
                    await load_picks();
                    await load_tournaments();
					await load_follow();
					await load_bought_picks();
                    await load_today_time();
                    await load_games();
                    await load_default_values();
                    await load_users_coins();
                    await load_main_challenges();
                    dispatch(setPageName("Lobby"));
                    dispatch(setActiveTab(4));
                    history.replace("/main");
                }  
            },500);

             
        })
    },[auth]);

   
    const load_sports=async ()=>{
        const res=await db.collection("psg_sports").get();
        const sports=[];
        res.forEach((line)=>{
            const key=line.id;
            const data=line.data();
            data.key=key;
            sports.push(data);
        })
        dispatch(setSports(sports));
    }

    const load_leagues=async ()=>{
        const res=await db.collection("psg_leagues").get();
        const sports=[];
         res.forEach((line)=>{
            const key=line.id;
            const data=line.data();
            data.key=key;
            sports.push(data);
        })
        dispatch(setLeagues(sports));
    }

    const load_users=async ()=>{
        db.collection("psg_users").orderBy("date","desc").onSnapshot( (snap)=>{
            const users=[];
            snap.docs.map(async (user)=>{
                const id=user.id;
                const data=user.data();
                data.key=id;
                const date=data.date?.seconds;
                data.date=date;
                users.push(data);
            })

            dispatch(setUsers(users));
        })


    }

   const load_picks=async ()=>{
    db.collection("psg_picks")
    .orderBy("date","desc")
    .onSnapshot(async (snap)=>{
        const p=[];
        snap.docs.map((doc)=>{
            const key=doc.id;
            const data=doc.data();
            const date=data.date?.seconds;
            data.date=date;
            data.key=key;
            p.push(data);
        });

        dispatch(setPicks(p));

        //get picks with results

        const all_user=[];
        const picks_res=p.filter((item)=>{
            
            let result_exist= item.results!=undefined;
            if(result_exist ==true){
                const item_user=item.user;
                if(all_user.indexOf(item_user)<0){
                    all_user.push(item_user);
                }
                
            }
            return result_exist;
        })
        
        ////console.log("picks with",picks_res)
        const users_results_stats=[];
        const users_stats=[];
        all_user.map((item)=>{
            const user_picks=picks_res.filter((item2)=>{
                return item2.user==item;
            })
            
            const user_games_picks=[]; //remove duplicates in case we have it
            let user_wins=0;
            let user_loses=0;
            let user_tie=0;
            let user_wins_ou=0;
            let user_loses_ou=0;
            let user_tie_ou=0;
            let results_streak=[];

            let user_wins_h2h=0;
            let user_loses_h2h=0;
            let user_tie_h2h=0;
            let user_wins_sb=0;
            let user_loses_sb=0;
            let user_tie_sb=0;

            user_picks.map(async(item3)=>{
                const id_challenge=item3.id_challenge;
                const results=item3.results;
                const picks=item3.picks;
                let challenge_type=item3.type_challenge;
                ////console.log("the challenge type is ",challenge_type);
                

                picks.map((item4,index)=>{
                    const pick_league=item4.league;
                    const pick_id_game=item4.id_game;
                    const pick_type_pick=item4.type_pick;
                    const pick_team_picked=item4.team_picked;

                    const pick_uniq_key=get_pick_key(item4);
                    if(user_games_picks.indexOf(pick_uniq_key)<0){
                        user_games_picks.push(pick_uniq_key);
                        const res_pick=results[index];
                        ////console.log("picks with",res_pick);
                        if(pick_type_pick==1 || pick_type_pick==2){
                            
                            //ML or Spread pick
                            if(res_pick==0){
                                user_loses++;
                                if(challenge_type=="2"){
                                    user_loses_h2h++;
                                }else if(challenge_type=="3"){
                                    user_loses_sb++;
                                }
                            }else if(res_pick==1){
                                user_wins++;
                                if(challenge_type=="2"){
                                    user_wins_h2h++;
                                }else if(challenge_type=="3"){
                                    user_wins_sb++;
                                    //console.log("the challenge type is ",challenge_type,item);

                                }
                            }else if(res_pick==2){
                                user_tie++;
                                if(challenge_type=="2"){
                                    user_tie_h2h++;
                                }else if(challenge_type=="3"){
                                    user_tie_sb++;
                                    //console.log("the challenge type is ",challenge_type,item);
                                }
                            }
                            results_streak.push(res_pick);
                        }else{
                            //over under pick
                            if(res_pick==0){
                                user_loses_ou++;
                            }else if(res_pick==1){
                                user_wins_ou++;
                            }else if(res_pick==2){
                                user_tie_ou++;
                            }
                        }
                    }
                    
                });

                
            })
            
            let total_wins=user_wins+user_loses;
            let wp=".000";
            if(total_wins>0){
                wp=user_wins/total_wins;
            }

            let total_wins_h2h=user_wins_h2h+user_loses_h2h;
            let wp_h2h=".000";
            if(total_wins_h2h>0){
                wp_h2h=user_wins_h2h/total_wins_h2h;
            }

            let total_wins_sb=user_wins_sb+user_loses_sb;
            let wp_sb=".000";
            if(total_wins_sb>0){
                wp_sb=user_wins_sb/total_wins_sb;
            }

            wp=parseFloat(wp).toFixed(3);
            wp_h2h=parseFloat(wp_h2h).toFixed(3);
            wp_sb=parseFloat(wp_sb).toFixed(3);

            let nb_pick=user_games_picks.length;

            let {status,stars}=get_user_status(nb_pick,wp);
          

            const user_stats={
                results_streak,
                user:item,
                user_wins,
                user_loses,
                user_tie,
                user_wins_ou,
                user_loses_ou,
                user_tie_ou,
                user_wins_h2h,
                user_loses_h2h,
                user_tie_h2h,
                user_wins_sb,
                user_loses_sb,
                user_tie_sb,
                wp,
                wp_h2h,
                wp_sb,
                user_total_picks:nb_pick,
                status,
                stars
            };
            users_stats.push(user_stats);
            
        })
        //console.log("picks with",users_stats);
        dispatch(setUsersStats(users_stats))



       const snap_challenge=await db.collection("psg_challenges").where("parent","==",true).get();
       snap_challenge.docs.map(async (item)=>{
           const key=item.id;
           const line=item.data();
           const type=line.type;
           const entry=line.entry;
           const mode=line.mode;
           const id_sport=line.sport;
           const id_league=line.league;
           const number_game=line.number_game;
           const challenge_picks=p.filter((item2)=>{
               return item2.id_challenge==key;
           });
           const nb_player=challenge_picks.length;
           //key,type,nb_player,res,gm 
           //console.log("res=key=",key);
           //console.log("res=type=",type);
           //console.log("res=nb_player=",nb_player);
           //console.log("res=",challenge_picks);

           const snap_league=await db.collection("psg_leagues").where("id","==",id_league).get();
           const league=snap_league.docs[0].data().name;
           //console.log("res= league=",league);

           await db.collection("psg_today").doc("date").update({date:firebase.firestore.FieldValue.serverTimestamp()});
           const doc=await db.collection("psg_today").doc("date").get();
           const today=doc.data()?.date?.seconds*1000;
           //console.log("res today=",today,new Date(today).toUTCString());

           const snap_games=await db.collection("psg_games")
           .where("league","==",league)
           .where("time",">",today)
           .get();
           const gm=[];
           snap_games.docs.map((doc)=>{
               const game_data=doc.data();
               const game_id=doc.id;
               game_data.key=game_id;
               gm.push(game_data);
               ////console.log("res to time=",time,new Date(time).toUTCString());
           })

           let {closed,game_started}= challenged_closed(key,type,nb_player,challenge_picks,gm )

           if(closed ==true || game_started==true){
               const snap_search=await db.collection("psg_challenges")
               .where("entry","==",entry)
               .where("league","==",id_league)
               .where("mode","==",mode)
               .where("number_game","==",number_game)
               .where("sport","==",id_sport)
               .where("type","==",type)
               .where("parent","==",false)
               .get();

               const new_line={
                date:firebase.firestore.FieldValue.serverTimestamp(),
                entry,
                league:id_league,
                mode,
                name:line.name,
                number_game,
                parent:false,
                parent_id:key,
                sport:id_sport,
                type,
                url:line.url,
                z_data:line.z_data

            }
			
			console.log("the new challenge is ",new_line);

               if(snap_search.docs.length==0){
                   // no new challenges
                  
                   //console.log("the search ...",entry,league,mode,number_game,type);
                   await db.collection("psg_challenges").add(new_line);
               }else{
                   let can_create=true;
                   
                   snap_search.docs.map((item)=>{
                        const challenge_picks2=p.filter((item2)=>{
                            return item2.id_challenge==item.id;
                        })
                        const nb_player2=challenge_picks2.length;
                        let {closed,game_started}= challenged_closed(item.id,type,nb_player2,challenge_picks2,gm );
                        if(closed==false && game_started==false){
                            can_create=false;
                        }
                   })

                   if(can_create==true){
                    await db.collection("psg_challenges").add(new_line);
                   }else{
                       //console.log("the search, we can not create")
                   }
               }

           }

       })
    })
   }

   const load_tournaments=async ()=>{
       db.collection("psg_challenges")
       .orderBy("date","asc")
       .onSnapshot((snap)=>{
           const t=[];
           ////console.log("total challenges is ",snap.docs.length)
           snap.docs.map((doc)=>{
               const key=doc.id;
               const data=doc.data();
               const fee=data.entry;
               data.fee=fee;
               data.nb_game=data.number_game;
               
               data.key=key;
                t.push(data);
           })
           dispatch(setTournaments(t));
       })
   }

   const load_bought_picks=async ()=>{
       db.collection("psg_buy_picks").onSnapshot((snap)=>{
           const g=[];
            snap.docs.map((doc)=>{
                const id=doc.id;
                const data=doc.data();
				const date=data.date?.seconds;
				data.date=date;
                data.key=id;
                g.push(data);
                //console.log("i bought ",id);
            })
			dispatch(setPicksBought(g));

       })
   }
   
   const load_follow=async ()=>{
	   db.collection("psg_follow").onSnapshot((snap)=>{
		const g=[];
		snap.docs.map((doc)=>{
			const id=doc.id;
			const data=doc.data();
			const date=data.date?.seconds;
			data.date=date;
			data.key=id;
			g.push(data);
		})
		//console.log(g);
		dispatch(setFollow(g));
	   });
   }

   const t=useSelector(selectTodayTime);
   const load_games=async ()=>{
       
    let today_time=await get_today_time();
    db
    .collection("psg_games")
    .orderBy("time","desc")
    .onSnapshot(async (snap)=>{
        const g=[];
        
        dispatch(setTodayTime(today_time));
        //console.log("we load ",today_time)
        snap.docs.map((doc)=>{
            const id=doc.id; 
            const data=doc.data();
            data.key=id;
            const date=data.date?.seconds;
            const time=data.time;
            data.rdx_time=today_time;
            const diff=time-today_time;
           
            data.diff=diff;
            const heur=diff*0.00000027777777777778
            //console.log("reading from data ",data);
            data.heur=heur.toFixed(2);

            let start_date=new Date(time).toUTCString();
            let today_date=new Date(today_time).toUTCString();
            
            start_date=start_date.split(",");
            start_date=start_date[1];

            today_date=today_date.split(",");
            today_date=today_date[1];

            start_date=start_date.trim();
            if(today_date!=undefined){
                today_date=today_date?.trim();

                start_date=start_date.split(" ");
                today_date=today_date?.split(" ");

                start_date=start_date[0]+" "+start_date[1]+" "+start_date[2];
                today_date=today_date[0]+" "+today_date[1]+" "+today_date[2];
                

                if(start_date==today_date){
                   // data.today=true;
                   //console.log("comp of diff=",diff);
                   //console.log("comp of data=",data);
                    if(diff>=0){
                        //console.log("comp of >0",start_date,today_date,diff,heur);
                        data.date=date;
                        data.key=id;
                        data.started=false;
                        data.today=true;
                    }else{
                        data.started=true;
                        //console.log("comp of<0",start_date,today_date,diff,heur);
                        
                    }
                    
                }else{
                    data.today=false;
                    data.started=false;
                }
                g.push(data);
            }
            
         
        })
        dispatch(setGames(g));
        //console.log("comp of dispatch",g);
    })


   }



    
const load_today_time=async ()=>{
    const res=await get_today_time();
    dispatch(setTodayTime(res));
}

const load_default_values=async ()=>{
    db.collection("psg_default_values").onSnapshot((snap)=>{
        const d=[];
        snap.docs.map((doc)=>{
            const key=doc.id;
            const data=doc.data();
            data.key=key;
            d.push(data);
        })
        dispatch(setDefaultValues(d));
    })
}

const load_users_coins=async ()=>{
    db.collection("psg_users_coins").onSnapshot((snap)=>{
        const d=[];
        snap.docs.map((doc)=>{
            const key=doc.id;
            const data=doc.data();
            data.key=key;
            d.push(data);
        })

        dispatch(setTransactions(d))
    })
}

const load_main_challenges=async ()=>{
    db.collection("psg_challenges")
    .where("parent","==",true)
    .onSnapshot((snap)=>{
        const main=[];
        snap.docs.map(async (doc,index)=>{
            const key=doc.id;
            const line=doc.data();
            line.key=key;
            const fee=line.entry;
            line.fee=fee;
            line.nb_game=line.number_game;

            const children=[];
            
            const res=await 
            db.collection("psg_challenges")
            .where("parent_id","==",key)
            .get();
            
            res.docs.map((item)=>{
                const id=item.id;
                const data=item.data();
                data.key=id;
                const fee=data.entry;
                data.fee=fee;
                data.nb_game=data.number_game;
                children.push(data);
            })
            line.children=children;


            main.push(line);
            if(index==snap.docs.length-1){
                //console.log("main chall",index,"/",snap.docs.length,"Ends");
                //console.log("main chall",main);
                dispatch(setMainChallenges(main));
            }else{
                //console.log("main chall",index,"/",snap.docs.length);
            }
            
        })

    })
    
}


    
    
    return(
        <div className="splash">
            <div>
                <img alt="logo" src={logo} />
                <ReactLoading type="bubbles" color="indianred" height={"100%"} width={"80%"} />
            </div>
        </div>
    )
}

export default Splash;