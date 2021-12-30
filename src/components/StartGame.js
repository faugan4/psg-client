import Friends from "./Friends"
import HeaderBack from "./HeaderBack"
import { useParams } from "react-router";

const StartGame = (props) => {
    
    return (
        <div>
            <HeaderBack 
                title_redux={false} 
                title={"Challenge a friend"}
                friends={true}
                >
                   
                </HeaderBack>
                <div style={{padding:"1rem"}}>
                    <Friends mouse={true}/>
                </div>
        </div>
    )
}

export default StartGame
