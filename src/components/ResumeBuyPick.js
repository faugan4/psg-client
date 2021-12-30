import { Avatar } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCart, selectLeagues, selectPicksBought, selectUsers, setCart, setPicksBought } from '../features/counterSlice'
import HeaderBack from './HeaderBack'
import {icons} from "../functions";
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom'
import { auth, db } from '../firebase_file'
import firebase from "firebase";

const ResumeBuyPick = () => {
    const pb=useSelector(selectPicksBought);
    const c=useSelector(selectCart);
    const u=useSelector(selectUsers);
    const [cart,setAll_cart]=useState([c]);
    const [data,setData]=useState([]);
    const l=useSelector(selectLeagues);

    const dispatch=useDispatch();
    const history=useHistory();



    useEffect(()=>{
        setAll_cart(c);
        const d=[];
        c.map((e)=>{
            const p=e.pick;
            const email=p.user;
            const away=p.teams[0];
            const home=p.teams[1];
            const type_pick=p.type_pick;
            const sport=p.sport;
            const league=p.league;
            let photo="foo.jpg";
            const res= u.filter((user)=>{
                return user.email==email;
            });
            photo=res[0]?.photo;
            const username=res[0]?.username;
            //console.log(username);
            let image=<Avatar style={{width:"3rem",height:"3rem",borderRadius:"50%"}}>{username[0]?.toLowerCase()}</Avatar>
            if(photo!="foo.jpg"){
                image=<img src={photo} style={{width:"3rem",height:"3rem",borderRadius:"50%"}}/>
            }
            let str_type_pick="";
            if(type_pick=="1"){
                str_type_pick="ML";
            }else if(type_pick=="2"){
                str_type_pick="SPREAD";
            }else{
                str_type_pick="Total";
            }

            const res2=icons.filter((icon)=>{
                return icon.id==sport;
            })
            /////console.log(res2);

            const res3=l.filter((item)=>{
                return item.id==league;
            })
            //console.log(res3);

            const line={away,home,username,image,str_type_pick,icon:res2[0]?.icon,league:res3[0]?.name};
            d.push(line);
           // //console.log(icons)


        })
        setData(d);
    },[c]);

    const delete_cart=()=>{
        dispatch(setCart([]));
        history.goBack();
    }

    const buy_picks=async (e)=>{
        const btn=e.target;
        btn.innerHTML="Buying...";
        btn.disabled=true;
        const buyer=auth.currentUser.email;
        /*await db.collection("psg_buy_picks").add({
            email,
            cart
        })*/



        const all=[];
        cart.map(async (item,i)=>{
            const seller=item.pick.user;
            const coin=item.pick.entry;
            const an_item={i,seller,buyer,coin:1000, item,date:new firebase.firestore.FieldValue.serverTimestamp()};
            all.push(an_item);
           
        })

        send(all,btn);
    }

    
    const send=async(items,btn)=>{
       const item=items[0];
       const i=item.i;
        //send item
        //console.log("sending ",i);
        const res=await db.collection("psg_buy_picks").add(item);
        //remove item from items
        const remain=items.filter((el)=>{
            return el.i!=i;
        })

       if(remain.length>0){
           send(remain,btn);
       }else{
           ////console.log("ending",cart);
           btn.innerHTML="Buy";
           btn.disabled=false;

           const old_cart=[...pb];
           cart.map((el)=>{
               old_cart.push(el);
           })
          // dispatch(setPicksBought(old_cart));
           dispatch(setCart([]));
           history.goBack();
       }
    }

    
    return (
        <div className="resume_buy_pick">
             <HeaderBack 
                title_redux={false} 
                title={"Buy picks"}
                >
                     <div style={{
                        display:"flex",
                        alignItems:"center",
                        gap:"1rem"
                      }}
                      className="buy_picks_actions"
                      >
                         
                        <button onClick={delete_cart}>
                          <DeleteIcon />
                        </button>
                        <button  
                            onClick={buy_picks}
                        style={{marginRight:"0.5rem",padding:"1rem"}}>
                          Buy
                        </button>

                        
                      </div>
                </HeaderBack>
            <div className="resume_buy_pick_body">
               {
                   data.map((pick,i)=>{
                       return (
                           <div key={i} className="resume_pick">
                               
                                <div>
                                    {pick.image}
                                    <p>{pick.username}</p>
                                </div>
                                <div>
                                    <p>{pick.icon}</p>
                                    <p>{pick.league}</p>
                                </div>
                                <div>
                                    <p>{pick.away}</p>
                                    <p>{pick.home}</p>
                                </div>
                            </div>
                       );
                   })
               }
            </div>
        </div>
    )
}

export default ResumeBuyPick
