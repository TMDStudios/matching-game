const fruits = ["🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝","🍎", "🍊", "🍌", "🍉", "🍇", "🍓", "🍒", "🥝"];
const food = ["🍞", "🧀", "🥨", "🥗", "🍔", "🍕", "🥪", "🌮", "🍞", "🧀", "🥨", "🥗", "🍔", "🍕", "🥪", "🌮"];
const emotions = ["🙂", "🙁", "🤪", "😳", "😠", "😥", "🫣", "🤨", "🙂", "🙁", "🤪", "😳", "😠", "😥", "🫣", "🤨"];
const clothes = ["👕", "👖", "🧣", "🧤", "🧦", "👗", "👟", "👒", "👕", "👖", "🧣", "🧤", "🧦", "👗", "👟", "👒"];
const sports = ["⚽️", "🏀", "🏈", "⚾️", "🎾", "🏐", "🏓", "🏒", "⚽️", "🏀", "🏈", "⚾️", "🎾", "🏐", "🏓", "🏒"];
const numbers = ["1","2","3","4","5","6","7","8","1","2","3","4","5","6","7","8"];

const pictures = ["1","2","3","4","5","6","7","8","1","2","3","4","5","6","7","8"];
let customPicturesArray = [];
const customPictures = {};

const categories = ["fruits", "food", "emotions", "clothes", "sports"];
const categoryMap = {"fruits":fruits, "food":food, "emotions":emotions, "clothes":clothes, "sports":sports, "numbers":numbers, "pictures":pictures, "customPictures":pictures};

const selected = {"a": "", "b": ""}; // Keep track of selected cards
let pairsFound = 0;
let category = categoryMap[categories[Math.floor(Math.random()*categories.length)]];
let usePictures = false;
let useCustomPictures = false;

// TODO

// more categories
// replace timeouts with async?
// clean up settings
// add pictures to default, remove numbers?

const customGame = async _ => {
    if(window.screen.width>800){
        document.getElementById("modal").style.width = "33vw";
    }else{
        document.getElementById("modal").style.width = "80vw";
    }

    if(await useSameCustomImages()){
        
        verifyImages();
    }else{
        document.getElementById("modal_content").innerHTML = `
            <div class='customImgModal'>
                <p>Please select eight images from your device.</p>
                <input type="file" id="fileInput" multiple>
            </div>
            <div><button onclick="addCustomImages()">Replace Images</button></div>
        `;

        document.getElementById("modal").showModal();
    }
}

const verifyImages = _ => {
    if(window.screen.width>800){
        document.getElementById("modal").style.width = "50vw";
    }else{
        document.getElementById("modal").style.width = "80vw";
    }

    let imageDisplay = ``;

    for(let i=0; i<8; i++){
        imageDisplay+=`<img src="${customPicturesArray[i]}"/>`
    }

    document.getElementById("modal_content").innerHTML = `
        <div class='customImgModal'>
            <div class='imagePreview'>
                ${imageDisplay}
            </div>
        </div>
        <div class='customImgModalButtons'>
            <button id="modal_button">Cancel</button>
            <button onclick="resetBoard('customPictures')">Confirm</button>
        </div>
    `
    
    document.getElementById("modal_button").addEventListener('click', () => {
        document.getElementById("modal").close();
    });

    document.getElementById("modal").showModal();
}

const useSameCustomImages = _ => {
    return new Promise((resolve, reject) => {
        if(sessionStorage.getItem('customPicturesArray')){
            document.getElementById("modal_content").innerHTML = `
                <div class='customImgModal'>
                    <p>Would you like to use the same images as last time?</p>
                </div>
                <div class='customImgModalButtons'><button id="btnNo">No</button> <button id="btnYes">Yes</button></div>
            `;

            document.getElementById("btnNo").addEventListener('click', () => {
                return resolve(false);
            });

            document.getElementById("btnYes").addEventListener('click', () => {
                customPicturesArray = JSON.parse(sessionStorage.getItem('customPicturesArray'));
                return resolve(true);
            });

            document.getElementById("modal").showModal()
        }else{
            return resolve(false);
        }
    })
}

const addCustomImages = async _ => {
    await(processImages());
    verifyImages();
}

