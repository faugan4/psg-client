import React,{useState,useEffect} from 'react'
import HeaderBack from './HeaderBack'
import { useDispatch, useSelector } from 'react-redux'
import { selectPicksBought } from '../features/counterSlice'
import { auth, db } from '../firebase_file'
const Subscription=()=>{
	return (
		<div>
			<HeaderBack title_redux={false} title="Premium"></HeaderBack>
			
		</div>
	)
}

export default Subscription;
