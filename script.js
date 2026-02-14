// ------------------ DOM Elements ------------------
const titleInput = document.getElementById("title");
const storyInput = document.getElementById("story");
const categorySelect = document.getElementById("category");
const publishBtn = document.getElementById("publishBtn");
const storiesContainer = document.getElementById("storiesContainer");
const toggleThemeBtn = document.getElementById("toggleTheme");
const searchBar = document.getElementById("searchBar");
const filterCategory = document.getElementById("filterCategory");
const charCount = document.getElementById("charCount");

// ------------------ Sample Stories ------------------
let stories = [
    {
        id: Date.now() + 1,
        title: "The Moonlit Journey",
        story: "It was a night like no other. The moon hung low, casting silver shadows on the forest floor. Lila walked silently, listening to the whispers of the trees. She felt a strange pull towards the old oak at the hilltop, a pull that promised secrets long forgotten. Each step she took echoed in the stillness, reminding her that some journeys are never meant to be walked alone...",
        category: "Fiction",
        likes: 0,
        bookmarked: false,
        timestamp: new Date().toLocaleString()
    },
    {
        id: Date.now() + 2,
        title: "Morning Thoughts",
        story: "Coffee in hand, I watch the city wake up. The streets slowly fill, the hum of life begins. Every morning feels like a blank page, and yet the words never seem enough to capture the quiet magic of dawn.",
        category: "Diary",
        likes: 0,
        bookmarked: false,
        timestamp: new Date().toLocaleString()
    },
    {
        id: Date.now() + 3,
        title: "Waves of Emotion",
        story: "Tears fell like gentle rain, washing away memories that clung too tightly. Poetry became my refuge, each word a stepping stone across the turbulent sea of feelings. In every stanza, I found a piece of myself I thought I'd lost.",
        category: "Poetry",
        likes: 0,
        bookmarked: false,
        timestamp: new Date().toLocaleString()
    }
];

// ------------------ Save to localStorage & render ------------------
localStorage.setItem("stories", JSON.stringify(stories));
renderStories(stories);

// ------------------ Character Counter ------------------
storyInput.addEventListener("input", () => {
    charCount.textContent = `${storyInput.value.length} / 500`;
});

// ------------------ Random Pastel Background ------------------
function getRandomPastelColor(dark=false){
    const hue = Math.floor(Math.random()*360);
    const light = dark ? 20 + Math.random()*20 : 70 + Math.random()*10;
    return `hsl(${hue}, 70%, ${light}%)`;
}

// ------------------ Publish Story ------------------
function publishStory(){
    const title = titleInput.value.trim();
    const story = storyInput.value.trim();
    const category = categorySelect.value;

    if(!title || !story || !category){
        alert("Enter title, story, and category!");
        return;
    }

    const newStory = {
        id: Date.now(),
        title,
        story,
        category,
        likes: 0,
        bookmarked: false,
        timestamp: new Date().toLocaleString()
    };
    stories.unshift(newStory);
    localStorage.setItem("stories", JSON.stringify(stories));

    renderStories(stories);
    titleInput.value="";
    storyInput.value="";
    categorySelect.selectedIndex = 0;
    charCount.textContent = `0 / 500`;

    // Confetti animation
    createConfetti();

    // Auto scroll to top
    storiesContainer.firstChild?.scrollIntoView({behavior:"smooth"});
}

