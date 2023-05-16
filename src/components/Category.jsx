import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import "../styles/category.css";

export default function Category({provider, account, setAccount, curate, categories, subscribedCategories}) {

    const { id } = useParams();
    const location = useLocation();
    const { stories } = location.state;

    const categoryName = categories[id-1].name;

    const navigate = useNavigate();
    const [ categoryStories, setCategoryStories ] = useState([]);

    const handleStoryClick = (storyObject) => {
        navigate(`/story/${storyObject.id}`, { state: { story: storyObject } });
    }

    console.log("received stories from category: ", stories);

    return (
        <>
            <div className="category-title">{categoryName}</div>
            <div className="category-stories">
                {stories.length === 0 ? (
                    <div className="no-stories">No stories posted yet under this category</div>
                ) : (
                    <div className="category-stories-container">
                        {stories.map((story, index) => (
                            <div 
                                key={index} 
                                className="category-story-item"
                                onClick={() => handleStoryClick(story)}
                            >
                                <div className="category-story-header">
                                    <div className="category-story-title">{story.title}</div>
                                    <div className="category-story-author">-{story.author}</div>
                                </div>
                                {story.content.length > 150 ? (
                                    <div className="category-story-preview">{story.content.slice(0, 150)}...</div>
                                ) : (
                                    <div className="category-story-preview">{story.content}</div>
                                )}
                                <div className="category-story-footer">
                                    {/* <div className="category-story-category">{story.category}</div> */}
                                    <div className="category-story-date">{story.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}
