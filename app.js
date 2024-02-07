const fruits = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝","🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝"];
const food = ["🍞", "🧀", "🥨", "🥗", "🍔", "🍕", "🥪", "🌮"];

const selected = {"a": "", "b": ""}; // Keep track of selected cards
let selectedCard = "";
let cardToFlip = "";
let pairsFound = 0;

// TODO
// only allow 2 cards to be flipped at a time
// add congratulations animation
// allow user to reset game after the game is done
// more categories
// each new game should use random category
// allow for category selection
// add images
// allow image uploads for custom games

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
        if(selectedCard.length>0){
            // console.log(`TESTING cardId=${cardId}, selectedCard=${selectedCard}, cardToFlip=${cardToFlip}`)
            if(document.getElementById("back"+cardId).innerHTML==document.getElementById("back"+selectedCard).innerHTML){
                selectedCard="";
                pairsFound++;
                setTimeout(() => {
                    if(pairsFound>=8){
                        alert("You did it!");
                    }
                }, 1000);
            }else{
                cardToFlip=selectedCard;
                selectedCard="";
                pause = true;
                setTimeout(() => {
                    flipCard(cardId, true);
                    flipCard(cardToFlip, true);
                }, 1000);
            }
        }else{
            selectedCard=cardId;
        }
    }
};

const populateBoard = () => {
    const images = randomizeBoard(fruits);
    let imageCount = 0;
    const rows = ["a", "b", "c", "d"];
    let codeBlock = "";
    for(let i=0; i<4; i++){
        codeBlock+=`<div class="row">`;
        for(let j=0; j<4; j++){
            codeBlock+=`<div class="card" id="${rows[i]+j}">
                <div id="inner${rows[i]+j}" onclick="flipCard('${rows[i]+j}')" class="cardInner">
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
    // for(let i=0; i<4; i++){
    //     for(let j=0; j<4; j++){
    //         document.getElementById("front"+rows[i]+j).addEventListener('click', function() {
    //             if(this.className=="cardFront"){
    //                 this.className = "cardFrontFlipped";
    //                 document.getElementById("back"+rows[i]+j).className = "cardBackFlipped";
    //             }else{
    //                 this.className = "cardFront";
    //                 document.getElementById("back"+rows[i]+j).className = "cardBack";
    //             }
    //             // this.classList.toggle("cardFrontFlipped");
    //             // document.getElementById("back"+rows[i]+j).classList.toggle("cardBackFlipped");
    //         });
    //     };
    // };
};


//     for (let i = 0; i < rows.length; i++) {
//         for (let j = 0; j < 4; j++) {
//             let frontElement = document.getElementById("front" + rows[i] + j);
//             let backElement = document.getElementById("back" + rows[i] + j);

//             // Remove existing event listeners (if any)
//             frontElement.removeEventListener('click', toggleCard);
//             backElement.removeEventListener('click', toggleCard);

//             // Attach new event listeners
//             frontElement.addEventListener('click', toggleCard);
//             backElement.addEventListener('click', toggleCard);
//         }
//     }
// }

// function toggleCard() {
//     this.classList.toggle("cardFrontFlipped");
//     // Assuming the back elements have class names like "backa0", "backa1", etc.
//     let correspondingBack = document.getElementById("back" + this.id.slice(5));
//     correspondingBack.classList.toggle("cardBackFlipped");
// }

populateBoard();