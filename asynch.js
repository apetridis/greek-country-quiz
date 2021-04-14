allCountries = new Array();
for (let i=0; i<countryObjects.length; i++) {
    allCountries[countryObjects[i].code3] = [countryObjects[i].code, countryObjects[i].name];
}
//allCountries["GRC"] = ["GR", "Greece"]

class Board {
    static btnNewGame = document.querySelector("#newGame");
    static btnNextRound = document.querySelector("#nextRound");
    constructor() {
        Board.btnNewGame.addEventListener("click", () => {
            Board.btnNextRound.disabled = true;
            this.newG = new Game();
        }) 
    }
}

class Game {
    static displayRound = document.querySelector(".round span");
    static displayScore = document.querySelector(".score span");
    static mainPanel = document.querySelector(".main-panel");
    static myCountry = document.querySelector("#my-country");
    static winOverlay = document.querySelector(".winoverlay");
    static lostOverlay = document.querySelector(".overlay");
    static score;
    constructor() {
        this.round = 1;
        Game.score = 0;
        Game.winOverlay.style.visibility = "hidden";
        Game.lostOverlay.style.visibility = "hidden";
        Game.mainPanel.innerHTML = "";
        Game.myCountry.innerHTML = "";
        Game.displayRound.innerHTML = this.round;
        Game.displayScore.innerHTML = 0;
        Board.btnNextRound.addEventListener("click", () => {
            Board.btnNextRound.disabled = true;
            Game.winOverlay.style.visibility = "hidden";
            Game.lostOverlay.style.visibility = "hidden";
            Game.mainPanel.innerHTML = "";
            Game.myCountry.innerHTML = "";
            this.round++;
            Game.displayRound.innerHTML = this.round;
            this.loadRandCountry();
        }) 
        this.loadRandCountry();       
    }
    loadRandCountry() {
        let codeCountry = getRandCode();
        dataCountry(codeCountry).then(data => {
            if (data.borders.length < 1) {
                this.loadRandCountry();
            }
            else {  
                this.nextR = new Round(data);        
            }
        })
    }
}
class Round {
    progress = document.querySelector(".progress");
    constructor(countryData) {
        this.progress.innerHTML = "";
        this.progress.style.width = 0;
        this.proccess = 0;
        this.correctAnswers = new Array();
        this.wrongAnswers = new Array();
        this.borders = countryData.borders;
        this.code3Country = countryData.alpha3Code;
        this.code2Country = countryData.alpha2Code;
        Game.myCountry.innerHTML = `<img src="${countryData.flag}" style="margin-left:30px; max-height: 80%; border-radius: 8px"><span style="margin-left:30px">${countryData.name}</span>`;
        this.generateAllAnswers(this.borders);
        for (let i=0; i<this.borders.length; i++) {
            this.borders[i] = allCountries[this.borders[i]][0];
        }
    }
    generateAllAnswers(borders) {
        this.allAnswers3code = new Array();
        this.allAnswers2code = new Array();
        for (let i=0; i<borders.length; i++) {
            this.allAnswers3code.push(borders[i]);
        }
        for (let i=0; i<2*borders.length; i++) {
            let candidate = getRandCode();
            if (!this.allAnswers3code.includes(candidate)) {
                this.allAnswers3code.push(candidate);
            }
        }
        shuffleArray(this.allAnswers3code);
        for (let i=0; i<this.allAnswers3code.length; i++) {
            this.allAnswers2code.push(allCountries[this.allAnswers3code[i]][0]);
        }
        this.createData(this.allAnswers2code, this.allAnswers3code);
        
    }
    createData(data2code, data3code) {
        for (let i=0; i<data2code.length; i++) {
            let answer = document.createElement("div");
            answer.classList.add("itemCountry")
            answer.id = data2code[i];
            answer.addEventListener("click", () => this.clickitem(data2code[i]))
            answer.innerHTML = `<p style="font-size:4em;">${country2emoji2(data2code[i])}</p><p>${allCountries[data3code[i]][1]}</p>`
            Game.mainPanel.appendChild(answer);
        }
    }
    clickitem(code2Country) {
        let thisanswer = document.getElementById(code2Country);
        //thisanswer.removeEventListener("click",() => this.clickitem(code2Country))
        if (this.borders.includes(code2Country) && !this.correctAnswers.includes(code2Country)) {
            this.correctAnswers.push(code2Country);
            Game.score += 5;
            Game.displayScore.innerHTML = Game.score;
            thisanswer.classList.add("correct");
            this.proccess += 1/this.borders.length;
            this.progress.style.width = `${this.proccess * 100}%`;
            this.progress.innerHTML = `${Math.round(this.proccess * 100)}%`;
            if (this.correctAnswers.length == this.borders.length){
                this.winRound()
            }
        }
        else if (!this.borders.includes(code2Country) && !this.wrongAnswers.includes(code2Country)) {
            this.wrongAnswers.push(code2Country);
            Game.score -= 3;
            Game.displayScore.innerHTML = Game.score;
            thisanswer.classList.add("wrong");
            if (this.wrongAnswers.length == this.borders.length ){
                this.lostRound()
            }
        }
    }
    winRound() {
        Board.btnNextRound.disabled = false;
        Game.mainPanel.innerHTML = Game.mainPanel.innerHTML;
        Game.winOverlay.style.visibility = "visible";
    }
    lostRound() {
        Board.btnNextRound.disabled = false;
        Game.mainPanel.innerHTML = Game.mainPanel.innerHTML;
        Game.lostOverlay.style.visibility = "visible";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    board = new Board();
});

function getRandCode() { //Returns a random code3 from countryObjects
    return countryObjects[Math.floor(Math.random()* countryObjects.length + 1)].code3;
}
function dataCountry(codeCountry) { //Returns info's about codeCountry
    return new Promise((resolve, reject) => {
        get = fetch(`https://restcountries.eu/rest/v2/alpha/${codeCountry}`)
            .then(respData => {
                if (respData.status == 200) {
                    return respData.json();
                }
                else reject(new Error(respData.status));
            })
            .then(data => {
                resolve(data)
            })
            .catch(error => console.log(error))
    });
}



        /*class Board {
            btnNewGame =  document.querySelector("#newGame");
            static displayRound = document.querySelector(".round span");
            static displayScore = document.querySelector(".score span");
            rnd = null;
            constructor() {
                this.round = 0;
                this.btnNewRound.addEventListener("click", () => {this.nextRound()}) 
                this.btnNewGame.addEventListener("click", () => {this.newGame()})            
            }
            newGame() {
                this.updateRound();
                this.rnd = new Round();
            }

            updateRound() {
                Board.displayRound.innerHTML = this.round;
            }
        }

        class Round {
            btnNewRound = document.querySelector("#nextRound");
            constructor() {
            }
            nextRound() {
                Board.round++;
            }
        }

        // Εδώ μπορείτε να βάλετε τον κώδικα για όλο το παιχνίδι
        // Μπορείτε γράψετε κλάσεις που να έχουν κάποια συμπεριφορά, 
        // π.χ. Game, PlayingCountry, Neighbour, ...
        // ή να και ακολουθήσετε άλλη τακτική, που να σας είναι πιο προσιτή

        document.addEventListener("DOMContentLoaded", () => {
            //start a new Game
            //...
            board = new Board();
            //event listener to new game button
            /*Board.newGame.addEventListener("click", () => {
                document.querySelector(".round span").innerHTML++
            })

            //event listener to next round button
            document.querySelector("#nextRound").addEventListener("click", () => {
                document.querySelector(".round span").innerHTML++;
            })

        });*/