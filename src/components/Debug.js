import React,{useEffect, useState} from 'react'
import {db} from "../firebase_file";
export default function Debug(props) {
    const [data,set_data]=useState([]);
    useEffect(()=>{
       db.collection("psg_challenges")
       .where("parent","==",true)
       .orderBy("league","asc")
       .onSnapshot((snap)=>{
           const d=[];
           snap.docs.map(async (doc)=>{
               const key=doc.id;
               const line=doc.data();
               line.key=key;
               d.push(line);

               const sport=line.sport;
               const league=line.league;
               const type=line.type;
               const mode=line.mode;
               const entry=line.entry;
               const number_game=line.number_game;

               const res=await 
               db.collection("psg_challenges")
               .where("sport","==",sport)
               .where("league","==",league)
               .where("type","==",type)
               .where("mode","==",mode)
               .where("entry","==",entry)
               .where("number_game","==",number_game)
               .where("parent","==",false)
               .get();

               ////console.log("for ",key,"total is ",res.docs.length);

                res.docs.map(async (item2)=>{
                    const id=item2.id;
                    await 
                    db.collection("psg_challenges")
                    .doc(id)
                    .update({parent_id:key},{merge:true})
                    .then(()=>{
                        //console.log("update done for ",id);
                    }).catch((err)=>{
                        //console.log("error on ",id,err.message);
                    })
                })
           })
           set_data(d);
           
       })
    },[])

    return (
        <div>
            <table  border={1} style={{width:600}}>
            <tr >
                <th>name</th>
                <th>sport</th>
                <th>league</th>
                <th>#Game</th>
                <th>type</th>
                <th>mode</th>
                <th>entry</th>
                <th>Total sub</th>
            </tr>
            <tbody>
            {
                data.map((item,i)=>{
                    return (
                            <tr key={i}>
                                <td align="center">{item.name}</td>
                                <td align="center">{item.sport}</td>
                                <td align="center">{item.league}</td>
                                <td align="center">{item.number_game}</td>
                                <td align="center">{item.type}</td>
                                <td align="center">{item.mode}</td>
                                <td align="center">{item.entry}</td>
                                <td align="center">{item.total}</td>
                            </tr>
                    );
                })
            }
            </tbody>
             </table>
        </div>
    )
}
