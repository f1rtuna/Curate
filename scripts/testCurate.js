// Returns the Ether balance of a given address.
async function getBalance(address) {
    const balanceBigInt = await ethers.provider.getBalance(address);
    return ethers.utils.formatEther(balanceBigInt);
  }

  // Logs the Ether balances for a list of addresses.
  async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
      console.log(`Address ${idx} balance: `, await getBalance(address));
      idx ++;
    }
  }
  
  // Logs the memos stored on-chain from coffee purchases.
  async function printStories(stories) {
    for (const story of stories) {
      const id =  story.storyId;
      const address =  story.from;
      const timestamp =  story.timestamp;
      const categoryId =  story.categoryId;
      const title = story.title;
      const content =  story.content;
      console.log(`At ${timestamp}, ${address} posted: "${title}: ${content}`);
      console.log(`story title: ${title} with id of ${id} for category ${categoryId}\n`);
    }
  }
  
  async function main() {
    // Get the example accounts we'll be working with.
    const [owner, author, author2, author3] = await ethers.getSigners();
  
    // We get the contract to deploy.
    const Curate = await ethers.getContractFactory("Curate");
    const curate = await Curate.deploy();
  
    // Deploy the contract.
    await curate.deployed();
    console.log("curate deployed locally to following address:", curate.address);
  
    // Check balances before the coffee purchase.
    const addresses = [owner.address, author.address, author2.address, curate.address];
    console.log("== logging addresses ==");
    await printBalances(addresses);
  
    // Buy the owner a few coffees.
    const curateFee = ethers.utils.parseUnits(".0005", "ether");
  
  //   first create category
    const CategoryTransaction = await curate.connect(owner).createCategory("Test");
    CategoryTransaction.wait();

    const totalCategories = await curate.totalCategories()
    const categories = []
    for (let i = 1; i <= totalCategories; i++) {
      const category = await curate.getCategory(i)
      categories.push(category)
    }
    console.log("here are the categories: ", categories);
    
    
    const CategorySubscription = await curate.connect(owner).subscribe(totalCategories);
    CategorySubscription.wait();

    const subscribedCategories = []
    for (let i = 1; i <= totalCategories; i++) {
        const category = await curate.getCategory(i)
        const subscribedOrNot = await curate.subscribed(category.id.toNumber(), owner.address)
        if (subscribedOrNot){
            subscribedCategories.push(category)
        }
    
    console.log("here are my subscribed categories ", subscribedCategories)};

    const curateStory = await curate.connect(owner).curateStory("testing", totalCategories, "some test messages", { value: curateFee });
    curateStory.wait();

    console.log("== owner successfully created a story ==");
    await printBalances(addresses);

    console.log("== here are the stories ==");
    const stories = await curate.getStories();
    console.log(stories);

    const tip = ethers.utils.parseUnits(".5", "ether");
    const storyId = await curate.totalStories();
    const storyIndex = storyId.toNumber() - 1;
    console.log("story id is: ", storyIndex);
    const tipStory = await curate.connect(author).tipStory(storyIndex, "good story man", { value: tip});

    const tipStory2 = await curate.connect(author2).tipStory(storyIndex, "well done", { value: tip});

    console.log("author address 1 and address 2 tipped addresss 0 .1 Eth");
    console.log("here are the tips:");
    const tips = await curate.getTips();
    console.log(tips);

    console.log("== now withdrawing storyFees ==");
    await curate.connect(owner).withdrawStoryFees();
    await printBalances(addresses);
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  