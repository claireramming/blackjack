let sum = 0
let hasBlackJack = false
let isAlive = false
let message = ""
const cardsContainer = document.getElementById('cards-div')
const cardPool = ['A','A','A','A',
                    2,2,2,2,
                    3,3,3,3,
                    4,4,4,4,
                    5,5,5,5,
                    6,6,6,6,
                    7,7,7,7,
                    8,8,8,8,
                    9,9,9,9,
                10,10,10,10,
                'J','J','J','J',
                'Q','Q','Q','Q',
                'K','K','K','K']
const suits = ['\u2660','\u2665','\u2663','\u2666']
let currentCards = []
let pot = 100
let ante = document.getElementById("ante-input")

document.getElementById("pot-el").textContent = `Pot: ${pot}`

function checkStatus() {
    if (sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum === 21) {
        message = "You've got Blackjack!"
        hasBlackJack = true
        pot += ante.value * 2
        document.getElementById("pot-el").textContent = `Pot: ${pot}`
    } else {
        message = "You're out of the game!"
        isAlive = false
    }
    document.getElementById("message-el").textContent = message 
    if (isAlive & !hasBlackJack) {
        document.getElementById("card-btn").style.display = "inline"
        document.getElementById("start-btn").style.display = "none"
        ante.disabled = true
    } else {
        document.getElementById("card-btn").style.display = "none"
        document.getElementById("start-btn").style.display = "inline"
        ante.disabled = false}
}

function drawCard() {
    const faceCards = ['J', 'Q', 'K']
    let nextCard = Math.floor(Math.random() * cardPool.length)
    if (!currentCards.includes(nextCard)) {
        currentCards.push(nextCard)
        const cardEl = document.createElement("div")
        cardsContainer.appendChild(cardEl)
        cardEl.classList.add('card')
        const cardNum = cardPool[nextCard]
        const cardSuit = suits[nextCard % 4]
        if (nextCard % 4 === 1 | nextCard % 4 === 3) {
            cardEl.classList.add('red')
        }
        let cardValue = 0
        if (cardNum === 'A' & sum + 11 <= 21) {
            cardValue = 11
        } else if (cardNum === 'A' & sum + 11 > 21) {
            cardValue = 1
        } else if (faceCards.includes(cardNum)) {
            cardValue = 10
        } else {cardValue = cardNum}
        
        cardEl.innerHTML = `${cardNum}<br>${cardSuit}`
        
        sum += cardValue
        document.getElementById("sum-el").textContent = `Sum: ${sum}`
    } else {
        // if "drawn card" has already been drawn:
        //  prevent endless loop if all cards have been drawn
        if (currentCards.length >= 52) {
            currentCards = []
        }
        //  then try again
        drawCard()
    }
}

function newCard() {
    if (isAlive & !hasBlackJack) {
        drawCard()
        checkStatus()
    }
    
}

function startGame() {
    sum = 0
    currentCards = []
    hasBlackJack = false
    document.getElementById("cards-el").textContent = "Cards: "
    cardsContainer.innerHTML = ""
    document.getElementById("sum-el").textContent = "Sum: "
    document.getElementById("pot-el").textContent = `Pot: ${pot}`
    if (ante.value > pot) {
        message = "You don't have enough money left to play :("
        document.getElementById("message-el").textContent = message 
    } else {
        isAlive = true
        ante.disabled = true
        pot -= ante.value
        document.getElementById("pot-el").textContent = `Pot: ${pot}`
        drawCard()
        drawCard()
        checkStatus()
    }
}

