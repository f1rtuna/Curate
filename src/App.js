import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home"
import CurateForm from './components/CurateForm';
import Story from "./components/Story"
import Category from './components/Category';
import "./styles/app.css";

// ABI
import Curate from './abis/Curate.json'

// Config
import config from './config.json';


function App() {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [curate, setCurate] = useState(null)
  const [categories, setCategories] = useState([])
  const [subscribedCategories, setSubscribedCategories] = useState([])
  // const [stories, setStories] = useState([])


  const loadCurateData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
    const network = await provider.getNetwork();
    const curate = new ethers.Contract(config[network.chainId].Curate.address, Curate, provider);
    setCurate(curate);

    const totalCategories = await curate.totalCategories();
    const categories = [];
    for (let i = 1; i <= totalCategories; i++) {
      const category = await curate.getCategory(i)
      categories.push(category)
    }
    console.log("here are the categories: ", categories);
    setCategories(categories);

    if (account){
        console.log(account);
        const address = ethers.utils.getAddress(account);
        const subscribedCategories = [];
        for (let i = 1; i <= totalCategories; i++) {
            const category = await curate.getCategory(i);
            const subscribedOrNot = await curate.subscribed(category.id.toNumber(), address);
            if (subscribedOrNot){
                subscribedCategories.push(category);
            }
        }
        setSubscribedCategories(subscribedCategories);
        console.log("here are my subscribed categories ", subscribedCategories);
    }


    // const stories = await curate.getStories();
    // console.log("stories ", stories);
    // console.log(stories[0].timestamp);
    // setStories(stories);

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload();
    })
  }

  useEffect(() => {
    loadCurateData()
  }, []);

  return (
    <div>
      <Navbar 
        account = {account}
        setAccount = {setAccount}
      />
      <div className = "app-container">
          <Routes>
              <Route path="/" element={<Home 
                                        provider={provider}
                                        account={account}
                                        curate={curate}
                                        categories={categories}
                                        subscribedCategories = {subscribedCategories}
                                        // stories = {stories}
                                        />}/>
              <Route path="/curate" element = {<CurateForm
                                        provider={provider}
                                        account={account}
                                        curate={curate}
                                        categories={categories}
                                        />}/>
              <Route path="/story/:id" element={<Story 
                                                provider={provider}
                                                account={account}
                                                curate={curate}
                                                />} />
              <Route path="/category/:id" element = {<Category
                                                      provider={provider}
                                                      account={account}
                                                      curate={curate}
                                                      categories={categories}
                                                      subscribedCategories = {subscribedCategories}
                                                    />} />
          </Routes>
      </div>
  </div>
  );
}

export default App;
