import React from 'react'

export default function Gameline(props) {
     const {type,go_to_tournament,name,league_name,icon_name,nb_game,fee,winning,str_player,show_play_btn}=props;

    return (
        <div style={{marginBottom:"2.5rem"}} 
                       className="a_game_line" 
                       onClick={go_to_tournament}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                                    {icon_name}
                                    <div style={{display:"flex",flexDirection:"column"}}>
                                        <p style={{fontWeight:"bold"}}>{name}</p>
                                        <p style={{fontSize:"0.8rem",color:"gray"}}>{league_name}</p>
                                    </div>
                                </div>
                               {show_play_btn==true && <div>
                                    <button style={{
                                        padding:"1rem",
                                        width:"100px",
                                        border:"none",
                                        outline:"none",
                                        fontWeight:"bold",
                                        backgroundColor:"rgba(0,0,0,0.1)"

                                    }}
                                    onClick={go_to_tournament}
                                    
                                    >Play</button>
                                </div>}
                            </div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"0.5rem"}}>
                                <div className="game_sub_line">
                                    <p>{nb_game}</p>
                                    <p>#Games</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{fee=="0"?"Free":fee}</p>
                                    <p>Entry</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{winning}</p>
                                    <p>Winning</p>
                                </div>
                                <div className="game_sub_line">
                                    <p>{str_player}</p>
                                    <p>Players</p>
                                </div>
                            </div>
                       </div>
    )
}
