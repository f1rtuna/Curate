import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import "../styles/curateForm.css";

export default function CurateForm({ provider, account, curate, categories }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(0);
  const [story, setStory] = useState('');

  const navigate = useNavigate();

  const categoryOptions = categories.map((cat, idx) => cat.name);

  const curateFee = ethers.utils.parseUnits('.0005', 'ether');
  const createStory = async (title, categoryId, story) => {
    const signer = await provider.getSigner();
    const curateStory = await curate.connect(signer).curateStory(title, categoryId, story, { value: curateFee });
    await curateStory.wait();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Title: ${title}\nCategory: ${category}\nContent: ${story}`);
    const categoryIdx = category;
    createStory(title, categoryIdx, story);
  };

  if (!account) {
    return (
      <div className="connect-wallet-message">Connect your wallet to curate.</div>
    );
  }

  return (
    <div className="curate-form-all">
      <div className="curate-form-title">Curate Your Story</div>
      <div className="curate-form">
        <div className="curate-form-background-container">
          <div className="curate-form-background"></div>
        </div>
        <form onSubmit={handleSubmit} className="curate-form-container">
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Category:
            <select value={category} onChange={(e) => setCategory(parseInt(e.target.value))}>
              {categoryOptions.map((category, index) => (
                <option key={index} value={index}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            Story:
            <textarea
              value={story}
              onChange={(e) => setStory(e.target.value)}
              style={{ height: '300px', width: '445px', resize: 'none' }}
            />
          </label>
          <button type="submit" style={{ backgroundColor: "white", fontSize: '20px', padding: '8px 12px' }}>Curate for .0005 ETH</button>
        </form>
      </div>
    </div>
  );
}
