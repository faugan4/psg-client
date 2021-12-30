import React,{useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {selectInvitedFriend,selectUsers,selectFollow,setInvitedFriends} from '../features/counterSlice';
import {auth } from '../firebase_file';
const ListFriends=()=>{
	
	const fi=useSelector(selectInvitedFriend);
	const users=useSelector(selectUsers);
    const follow=useSelector(selectFollow);
	const [my_club,set_my_club]=useState([]);
	const [public_users,set_public_users]=useState([]);
	
	const dispatch=useDispatch();
	
	useEffect(()=>{
		const res=follow.filter((item,i)=>{
			const u=item.user;
			const f=item.follow;
			return u==auth?.currentUser.email;
		})
		
		const res2=res.map((item,i)=>{
			return item.follow;
		})
		
		const res3=users.filter((item,i)=>{
			return res2.indexOf(item.email)>=0 && fi.indexOf(item.email)<0;
		})
		
		set_my_club(res3);
		
		//console.table(res3)
	},[follow,users])
	
	useEffect(()=>{
		if(public_users.length>0){
			const res=users.filter((user)=>{
				return fi.indexOf(user.email)<0 && user.email!=auth?.currentUser.email;
			})
			set_public_users(res);
		}
		
	},[fi,users])
	
	
	const show_public_directory=(e)=>{
		e.stopPropagation();
		const res=users.filter((user)=>{
			return fi.indexOf(user.email)<0 && user.email!=auth?.currentUser.email;
		})
		set_public_users(res);
	}
	
	const invite_user=(e,user,index)=>{
		e.stopPropagation();
		const invited=[...fi];
		invited.push(user.email);
		dispatch(setInvitedFriends(invited));
		
		if(index==1){
			const res=my_club.filter((u)=>{
				return invited.indexOf(u.email)<0
			})
			set_my_club(res);
		}
		
	}
	
	return(
		<div style={{
			padding:"1rem",
			minHeight:"30vh",
			maxHeight:"40vh",
			overflowY:"auto",
		}}>
		{my_club.length>0 && <h1 style={{fontSize:"1rem",textAlign:"center"}}>Invite players from my club</h1>}
			<div style={{
				display:"flex",
				flexWrap:"wrap",
				gap:"1rem",
				marginTop:"1rem",

			}}
			
			>
			{
				my_club.map((user,i)=>{
					let username=user.username;
					
					return (
						<div key={i} style={{
							display:"flex",
							flexDirection:"column",
							alignItems:"center",
							justifyContent:"center",
						}}
						onClick={e=>invite_user(e,user,1)}
						>
							<img src={user.photo} style={{width:"2.5rem",height:"2.5rem",borderRadius:"50%"}}/>
							<p style={{
								fontSize:"0.8rem",
								width:"60px",
								whiteSpace:"nowrap",
								overflow:"hidden",
								textOverflow: "ellipsis",
								textAlign:"center"
							}}>{username}</p>
						</div>
					)
				})
			}
			</div>
			
			{
				my_club.length==0 && public_users.length==0 && <div style={{
					display:"flex",
					flexDirection:"column",
					alignItems:"center",
					gap:"1rem",
					justifyContent:"center",
					textAlign:"center",
				}}>
					<p>No user found in your club.</p>
					<p>Clic on the button bellow to invite player from the public directory</p>
					<button style={{
						padding:"1rem",
						border:"none",
						outline:"none",
						backgroundColor:"indianred",
						fontSize:"1rem",
						fontWeight:"bold",
						color:"white",
						width:"100%",
					}}
					onClick={show_public_directory}
					>Go to public directory</button>
				</div>
			}
			
			{
				my_club.length==0 && public_users.length>0 &&
				<div
				style={{
				display:"flex",
				flexWrap:"wrap",
				gap:"1rem",
				marginTop:"1rem",
				position:"relative",
				paddingTop:"2rem",
				marginTop:"-2rem",
			}}
			
			
				>
				<h1 style={{
					fontSize:"1rem",
					textAlign:"center",
					position:"absolute",
					top:"0",
					
					
					}}>Invite players from public directory</h1>
				{
				public_users.map((user,i)=>{
					let username=user.username;
					
					return (
						<div key={i} style={{
							display:"flex",
							flexDirection:"column",
							alignItems:"center",
							justifyContent:"center",
						}}
						onClick={e=>invite_user(e,user,2)}
						>
							<img src={user.photo} style={{width:"2.5rem",height:"2.5rem",borderRadius:"50%"}}/>
							<p style={{
								fontSize:"0.8rem",
								width:"60px",
								whiteSpace:"nowrap",
								overflow:"hidden",
								textOverflow: "ellipsis",
								textAlign:"center"
							}}>{username}</p>
						</div>
					)
				})
				}
				</div>
			}
		
		</div>
	)
}

export default ListFriends;