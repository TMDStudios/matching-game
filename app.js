const fruits = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝","🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝"];
const food = ["🍞", "🧀", "🥨", "🥗", "🍔", "🍕", "🥪", "🌮"];

const board = {};

const randomizeBoard = (images) => {
    // let nums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    for(let i=0; i<images.length; i++){
        const j = Math.floor(Math.random() * images.length);
        if(i!=j){
            [images[i], images[j]] = [images[j], images[i]];
            console.log(images);
        }
    }

    return images;
};

const populateBoard = () => {
    const images = randomizeBoard(fruits);
    let imageCount = 0;
    const rows = ["a", "b", "c", "d"];
    let codeBlock = "";
    for(let i=0; i<4; i++){
        codeBlock+=`<div class="row">`;
        for(let j=0; j<4; j++){
            codeBlock+=`<div id="${rows[i]+j}">${images[imageCount]}</div>`;
            imageCount++;
        };
        codeBlock+=`</div>`;
    }
    console.log(codeBlock)
    document.getElementById("activity").innerHTML = codeBlock;
};

populateBoard();