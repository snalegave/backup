"use strict";

/**
 * Shuffles an array in-place.
 * Source: https://bost.ocks.org/mike/shuffle/
 * @param {[]} array 
 * @returns {[]} the shuffled input array
 */
function shuffle(array) {
    var m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

/**
 * Returns a shallow copy of the object by
 * copying all of its properties to a new object.
 * @param {Object} obj - an object to copy
 * @returns {Object} a shallow clone of the object
 */
function cloneObject(obj) {
    return Object.assign({}, obj);
}

let flipped = 0;
let total = 16;
let numOfClicks = 0;
let finalArray = [];
let indices = [];
let missed = 0;
let startTime = null;

function newGame() {
    //TODO: add code to implement the game
    finalArray = setUp();
    flipped = 0;

    let board = document.querySelector("#tiles");
    board.textContent = "";
    
    for (let i = 0; i < finalArray.length; i++) {
        board.appendChild(renderButton(finalArray[i], i));
    }
    startTime = moment().unix();
    setInterval(updateTime, 1000);
}

function updateStats(){
    document.querySelector('#matches').innerHTML = flipped/2;;
    document.querySelector('#missedMatches').innerHTML = missed;
    document.querySelector('#remaining').innerHTML = 8 - flipped/2;
}

function updateTime(){
    let output = "";
    let diff = moment().unix() - startTime;

    let hours = Math.floor(diff / (60 * 60));
    diff -= (60 * 60 * hours)
    if (hours < 10) {
        output += "0";
    }
    output += (hours + ":");

    let minutes = Math.floor(diff / 60);
    if (minutes < 10) {
        output += "0";
    }
    output += (minutes + ":");

    diff -= (60 * minutes);
    if (diff < 10) {
        output += "0";
    }
    output += diff;
    document.querySelector('#time').innerHTML = output;
}

function renderButton(tile, pos){
    let butt = document.createElement("button");
    butt.className = "col-3";
    butt.setAttribute("aria-label", "card")
    butt.setAttribute("aria-live", "polite")
    let link = document.createElement("img");
    link.setAttribute("src", TILEBACK);
    link.setAttribute("alt", TILEBACKALT);
    link.setAttribute("aria-label", TILEBACKALT)
    link.className = "faceDown";
    
    butt.appendChild(link);

    link.addEventListener('click', flip)
    
    function flip(e){
        console.log(link.classList.contains('faceDown'));
        //console.log("hhhhhh " + numOfClicks);
        if(numOfClicks <= 1 && link.classList.contains('faceDown')){
            
            numOfClicks++;
            link.setAttribute("src", tile.url);
            link.setAttribute("alt", tile.alt);
            link.setAttribute("aria-label", tile.alt)
            if (numOfClicks == 1){
                e.target.className = "faceUp1"
                //console.log(e.target);
                indices.push(pos);
            }
            if (numOfClicks == 2){
                indices.push(pos);
                e.target.className = "faceUp2"
                //console.log(e.target);
                //console.log(indices);
                if (finalArray[indices[0]].alt === finalArray[indices[1]].alt){
                    console.log("correct guess");
                    let firstTile = document.querySelector(".faceUp1");
                    firstTile.className = "found";
                    let secondTile = document.querySelector(".faceUp2");
                    secondTile.className = "found";
                    flipped+= 2;
                    numOfClicks = 0;
                    indices = [];
                    if (flipped == 16){
                        alert("you finished the game, press okay to start a new game");
                        newGame();
                    }

                } else {
                    console.log("wrong guess");
                    missed++;
                    function reverse(){

                        let firstTile = document.querySelector(".faceUp1");
                        firstTile.setAttribute("src", TILEBACK);
                        firstTile.setAttribute("alt", TILEBACKALT);
                        firstTile.setAttribute("aria-label", tile.alt);
                        firstTile.className = "faceDown";

                        let secondTile = document.querySelector(".faceUp2");
                        secondTile.setAttribute("src", TILEBACK);
                        secondTile.setAttribute("alt", TILEBACKALT);
                        secondTile.setAttribute("aria-label", tile.alt);
                        secondTile.className = "faceDown";
                        numOfClicks = 0;
                        indices = [];
                    }
                    setTimeout(reverse, 500);
                }
            }

        }
        updateStats();
    }
    return butt;
}



function setUp() {
    let newArray =shuffle(TILES).slice(0,8);
    newArray.forEach(function(x){
        newArray.push(cloneObject(x))
    });
    return shuffle(newArray);
}

//start a new game when the page loads
newGame();
