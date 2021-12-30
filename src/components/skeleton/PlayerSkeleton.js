import Skeleton from '@material-ui/lab/Skeleton';
const PlayerSkeleton=()=>{
    return(
        <div className="player">
            <div className="player_header">
                <Skeleton variant="circle" width={40} height={40} /> 
                <div>
                    <Skeleton animation="wave"  height={10} width={80} />
                    <Skeleton animation="wave"  height={10} />
                </div>       
            </div>
            <div className="player_body">
                <div>
                    <Skeleton animation="wave"  height={10} width={10} />
                    <Skeleton animation="wave"  height={10}  width={10}/>
                </div>

                <div>
                    <Skeleton animation="wave"  height={10} width={10} />
                    <Skeleton animation="wave"  height={10}  width={10}/>
                </div>

                <div>
                    <Skeleton animation="wave"  height={10} width={10} />
                    <Skeleton animation="wave"  height={10}  width={10}/>
                </div>

                <div>
                    <Skeleton animation="wave"  height={10} width={10} />
                    <Skeleton animation="wave"  height={10}  width={10}/>
                </div>


            </div>
        </div>
    );
}

export default PlayerSkeleton;