const fruits = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝","🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝"];
const food = ["🍞", "🧀", "🥨", "🥗", "🍔", "🍕", "🥪", "🌮", "🍞", "🧀", "🥨", "🥗", "🍔", "🍕", "🥪", "🌮"];
const emotions = ["🙂", "🙁", "🤪", "😳", "😠", "😥", "🫣", "🤨", "🙂", "🙁", "🤪", "😳", "😠", "😥", "🫣", "🤨"];
const clothes = ["👕", "👖", "🧣", "🧤", "🧦", "👗", "👟", "👒", "👕", "👖", "🧣", "🧤", "🧦", "👗", "👟", "👒"];
const sports = ["⚽️", "🏀", "🏈", "⚾️", "🎾", "🏐", "🏓", "🏒", "⚽️", "🏀", "🏈", "⚾️", "🎾", "🏐", "🏓", "🏒"];

const categories = [fruits, food, emotions, clothes, sports]

const selected = {"a": "", "b": ""}; // Keep track of selected cards
let pairsFound = 0;
const category = categories[Math.floor(Math.random()*categories.length)];

// TODO

// add congratulations animation
// more categories
// allow for category selection
// add images
// allow image uploads for custom games
// replace timeouts with async?

const showModal = (gameOver=false) => {
    if(gameOver){
        document.getElementById("title").innerHTML=`<a href="https://match.up.railway.app/">Play Again</a>`;

        document.getElementById("modal_content").innerHTML = `
        <h2><b>You did it!</b></h2>
        <div><button id="modal_button">Play Again</button></div>
        `;

        document.getElementById("modal_button").addEventListener('click', () => {
            document.getElementById("modal").close();
            window.location.replace("/");
        });

        document.getElementById("modal").showModal();
    }
}

const randomizeBoard = (images) => {
    for(let i=0; i<images.length; i++){
        const j = Math.floor(Math.random() * images.length);
        if(i!=j){
            [images[i], images[j]] = [images[j], images[i]];
        }
    }
    return images;
};

const setCardStyle = (cardId, flip) => {
    var card = document.getElementById(cardId);
    if(flip){
        card.style.borderRadius = '8px';
        card.style.position = 'absolute';
        card.style.width = '100%';
        card.style.height = '100%';
        card.style.backfaceVisibility = 'hidden';
        card.style.transition = 'transform 0.8s';
        card.style.transformStyle = 'preserve-3d';
    }else{
        card.style.borderRadius = '8px';
        card.style.position = 'absolute';
        card.style.width = '100%';
        card.style.height = '100%';
        card.style.backfaceVisibility = 'hidden';
        card.style.transition = 'transform 0.8s';
        card.style.transformStyle = 'preserve-3d';
    }
};

const flipCard = (cardId, flipBack=false) => {
    if(pairsFound>=8){
        return;
    }

    var cardFront = document.getElementById("front"+cardId);
    var cardBack = document.getElementById("back"+cardId);
    cardFront.classList.toggle('cardFront');
    cardFront.classList.toggle('cardFrontFlipped');
    cardBack.classList.toggle('cardBack');
    cardBack.classList.toggle('cardBackFlipped');

    if (cardFront.classList.contains('cardFront')) {
        setCardStyle(cardFront.id, true);
        cardFront.style.transform = 'rotateY(0deg)';
    } else {
        setCardStyle(cardFront.id, false);
        cardFront.style.transform = 'rotateY(180deg)';
    }
    cardFront.style.backgroundColor = 'snow';
    cardFront.style.color = 'rgba(0,0,0,.5)';

    if (cardBack.classList.contains('cardBack')) {
        setCardStyle(cardBack.id, false);
        cardBack.style.transform = 'rotateY(180deg)';
    } else {
        setCardStyle(cardBack.id, true);
        cardBack.style.transform = 'rotateY(0deg)';
    }
    cardBack.style.backgroundColor = 'darkblue';

    if(!flipBack){
        if(selected['a'].length>0 && selected['b'].length>0){
            if(document.getElementById("back"+selected['a']).innerHTML==document.getElementById("back"+selected['b']).innerHTML){
                document.getElementById("inner"+selected['a']).onclick = "";
                document.getElementById("inner"+selected['b']).onclick = "";
                pairsFound++;
                setTimeout(() => {
                    if(pairsFound>=8){
                        showModal(true);
                    }
                }, 1000);
            }else{
                setTimeout(() => {
                    flipCard(selected['a'], true);
                    flipCard(selected['b'], true);
                }, 1000);
            }
            setTimeout(() => {
                selected['a']="";
                selected['b']="";
            }, 1200);
        }
    }
};

const handleClick = cardId => {
    if((selected['a'].length>0 && selected['b'].length>0) || (selected['a'] == cardId && cardId.length>0)){
        // console.log(`RETURNING cardId=${cardId}, selectedA=${selected['a']}, selectedB=${selected['b']}`)
        return;
    }
    // console.log(`TESTING cardId=${cardId}, selectedA=${selected['a']}, selectedB=${selected['b']}`)
    selected['a']=="" ? selected['a']=cardId : selected['b']=cardId;
    flipCard(cardId);
}

const populateBoard = () => {
    const images = randomizeBoard(category);
    let imageCount = 0;
    const rows = ["a", "b", "c", "d"];
    let codeBlock = "";
    for(let i=0; i<4; i++){
        codeBlock+=`<div class="row">`;
        for(let j=0; j<4; j++){
            codeBlock+=`<div class="card" id="${rows[i]+j}">
                <div id="inner${rows[i]+j}" onclick="handleClick('${rows[i]+j}')" class="cardInner">
                    <div id="front${rows[i]+j}" class="cardFront">🤔</div>
                    <div id="back${rows[i]+j}" class="cardBack">${images[imageCount]}</div>
                </div>
            </div>`;
            imageCount++;
        };
        codeBlock+=`</div>`;
    }
    // console.log(codeBlock)
    document.getElementById("activity").innerHTML = codeBlock;

    const cardHeight = window.getComputedStyle(document.getElementById("innera0"), null).getPropertyValue("height");
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(element => {
        element.style.lineHeight = `${cardHeight}`;
    });
};

populateBoard();