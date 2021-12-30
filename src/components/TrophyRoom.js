import React from 'react'
import Start from "./Start";

const TrophyRoom = ({userInfo}) => {
    return (
        <div className="trophyRoom">
           
            <Start userInfo={userInfo} />
        </div>
    )
}

export default TrophyRoom
