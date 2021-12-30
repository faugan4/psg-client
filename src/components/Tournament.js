import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectTournaments,  setSelectedTournament, setSinglePageName, }from '../features/counterSlice';
import { useHistory } from 'react-router-dom';
import Challenge from './Challenge';
import ChallengeSkeleton from './skeleton/ChallengeSkeleton';
import Pagination from '@material-ui/lab/Pagination';

import SwipeableViews from 'react-swipeable-views';
import { challenged_closed } from '../functions';


const Tournament=({type,games,picks})=>{
    const dispatch=useDispatch();
    const t=useSelector(selectTournaments);
    const [tournaments,setAll_tournaments]=useState([]);
    const [loading,setLoading]=useState(true);
    const history=useHistory();
    const ref=useRef();

    const [index,setIndex]=useState(0);
    const [page,setPage]=useState(1);

    useEffect(()=>{
        const res=t.filter((el)=>{
            return el.type==type;
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

    

    const handle_pagination_change=(e,v)=>{
        //console.log(v);
        setIndex(v-1);
        setPage(v);
       
    }

    const handle_pagination_change2=(e)=>{
        setPage(ref.current.indexCurrent+1);
    }

    return(
        <div className="tournament">
            {loading== true && <ChallengeSkeleton  />} 
            <SwipeableViews enableMouseEvents
             index={index} onChangeIndex={handle_pagination_change2} ref={ref}
             
             >
                {
                    tournaments.reverse().map((tournament)=>{
                        const ch_key=tournament.key;
                        const res=picks.filter((pick)=>{
                            return pick.id_challenge==ch_key;
                        });
                        let {closed,game_started}= challenged_closed(ch_key,type,res.length,res,games )
                        return <Challenge 
                        key={tournament.key}
                        tournament={tournament} 
                        btnText="View" 
                        btnClick={view_challenge.bind(this,tournament.key)}
                        detail={false}
                        share_challenge={null}
                        closed={closed}
                        started={game_started}
                        
                    />
                    })
                }
            </SwipeableViews>
            
                {
                    tournaments.length>1 &&  <div className="pagination"><Pagination 
                    count={tournaments.length} 
                    page={page}
                    variant="outlined" 
                    onChange={handle_pagination_change} 
                />  </div>
                }
           
          
                {
                    tournaments.length==0 && (<p className="no_data">No data available</p>)
                }
           </div>     
    );
}
export default Tournament;