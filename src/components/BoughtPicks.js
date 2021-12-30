import React,{useState,useEffect} from 'react'
import HeaderBack from './HeaderBack'
import { useDispatch, useSelector } from 'react-redux'
import { selectPicksBought } from '../features/counterSlice'
import { auth, db } from '../firebase_file'
const BoughtPicks = () => {
	const pb=useSelector(selectPicksBought);
	
	const [data,setData]=useState([]);
	
	useEffect(()=>{
		const res=pb.filter((item)=>{
			return item.buyer==auth.currentUser?.email;
		});
		setData(res);
	},[pb]);
    return (
        <div className="picks_bought">
            <HeaderBack title_redux={false} title="My Bought Picks"></HeaderBack>
			<div className="picks_bought_body">
			{
				data.map((pick)=>{
					const item=pick.item.pick;
					const data=item.pickdata.split(",");
					const league=item.league;
					const sport=item.sport;
					const type_pick=item.type_pick;
					const team_picked=item.team_picked;
					
					
					let str_type_pick="";
					let odd_away="";
					let odd_home="";
					let str_total="";
					
					if(type_pick=="1"){
						str_type_pick="ML";
						odd_away=data[0];
						odd_home=data[1]
					}else if(type_pick=="2"){
						str_type_pick="SPREAD";
						odd_away=data[2];
						odd_home=data[3]
					}else {
						if(team_picked=="1"){
							str_type_pick="Over";
						}else{
							str_type_pick="Under";
						}
						
						odd_away=data[4];
						odd_home=data[5]
						str_total=data[6];
					}
					
					let home_picked="";
					let away_picked="";
					let total_picked="";
					if(team_picked=="1"){
						if(type_pick=="1" || type_pick=="2"){
							away_picked="picked";
						}else{
							total_picked="Over";
						}
					}else{
						if(type_pick=="1" || type_pick=="2"){
							home_picked="picked";
						}else{
							total_picked="Under";
						}
					}
					
					return  <div>
						<p className="seller_name">From: {pick.seller} </p>
					<div className="pick">
								
								
								<div className={"pick_line"}>
									<p className={away_picked}>{item.teams[0]}</p>
									<p className={home_picked}>{item.teams[1]}</p>
								</div>
								<div className={"pick_line"}>
									<p>{str_type_pick}</p>
									<p>{str_total}</p>
								</div>
								<div className="pick_line">
									<p>{odd_away}</p>
									<p>{odd_home}</p>
								</div>
								
							</div>
							
							
						</div>
				})
			}
			
			{
				data.length==0 && <div className="no_records"><p>No records found !!!</p></div>
			}
			</div>
        </div>
    )
}

export default BoughtPicks
