import React, { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers';
import { useLocation, useParams } from 'react-router-dom';
import { SiFacepunch } from "react-icons/si";
import "../styles/storyPage.css"

// ABI
import Curate from '../abis/Curate.json'

// Config
import config from '../config.json';

export default function Story({account, provider, curate}) {
    const { id } = useParams();
    const location = useLocation();
    const { story } = location.state;

    // const [provider, setProvider] = useState(null);
  
    // const [curate, setCurate] = useState(null);

    const [allTips, setAllTips] = useState([]);
    
  
    console.log(id);
    console.log(story);

    if(account){
        console.log(account);
    }

    // const fetchNetworkDetails = async () =>{
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     setProvider(provider);
    //     const network = await provider.getNetwork();
    //     const curate = new ethers.Contract(config[network.chainId].Curate.address, Curate, provider);
    //     setCurate(curate);
    // }
    
    // useEffect(() => {
    //     fetchNetworkDetails();
    //   }, []);

    useEffect(() =>{
        fetchTips();
    }, [curate])

    
    // tip section
    const [tipAmount, setTipAmount] = useState(0);
    const [tipNote, setTipNote] = useState('');


    const tippingFee = ethers.utils.parseUnits(tipAmount.toString(), "ether");

    // need these fields: uint256 story_idx, string memory note
    const tipStory = async() => {
      const signer = await provider.getSigner();
      const storyIdx = id - 1;
      const curateStory = await curate.connect(signer).tipStory(storyIdx, tipNote, {value: tippingFee});
      await curateStory.wait();
      window.location.reload();
    }


    const fetchTips = async() => {
        const tipsFetched = await curate.getTips();
        setAllTips(tipsFetched);
        console.log("tips are: ", tipsFetched);
    }

    const handleTipChange = (event) => {
      const amount = event.target.value;
      setTipAmount(amount);
    }

    const handleTipNoteChange = (event) => {
        const note = event.target.value;
        setTipNote(note);
      }

    const handleTipSubmit = (e) => {
        e.preventDefault();
        // Add logic for submitting tip amount here
        console.log(`Tipping ${tipAmount} ETH with message ${tipNote}`);
        tipStory();
    }
    

    console.log("tips: ", allTips);
    return(
  
        <div className="story-page">
            <div className="story-page-header">
                <div className="story-page-title">{story.title}</div>
                <div className="story-page-category">Category - {story.category}</div>
                <div className="story-page-footer">
                    <div className="story-page-author"><SiFacepunch style = {{"fontSize": "2.5rem"}}/> "{story.author}"</div>
                </div>
            </div>
            <div className="story-page-content">{story.content}</div>
            <div className="story-page-date">Posted: {new Date(story.date).toLocaleDateString()}</div>


            {/* address from;
            // note this idx is in reference to array index of stories
            uint256 storyIdx;
            uint256 amount;
            string note; */}
            <div className="patreon-list">
                <div className="patreon-title">RECENT PATREONS</div>
                {allTips.slice(-4).reverse().map((tip, index) => (
                    
                    <div key={index} className = "patreon-tip">
                        <div className="patreon-note">{tip.note}</div>
                        <div className="patreon-amount">{ethers.utils.formatEther(tip.amount.toString())} ETH</div>
                    </div>
                    
                ))}

            </div>
            {(account && account != story.author) && 
            <div className="tip-container">
                <form onSubmit={handleTipSubmit}>
                    <div className="tip-header">
                        Find this story interesting? Leave an anonymous Tip to show support to your favorite "Curator"
                    </div>
                    <div className="form-fields">
                        <label>
                            Tip amount (in ETH):
                            <input type="number" step="0.01" min="0" value={tipAmount} onChange={handleTipChange} />
                        </label>
                        <label>
                            Message:
                            <textarea style={{ height: '150px', width: '800px', display: 'flex', alignItems: 'center' }} value={tipNote} onChange={handleTipNoteChange} />
                        </label>

                        <button type="submit" className='tip-button'>TIP</button>
                    </div>
                </form>
            </div>
            }


        </div>
      
    )
}
