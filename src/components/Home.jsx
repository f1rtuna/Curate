import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import bigInt from 'big-integer';
import { useNavigate, Link } from 'react-router-dom';
import { AiOutlineFolderOpen, AiOutlineFolder } from "react-icons/ai";
import { MdOutlineCreate } from "react-icons/md";
import CurateForm from './CurateForm';
import "../styles/home.css";

export default function Home({provider, account, setAccount, curate, categories, subscribedCategories}) {

    const navigate = useNavigate();
    const [stories, setStories] = useState([]);


    const handleStoryClick = (storyObject) => {
        navigate(`/story/${storyObject.id}`, { state: { story: storyObject } });
    }

    const handleCategoryClick = (id) => {
        console.log(id);

        const newStoryList = stories.filter((story) => {
            return (story.categoryId.toNumber() + 1) === id
        });

        const storiesToCategory = (newStoryList.map((story, index) => {
            const date = new Date(story.timestamp.toNumber() * 1000); // convert seconds to milliseconds
            const formattedDate = date.toLocaleString();
            const storyObject = {"id": story.storyId.toNumber(),
                            "title": story.title,
                            "content": story.content,
                            "author": story.from,
                            "category": categories[story.categoryId.toNumber()].name,
                            "date": formattedDate}
            return storyObject;
        } ))
        
        console.log("storiesToCategory is: ", storiesToCategory);
        navigate(`/category/${id}`, { state: { stories: storiesToCategory } });
    }

    const fetchStories = async () => {
        const stories = await curate.getStories();
        console.log("stories ", stories);
        // console.log(stories[0].timestamp);
        setStories(stories);
    }

    useEffect(() =>{
        fetchStories();
    }, [account])
  

    const [index, setIndex] = useState(0);

    return (
        <div className='landing-page'>
            <div className="landing-container">

                <div className="welcome-section">
                    <div className="welcome-title">
                        WELCOME TO CURATE
                    </div>
                    <div className="welcome-description">
                        <div className="welcome-image">
                            
                        </div>
                        <div className="welcome-description-text">
                            <p>
                            "Here at Curate we welcome creative writers from all over, itching
                            to "curate" their own stories. Have a new movie script idea you want
                            to test the waters with? Or have a deep confession that you're burning
                            to get out, Curate is the platform to share. Perhaps your simply a reader,
                            interested in seeing the trending stories, show support to your favorite
                            "curators" by tipping their stories along with a message!"
                            </p>
                            <div className="welcome-description-signature">
                                - f1rtuna
                            </div>
                        </div>
                    </div>
                </div>


                {/* Trending stories */}
                {/* Story fields:       uint256 storyId;
                                        address from;
                                        uint256 timestamp;
                                        uint256 categoryId;
                                        string title;
                                        string content; */}
                <div className="latest-stories">
                    <div className="latest-stories-title">Recently Curated Stories</div>
                    {stories.length === 0 ? (
                        <div className="no-stories-message">No stories curated yet! Please Connect</div>
                    ) : (
                        <div className="latest-stories-grid">
                            {stories.slice(-4).reverse().map((story, index) => {
                                const date = new Date(story.timestamp.toNumber() * 1000); // convert seconds to milliseconds
                                const formattedDate = date.toLocaleString();
                                const storyObject = {"id": story.storyId.toNumber(),
                                                    "title": story.title,
                                                    "content": story.content,
                                                    "author": story.from,
                                                    "category": categories[story.categoryId.toNumber()].name,
                                                    "date": formattedDate}
                                console.log("story object is: ", storyObject)
                                return (       
                                        <div 
                                          key={index} 
                                          className="story-item"
                                          onClick={() => handleStoryClick(storyObject)}
                                        >
                                          <div className="story-title">{story.title}</div>
                                          {story.content.length > 150 ? (
                                            <div className="story-preview">{story.content.slice(0, 150)}...</div>
                                          ) : (
                                            <div className="story-preview">{story.content}</div>
                                          )}
                                          <div className="story-footer">
                                            <div className="story-category">{categories[story.categoryId.toNumber()].name}</div>
                                            <div className="story-date">{formattedDate}</div>
                                            <div className="story-author">-{story.from}</div>
                                          </div>
                                        </div>
                                )
                            })}
                        </div>
                    )}
                </div>



                <div className="options-panel">
                    <ul className = "options">
                        <li className={index === 0 ? 'active' : ''} onClick = {() => setIndex(0)}>
                            <AiOutlineFolderOpen />
                            All Categories
                        </li>
                        <li className={index === 1 ? 'active' : ''} onClick={() => setIndex(1)}>
                            <AiOutlineFolder />
                            All Stories
                        </li>
                        <Link to="/curate" className={index === 2 ? 'active' : ''}>
                            <MdOutlineCreate />
                            Curate!
                        </Link>
                        {/* <li>
                        <div className={index === 2 ? 'active' : ''} onClick = {() => setCurateForm(true)}>
                            <MdOutlineCreate />
                            Curate!
                        </div>
                        </li> */}
                    </ul>
                </div>

                {/* category section */}
                <div className="categories-container">
                    <div className = "categories">
                        {index === 0 ? (
                            categories.length === 0 ? (
                            <div className="no-categories">No categories yet, connect your wallet</div>
                            ) : (
                            categories.map((category, index) => (
                                <div className="category-item" key={index} onClick={() => handleCategoryClick(category.id.toNumber())}>
                                <div className="category-image"></div>
                                <div className="category-name">{category.name}</div>
                                </div>
                            ))
                            )
                            ) : stories.length === 0 ? (
                                <div className = "no-categories">Currently no Stories Curated</div>
                            ) : (
                            stories.map((story, index) => {
                                const date = new Date(story.timestamp.toNumber() * 1000); // convert seconds to milliseconds
                                const formattedDate = date.toLocaleString();
                                const storyObject = {"id": story.storyId.toNumber(),
                                                        "title": story.title,
                                                        "content": story.content,
                                                        "author": story.from,
                                                        "category": categories[story.categoryId.toNumber()].name,
                                                        "date": formattedDate};

                                return (
                                <div className="story-item2" key={index} onClick={() => handleStoryClick(storyObject)}>
                                    <div className="story-image2"></div>
                                    <div className="story-bubble2">
                                        <div className="story-name2">{story.title}</div>
                                        <div className="story-author2">from: {story.from}</div>
                                    </div>
                                </div>
                                )
                            })

                        )}
                    </div>
                </div>
            </div>
        </div>
  )
}
