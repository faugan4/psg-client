const Pick=({game,pick,dv})=>{
    const data=pick.pickdata?.split(",") || ["","","","","","",""];
    const team_picked=pick.team_picked;
    const type_pick=pick.type_pick;
    const id_game=pick.id_game;
    const home=game.home; 
    const away=game.away;

    let odd_away="";
    let odd_home="";
    let str_type="";
    let str_total="";
    if(type_pick=="1"){
        str_type="ML";
        odd_away=data[0];
        odd_home=data[1];
    }else if(type_pick=="2"){
        str_type="Spread";
        odd_away=data[2];
        odd_home=data[3];
    }else{
        if(team_picked=="1"){
            str_type="Over";
        }else{
            str_type="Under";
        }
        odd_away=data[4];
        odd_home=data[5];
        str_total="T="+data[6];
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

    return(
        <div className="pick">
			
			
            
            <div className={`pick_line`}>
                <p className={away_picked}>{away}</p>
                <p className={home_picked}>{home}</p>
            </div>
            <div className={`pick_line`}>
                <p>{str_type}</p>
                <p>{str_total}</p>
            </div>
            <div className="pick_line">
                <p>{odd_away}</p>
                <p>{odd_home}</p>
            </div>
           
        </div>
    );
}

export default Pick;