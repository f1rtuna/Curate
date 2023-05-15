import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { ethers } from 'ethers';

export default function Category({provider, account, setAccount, curate, categories, subscribedCategories}) {

    const { id } = useParams();
    const location = useLocation();
    const { stories } = location.state;

    const [ categoryStories, setCategoryStories ] = useState([]);

    console.log("recieved stories from category, ", stories);


    return (
        <>
        <div>Category { id }</div>

        <div>
            {stories.map((story) => {
                return story.title;
            })};
            
        </div>

        </>
    )
}
