import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

export default function CurateForm({provider, account, curate, categories}) {
    // curate fields: string memory _title, uint256 categoryId, string memory _content
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(0);
  const [story, setStory] = useState('');

  const navigate = useNavigate();


  // array of category strings
// remember tho the categoryId is + 1 from the index
//   console.log(categories[0].id.toNumber());
//   console.log(categories[0].name);
  const categoryOptions = categories.map((cat, idx) => (
    cat.name
  ));

  console.log(categoryOptions);

  const curateFee = ethers.utils.parseUnits(".0005", "ether");
  const createStory = async(title, categoryId, story) => {
    const signer = await provider.getSigner()
    const curateStory = await curate.connect(signer).curateStory(title, categoryId, story, {value: curateFee});
    await curateStory.wait();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Title: ${title}\nCategory: ${category}\nContent: ${story}`);
    const categoryIdx = category;
    createStory(title, categoryIdx, story);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label>
        Category:
        <select value={category} onChange={(e) => setCategory(parseInt(e.target.value))}>
          {categoryOptions.map((category, index) => (
            <option key={index} value={index}>{category}</option>
          ))}
        </select>
      </label>
      <label>
        Story:
        <textarea value={story} onChange={(e) => setStory(e.target.value)} />
      </label>
      <button type="submit">Curate for .0005 ETH</button>
    </form>
  )
}