// ------------------ Render Stories ------------------
function renderStories(list){
    storiesContainer.innerHTML="";
    const dark = document.body.classList.contains("dark");
    list.forEach(s=>{
        const card = document.createElement("div");
        card.className="story-card";
        card.style.background = getRandomPastelColor(dark);

        const h3 = document.createElement("h3"); h3.textContent=s.title;
        const timestamp = document.createElement("div"); timestamp.className="timestamp"; timestamp.textContent=s.timestamp;
        const category = document.createElement("div"); category.className="category"; category.textContent=s.category;

        const p = document.createElement("p");
        let isExpanded=false;
        if(s.story.length>150){
            p.textContent = s.story.slice(0,150)+"...";
            const expandBtn = document.createElement("button"); expandBtn.className="expand-btn"; expandBtn.textContent="Read More";
            expandBtn.addEventListener("click",()=> {
                if(!isExpanded){ p.textContent=s.story; expandBtn.textContent="Collapse"; isExpanded=true;}
                else{ p.textContent=s.story.slice(0,150)+"..."; expandBtn.textContent="Read More"; isExpanded=false;}
            });
            card.appendChild(expandBtn);
        } else p.textContent=s.story;

        // ------------------ Actions ------------------
        const actions = document.createElement("div"); actions.className="actions";

        const likeBtn = document.createElement("button");
        likeBtn.textContent=`❤️ Like (${s.likes})`;
        likeBtn.addEventListener("click",()=>{
            s.likes++; likeBtn.textContent=`❤️ Like (${s.likes})`;
            localStorage.setItem("stories", JSON.stringify(stories));
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent="🗑 Delete";
        deleteBtn.addEventListener("click",()=>{
            if(confirm("Delete this story?")){
                stories = stories.filter(st=>st.id!==s.id);
                localStorage.setItem("stories", JSON.stringify(stories));
                renderStories(stories);
            }
        });

        const bookmarkBtn = document.createElement("button");
        bookmarkBtn.className="bookmark-btn";
        bookmarkBtn.textContent=s.bookmarked?"🔖 Bookmarked":"🔖 Bookmark";
        bookmarkBtn.addEventListener("click",()=>{
            s.bookmarked=!s.bookmarked;
            bookmarkBtn.textContent=s.bookmarked?"🔖 Bookmarked":"🔖 Bookmark";
            localStorage.setItem("stories", JSON.stringify(stories));
        });

        const shareBtn = document.createElement("button");
        shareBtn.className="share-btn"; shareBtn.textContent="📋 Copy";
        shareBtn.addEventListener("click",()=>{
            navigator.clipboard.writeText(`${s.title} [${s.category}]\n\n${s.story}`);
            alert("Copied to clipboard!");
        });

        actions.appendChild(likeBtn);
        actions.appendChild(bookmarkBtn);
        actions.appendChild(shareBtn);
        actions.appendChild(deleteBtn);

        card.appendChild(h3); 
        card.appendChild(timestamp); 
        card.appendChild(category); 
        card.appendChild(p); 
        card.appendChild(actions);

        storiesContainer.appendChild(card);
    });
}

// ------------------ Search & Filter ------------------
searchBar.addEventListener("input", ()=> {
    const query = searchBar.value.toLowerCase();
    let filtered = stories.filter(s=> s.title.toLowerCase().includes(query) || s.story.toLowerCase().includes(query));
    if(filterCategory.value!=="all") filtered = filtered.filter(s=>s.category===filterCategory.value);
    renderStories(filtered);
});

filterCategory.addEventListener("change", ()=>{
    searchBar.dispatchEvent(new Event("input"));
});

// ------------------ Theme Toggle ------------------
toggleThemeBtn.addEventListener("click", ()=>{
    document.body.classList.toggle("dark");
    toggleThemeBtn.textContent = document.body.classList.contains("dark")?"☀️ Light Mode":"🌙 Dark Mode";
    renderStories(stories); // re-render to fix colors
});

// ------------------ Publish ------------------
publishBtn.addEventListener("click", publishStory);

// ------------------ Confetti ------------------
function createConfetti(){
    for(let i=0;i<50;i++){
        const conf = document.createElement("div");
        conf.className="confetti";
        conf.style.left=Math.random()*window.innerWidth+"px";
        conf.style.backgroundColor=`hsl(${Math.random()*360},70%,50%)`;
        conf.style.animationDuration=(2+Math.random()*3)+"s";
        document.body.appendChild(conf);
        setTimeout(()=> conf.remove(),4000);
    }
}
