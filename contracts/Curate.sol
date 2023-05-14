//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Curate {
    // Event to emit when a new Story is created on our platform
    event NewStory(
        uint256 storyId,
        address indexed from,
        uint256 timestamp,
        uint256 categoryId,
        string title,
        string content
    );
    
    struct Story {
        uint256 storyId;
        address from;
        uint256 timestamp;
        uint256 categoryId;
        string title;
        string content;
    }

    struct category {
        uint256 id; //id denoting category
        string name; //the name of the category
    }

    struct Tip{
        address from;
        // note this idx is in reference to array index of stories
        uint256 storyIdx;
        uint256 amount;
        string note;
    }
    
    // modifier primarily for withdrawl functino later
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // each category will have a list of addresses that subsribed
    mapping(uint256 => category) public categories;
    mapping(uint256 => mapping(address => bool)) public subscribed;
    

    address payable owner;
    uint256 public totalCategories;
    uint256 public totalStories;
    uint256 public totalTips;

    // List of all memos received from coffee purchases.
    Story[] stories;
    Tip[] tips;

    // Testimonials are messages others users can post in reply to stories to show support


    constructor() {
        owner = payable(msg.sender);
    }

    // Internal function we'll use to shift money around
    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }

    function getStories() public view returns (Story[] memory) {
        return stories;
    }

    function tipStory(uint256 story_idx, string memory note) public payable{
        require(story_idx < totalStories, "that id doesn't exist");
        require(story_idx >= 0, "id must be >= 0");
        require(msg.value > 0, "can't tip curator with nothing");
        address curator = stories[story_idx].from;

        Tip memory newTip = Tip(msg.sender, story_idx, msg.value, note);
        tips.push(newTip);
        totalTips++;

        // finally pay to the curator
        payTo(curator, msg.value);
    }

    function getTips() public view returns (Tip[] memory){
        return tips;
    }

    // in case I want to add more categories later have to make onlyOwner to prevent
    // any possible duplicates assumed owner will act in best interest of community
    // to crate desired categories
    function createCategory(string memory _name) public
    {
        totalCategories++;
        categories[totalCategories] = category(totalCategories, _name);
    }

    function getCategories() external view returns (category[] memory){
        category[] memory allCategories = new category[] (totalCategories);
        for (uint i = 0; i < totalCategories; i++){
            allCategories[i] = categories[i];
        }
        return allCategories;
    }

    
    function getCategory(uint256 _id) public view returns (category memory) {
        return categories[_id];
    }

    function subscribe(uint256 _categoryId) public {
        require(_categoryId > 0);
        require(_categoryId <= totalCategories);
        require(subscribed[_categoryId][msg.sender] == false);

        subscribed[_categoryId][msg.sender] = true;
    }


    function curateStory(string memory _title, uint256 categoryId, string memory _content) public payable {
        // Must accept more than 0 ETH!
        require(msg.value == .0005 ether, "can't curate a story without paying .0005 Ether!");
        totalStories++;

        Story memory newStory = Story(totalStories, msg.sender, block.timestamp, categoryId, _title, _content);

        // add newStory to our array
        stories.push(newStory);

        emit NewStory(
            totalStories,
            msg.sender,
            block.timestamp,
            categoryId,
            _title,
            _content
        );
    }

    function withdrawStoryFees() public onlyOwner{
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
