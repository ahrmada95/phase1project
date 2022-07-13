//global class
//Card class declaration and constructor
class Card {
    cardId; //card id - 8 digit int
    name; //card name
    type; //type of card
    desc; //description of card or card effect
    atk = undefined; //attack point statline, NOTE that spells, traps do not have this stat
    def = undefined; //defense point statline, NOTE that spells, traps, links, do not have stat
    level = undefined; // card level (when applicable), NOTE that spells, traps, links, and XYZ do not have levels
    race; //race of card, for spell/trap this describes the type of spell/trap they are 
    attribute = undefined; //attribute, does not apply to spell/trap
    imageUrl;// image url to grab from site, NOT FROM GOOGLE SERVER, else blacklist
    constructor(cardId, name, type, desc, atk, def, level, race, attribute, imageUrl) {
        this.cardId = cardId; this.name = name; this.type = type; this.desc = desc; this.atk = atk; this.def = def; this.level = level; this.race = race; this.attribute = attribute; this.imageUrl = imageUrl;
    }
}

//global variables
let currDeck = ''; //name of current deck
let mainDeck = []; //empty array to hold main deck
let extraDeck = []; //empty array to hold extra deck
let sideDeck = []; //empty array to hold side deck
let listDecks = []; //empty array to hold the list of deck names from db, will use to fill form options

//get urls for Yu-Gi-Oh! Prodeck API
const apiBaseUrl = 'https://db.ygoprodeck.com/api/v7/cardinfo.php?';
const urlCardName = `${apiBaseUrl}name=`;
const urlCardId = `${apiBaseUrl}id=`;
const baseUrlImg = 'https://ygoprodeck.com/pics/';
const decksUrl = 'http://localhost:3000/decks';

//grab elements
const cardViewImg = document.querySelector('#selected-card-img');
const cardViewName = document.querySelector('#select-card-name');
const cardViewAttributes = document.querySelector('#select-card-attributes');
const cardStats = document.querySelector('#select-card-stats');
const cardEffects = document.querySelector('#select-card-effects');
const deckForm = document.querySelector('#deck-form');

//API CALL: fetch request to search by card's name
const fetchByName = async (cardName) => {
    //request from api
    let req = await fetch(`${urlCardName}${cardName}`);
    //get response back as json
    let res = await req.json();
    //return response, JUST THE CARD INFORMATION
    return res['data']['0'];
}

//API CALL: fetch request to search by card's ID
const fetchById = async (cardId) => {
    //request from api
    let req = await fetch(`${urlCardId}${cardId}`);
    //get response back as json
    let res = await req.json();
    //return response, JUST THE CARD INFORMATION
    return res['data']['0'];
}

//DB CALL: fetch list of deck na`mes
const fetchListDecks = async () => {
    let req = await fetch(decksUrl);
    let res = await req.json();
    return Object.keys(res);
}

//DB CALLL: fetch deck information 
const fetchDeck = async (deckName) => {
    let req = await fetch(decksUrl);
    let res = await req.json();
    return res[`${deckName}`];
}

//initalize deck name to first from db
const initalizeDeck = async () => {
    const arrayOfNames = await fetchListDecks()
    currDeck = arrayOfNames[0];
}

//fill up deck arrays
const populateDecks = async (foo) => {
    await foo();
    let deckList = await fetchDeck(currDeck);
    mainDeck = deckList.mainDeck; 
    extraDeck = deckList.extraDeck; 
    sideDeck = deckList.sideDeck;
    console.log(deckList);
}

//render main deck
const renderMainDeck = () => {
    console.log(currDeck);
}

//render extra deck
const renderExtraDeck = () => {
    console.log(currDeck);
}

//render side deck 
const renderSideDeck = () => {
    console.log(currDeck);
}
//render deck application portion
const renderDeck = () => {
    renderMainDeck();
    renderExtraDeck();
    renderSideDeck();
}

const testCardView = async(cardNameOrId) => {
    //undefined var
    let cardSearched; 
    //check to see if it is a number or not
    if(isNaN(cardNameOrId)){
        //not a number -> fetch by Name
        cardSearched = await fetchByName(cardNameOrId);
    } else {
        //is a number -> fetch by ID
        cardSearched = await fetchById(cardNameOrId);
    }

    cardViewImg.src = `https://ygoprodeck.com/pics/${cardSearched['id']}.jpg`;
    cardViewName.textContent = cardSearched['name'];
    cardViewAttributes.textContent = `${cardSearched['race']}/${cardSearched['type']}`;
    cardStats.textContent = `ATK/${cardSearched['atk']}`
    cardEffects.textContent = cardSearched['desc']
}

deckForm.addEventListener('change', () => {
    currDeck = deckForm[0].value;
    renderDeck();
})

const updateDeckSelector = async () => {
    const options = await fetchListDecks();
    deckForm.innerHTML = `
        <form id="deck-form">
            <label for= "decks" > Choose a Deck:</label >
            <select id="decks" name="deck-selector">

            </select>
        </form> 
        `
    options.forEach(option => {
        const op = document.createElement('option')
        op.value = option
        op.textContent = option
        deckForm[0].append(op)
    })
}

updateDeckSelector()

testCardView(80896940);
populateDecks(initalizeDeck);

