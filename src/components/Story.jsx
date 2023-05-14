import React from 'react'
import { useParams } from 'react-router-dom';

export default function Story() {
    const { id } = useParams();
    console.log(id);
    return(     
        <div>
            <h2>Story {id}</h2>
        </div>
    )
}
