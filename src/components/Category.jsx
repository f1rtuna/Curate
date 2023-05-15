import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import "../styles/category.css";

export default function Category({provider, account, setAccount, curate, categories, subscribedCategories}) {

    const { id } = useParams();
    const location = useLocation();
    const { stories } = location.state;

    const navigate = useNavigate();
    const [ categoryStories, setCategoryStories ] = useState([]);


    const handleStoryClick = (storyObject) => {
        navigate(`/story/${storyObject.id}`, { state: { story: storyObject } });
    }

    console.log("recieved stories from category, ", stories);


    return (
        <>
        <div className = "category-stories">
            {stories.map((story, index) => {
                return (
                    <div 
                        key={index} 
                        className="story-item"
                        onClick={() => handleStoryClick(story)}
                    >
                        <div className="story-title">{story.title}</div>
                        {story.content.length > 150 ? (
                        <div className="story-preview">{story.content.slice(0, 150)}...</div>
                        ) : (
                        <div className="story-preview">{story.content}</div>
                        )}
                        <div className="story-footer">
                        <div className="story-category">{story.category}</div>
                        <div className="story-date">{story.date}</div>
                        <div className="story-author">-{story.from}</div>
                        </div>
                    </div>
                    // <div className="category-story-container">
                    //     <div className="category-story-title">
                    //         {story.title}
                    //     </div>
                    //     <div className="category-story-content">
                    //         {story.content}
                    //     </div>
                    // </div>    
                )
            })};
            
        </div>

        </>
    )
}