function sizeof(obj) {
    let bytes = 0;

    function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    const objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (let key in obj) {
                            if (!obj.hasOwnProperty(key)) continue;
                            sizeOf(obj[key]);
                        }
                    } else bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    }

    function formatByteSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KB';
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MB';
        else return (bytes / 1073741824).toFixed(3) + ' GB';
    }

    return formatByteSize(sizeOf(obj));
}

const processImages = _ => {
    return new Promise((resolve, reject) => {
        let fileInput = document.getElementById('fileInput');
        let files = fileInput.files;
        customPicturesArray = [];

        const cardElement = document.querySelector('.cardBack');
        const cardHeight = cardElement.clientHeight;
        const cardWidth = cardElement.clientWidth;

        if (files.length == 8) {
            let loadedCount = 0;
            for (let i = 0; i < files.length; i++) {
                let reader = new FileReader();
                reader.onload = function (e) {
                    let img = new Image();
                    img.onload = function () {
                        let imgSizeDiff = cardHeight/img.height;
                        let canvas = document.createElement('canvas');
                        let ctx = canvas.getContext('2d');
                        if(img.width>img.height){
                            canvas.width = Math.floor(img.width*imgSizeDiff);
                            canvas.height = cardHeight;
                        }else{
                            imgSizeDiff = cardWidth/img.width;
                            canvas.width = cardWidth;
                            canvas.height = Math.floor(img.height*imgSizeDiff);
                        }
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        customPicturesArray.push(canvas.toDataURL());
                        loadedCount++;
                        if (loadedCount === files.length) {
                            console.log(`Arr size is ${sizeof(customPicturesArray)}`);
                            sessionStorage.setItem('customPicturesArray', JSON.stringify(customPicturesArray));
                            resolve();
                        }
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(files[i]);
            }
        } else {
            alert("Please select 8 images");
        }
    });
}

const organizeCustomPictures = _ => {
    for(let i=1; i<17; i++){
        i<9 ? customPictures[i.toString()] = customPicturesArray[i-1] : customPictures[i.toString()] = customPicturesArray[i-9];
    }
}

const resetBoard = newCategory => {
    document.getElementById("title").innerHTML="<h3>Find all doubles</h3>";
    category = categoryMap[newCategory];
    console.log(`Category set to ${newCategory}`);
    usePictures = newCategory=="pictures";
    useCustomPictures = newCategory=="customPictures";
    pairsFound = 0;
    selected['a']="";
    selected['b']="";
    populateBoard();
    document.getElementById("modal").close();
}

const handleHelp = _ => {
    showModal(false, false, true);
}

const showModal = (gameOver=false, setCategory=false, help=false) => {
    if(gameOver){
        const nextCategory = categories[Math.floor(Math.random()*categories.length)];
        if(window.screen.width>800){
            document.getElementById("modal").style.width = "33vw";
        }else{
            document.getElementById("modal").style.width = "50vw";
        }
        document.getElementById("modal").style.maxHeight = "40vw";
        document.getElementById("title").innerHTML=`<h3 class="playAgain" onclick="resetBoard('${nextCategory}')">Play Again</h3>`;

        document.getElementById("modal_content").innerHTML = `
        <h3>You did it!</h3>
        <div><button id="modal_button">Play Again</button></div>
        `;

        document.getElementById("modal_button").addEventListener('click', () => {
            document.getElementById("modal").close();
            resetBoard(nextCategory);
        });

        handleConfetti();
        document.getElementById("modal").showModal();
    }
    if(setCategory){
        if(window.screen.width>800){
            document.getElementById("modal").style.width = "33vw";
        }else{
            document.getElementById("modal").style.width = "60vw";
        }
        document.getElementById("modal").style.maxHeight = "80vh";

        document.getElementById("modal_content").innerHTML = `
            <div><h3>Choose a category</h3></div>
            <div id="selectCategory">
                <div onclick="resetBoard('fruits')">Fruits</div>
                <div onclick="resetBoard('food')">Food</div>
                <div onclick="resetBoard('emotions')">Emotions</div>
                <div onclick="resetBoard('clothes')">Clothes</div>
                <div onclick="resetBoard('sports')">Sports</div>
                <div onclick="resetBoard('numbers')">Numbers</div>
                <div onclick="resetBoard('pictures')">Pictures</div>
                <div onclick="customGame()"> * My Pictures * </div>
            </div>
            <div><button id="modal_button">Close</button></div>
        `

        document.getElementById("modal_button").addEventListener('click', () => {
            document.getElementById("modal").close();
        });

        document.getElementById("modal").showModal();
    }
    if(help){
        if(window.screen.width>800){
            document.getElementById("modal").style.width = "33vw";
        }else{
            document.getElementById("modal").style.width = "80vw";
        }
        document.getElementById("modal").style.maxHeight = "80vh";
        document.getElementById("modal_content").innerHTML = `
            <div><h3>Using Custom Images</h3></div>
            <div class='help'">
                <p>
                    In order us use cusom images, go to settings and select 'My Pictures'. Select 8 images from your device (square images work best) 
                    and select 'Replace Images'. If the images on the preview screen are correct, select 'Confirm' to start a game with your custom images.
                </p>
                <p> - - - </p>
                <p>
                    NOTE: The images will never leave your device. They are only visible to you. 
                </p>
                <p>
                    To read more, click <a class='gitHubLink' href="https://github.com/TMDStudios/matching-game" target="_blank">here.</a>
                </p>
            </div>
            <div><button id="modal_button">Close</button></div>
        `

        document.getElementById("modal_button").addEventListener('click', () => {
            document.getElementById("modal").close();
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
        return;
    }
    selected['a']=="" ? selected['a']=cardId : selected['b']=cardId;
    flipCard(cardId);
}

const populateBoard = () => {
    const images = randomizeBoard(category);
    let imageCount = 0;
    const rows = ["a", "b", "c", "d"];
    let codeBlock = "";
    if(useCustomPictures){
        organizeCustomPictures();
    }
    for(let i=0; i<4; i++){
        codeBlock+=`<div class="row">`;
        for(let j=0; j<4; j++){
            if(usePictures||useCustomPictures){
                if(useCustomPictures){
                    codeBlock+=`<div class="card" id="${rows[i]+j}">
                        <div id="inner${rows[i]+j}" onclick="handleClick('${rows[i]+j}')" class="cardInner">
                            <div id="front${rows[i]+j}" class="cardFront">🤔</div>
                            <div id="back${rows[i]+j}" class="cardBack"><img src="${customPictures[pictures[imageCount]]}"/></div>
                        </div>
                    </div>`;
                }else{
                    codeBlock+=`<div class="card" id="${rows[i]+j}">
                        <div id="inner${rows[i]+j}" onclick="handleClick('${rows[i]+j}')" class="cardInner">
                            <div id="front${rows[i]+j}" class="cardFront">🤔</div>
                            <div id="back${rows[i]+j}" class="cardBack"><img src="media/${images[imageCount]}.png"/></div>
                        </div>
                    </div>`;
                }
            }else{
                codeBlock+=`<div class="card" id="${rows[i]+j}">
                    <div id="inner${rows[i]+j}" onclick="handleClick('${rows[i]+j}')" class="cardInner">
                        <div id="front${rows[i]+j}" class="cardFront">🤔</div>
                        <div id="back${rows[i]+j}" class="cardBack">${images[imageCount]}</div>
                    </div>
                </div>`;
            }
            imageCount++;
        };
        codeBlock+=`</div>`;
    }
    document.getElementById("activity").innerHTML = codeBlock;

    const cardHeight = window.getComputedStyle(document.getElementById("innera0"), null).getPropertyValue("height");
    const allCards = document.querySelectorAll('.card');

    allCards.forEach(element => {
        element.style.lineHeight = `${cardHeight}`;
    });

    if(usePictures){
        const allInnerCards = document.querySelectorAll('.cardBack');
        allInnerCards.forEach(element => {
            element.style.display = "flex";
            element.style.alignItems = "center";
        });
    }
};

const handleConfetti = _ => {
    const rows = ["a", "b", "c", "d"];
    for(let i=0; i<4; i++){
        for(let j=0; j<4; j++){
            document.getElementById(`back${rows[j]}${i}`).innerHTML = '<img src="media/fireworks.gif" alt="fireworks">';
        }
    }
}

populateBoard();