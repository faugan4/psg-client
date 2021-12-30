import React from 'react'

export default function Challengefriendprevnextbtns(props) {
    const {btnPrev,btnNext,handle_next,handle_prev}=props;

    return (
        <div style={{
            display:"flex",
            padding:"1rem",
            width:"80%",
            margin:"auto",
            gap:"1rem",
            justifyContent:"flex-end"
        }}>
            {btnPrev==true && <button style={{
                width:"100px",
                padding:"1rem",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                border:"none",
                fontWeight:"bold",
            }}
            onClick={handle_prev}
            >Prev.</button>}
           
           {btnNext==true && <button
            style={{
                width:"100px",
                padding:"1rem",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                border:"none",
                fontWeight:"bold",
            }}

            onClick={handle_next}
            >Next</button>
        }
        </div>
    )
}
