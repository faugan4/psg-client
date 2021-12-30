const ChallengeSkeleton=()=>{
    return(<div className="lobby__tournament skeleton-block">
    <div className="tournament_row_one">
        <div className="lobby__tournament__sport">
             <div className="sport-img skeleton"></div>
             <p className="skeleton skeleton-text"></p>
        </div>
        <p className="skeleton skeleton-text"></p>
    </div>
    <div className="tournament_row_two">
        <div>
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
        </div>

        <div>
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
        </div>

        <div>
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
        </div>

        <div>
            <p className="skeleton skeleton-text"></p>
            <p className="skeleton skeleton-text"></p>
        </div>
    </div>
    <div className="tournament_row_three">
         <button className="skeleton skeleton-text"></button>
    </div>
</div>);
}

export default ChallengeSkeleton;