import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTournaments,  setSelectedTournament, setSinglePageName, }from '../features/counterSlice';
import { useHistory } from 'react-router-dom';
import Challenge from './Challenge';
import ChallengeSkeleton from './skeleton/ChallengeSkeleton';

import SwipeableViews from 'react-swipeable-views';

const SportsBooth=()=>{
    const dispatch=useDispatch();
    const t=useSelector(selectTournaments);
    const [tournaments,setAll_tournaments]=useState([]);
    const [loading,setLoading]=useState(true);
    const history=useHistory();

    useEffect(()=>{
        const res=t.filter((el)=>{
            return el.type==3;
        })
        setAll_tournaments(res);
        setLoading(false)
    },[t]);

    const view_challenge=async (key)=>{
       const t= tournaments.filter((line)=>{
            return line.key==key;
        })
        if(t.length>0){
            const selected_t=t[0];
            dispatch(setSelectedTournament(selected_t));
            dispatch(setSinglePageName(selected_t.name));
            history.push("/challenge");
        }
    }

    return(
        <div className="tournament">
            {loading== true && <ChallengeSkeleton />} 
            <SwipeableViews enableMouseEvents>
                {
                    tournaments.map((tournament)=>{
                        return <Challenge 
                        key={tournament.key}
                        tournament={tournament} 
                        btnText="View" 
                        btnClick={view_challenge.bind(this,tournament.key)}
                        detail={false}
                        share_challenge={null}
                    />
                    })
                }
            </SwipeableViews>
                {
                    tournaments.length==0 && (<p className="no_data">No data available</p>)
                }
                {
                    tournaments.length>1 && <p className="swipe_more">Swipe to see more</p>
                }
           </div>     
    );
}
export default SportsBooth;