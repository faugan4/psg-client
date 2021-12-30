const Game=({game,btnClick,dv,time,ch_date})=>{
    const pick_data=[
        game.away_moneyline,
        game.home_moneyline,

        game.away_spread,
        game.home_spread,
        
        game.over,
        game.under,
        game.total
    ]
    return(
        <div className="game">
            <div>
                <p>{game.start}</p>
                <p>{game.away}</p>
                <p>{game.home}</p>
                <p style={{fontSize:"0.7rem",color:"green",fontWeight:"bold"}}>Start in {game.heur} hours</p>
                {/*<p>{time}</p>
                <p>{ch_date}</p>
                <p>{time-ch_date}</p>*/}
            </div>

            {(dv.default_show=="0" || dv.default_show=="1" )&& <div>
                <p>ML</p>
                <p>
                    <button 
                        onClick={btnClick} 
                        data-key={game.key} 
                        data-type={1}
                        data-team={1}
                        data-pickdata={pick_data}
                    >
                        {game.away_moneyline}
                    </button>
                </p>
                <p><button 
                    onClick={btnClick} 
                    data-key={game.key} 
                    data-type={1}
                    data-team={2}
                    data-pickdata={pick_data}
                >{game.home_moneyline}</button></p>
            </div>
            }

        {(dv.default_show=="0" || dv.default_show=="2" )&& <div>
                <p>Spread</p>
                <p><button 
                    onClick={btnClick} 
                    data-key={game.key} 
                    data-type={2}
                    data-team={1}
                    data-pickdata={pick_data}
                >{game.away_spread}</button></p>
                <p><button
                    onClick={btnClick} 
                    data-key={game.key} 
                    data-type={2}
                    data-team={2}
                    data-pickdata={pick_data}
                >{game.home_spread}</button></p>
            </div>
            }

            <div>
                <p>O/U</p>
                <p><button 
                    onClick={btnClick} 
                    data-key={game.key} 
                    data-type={3}
                    data-team={1}
                    data-pickdata={pick_data}
                >o {game.total}</button></p>
                <p><button 
                    onClick={btnClick} 
                    data-key={game.key} 
                    data-type={3}
                    data-team={2}
                    data-pickdata={pick_data}
                >u {game.total}</button></p>
            </div>
        </div>
    );
}

export default Game;