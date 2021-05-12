let sum = 0
let dealerSum = 0
let currentCards = []
let dealerCards = []
let playerCards = []
let hasBlackJack = false
let isAlive = false
let message = ""
const cardsContainer = document.getElementById('cards-div')
const dealerCardsContainer = document.getElementById('dealer-cards-div')
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
let pot = 100
let ante = document.getElementById("ante-input")

document.getElementById("pot-el").textContent = `Pot: ${pot}`

function checkForNaturalBlackjack() {
    // if natural blackjack (2 cards only) of dealer:
    // player has blackjack?   
    // yes -> gets ante back
    // no -> loses ante
    if (dealerCards.length === 2 & dealerSum === 21) {
        message = "Dealer has Blackjack!"
        if (sum < 21) {
            isAlive = false
        } else if (sum === 21) {
            message = "Double Blackjack! You get your ante back."
            hasBlackJack = true
            pot += parseInt(ante.value)
            document.getElementById("pot-el").textContent = `Pot: ${pot}`
        }
    } else if (playerCards.length === 2 & sum === 21) {
    // no natural blackjack for dealer ->
    // player has blackjack?
    // yes -> gets ante * 1.5 
        message = "You've got Blackjack!"
        hasBlackJack = true
        pot += ante.value * 1.5
        document.getElementById("pot-el").textContent = `Pot: ${pot}`
    } 
    checkForBust()
}

function checkForBust() {
    if (sum <= 21 & !hasBlackJack & isAlive) {
        message = "Do you want to draw a new card?"
    } else if (sum > 21) {
        message = "It's a bust!"
        isAlive = false
    }
   
    document.getElementById("message-el").textContent = message 

    if (isAlive & !hasBlackJack) {
        document.getElementById("card-btn").style.display = "inline"
        document.getElementById("hold-btn").style.display = "inline"
        document.getElementById("start-btn").style.display = "none"
        ante.disabled = true
    } else {
        document.getElementById("card-btn").style.display = "none"
        document.getElementById("hold-btn").style.display = "none"
        document.getElementById("start-btn").style.display = "inline"
        ante.disabled = false}
}

function runDealer() {
    if (dealerSum < 17) {
        setTimeout(() => {
            dealCard("dealer")
            runDealer()}, 1000)
    } else {
        determineOutcome()
    }
}

function drawCard() {
    let nextCard = Math.floor(Math.random() * cardPool.length)
    if (!currentCards.includes(nextCard)) {
        return nextCard
    } else {
        // if "drawn card" has already been drawn:
        //  prevent endless loop if all cards have been drawn
        if (currentCards.length >= 52) {
            currentCards = []
        }
        //  then try again
        return drawCard()
    }
}

function dealCard(player) {
    const nextCard = drawCard()
    const faceCards = ['J', 'Q', 'K']
    currentCards.push(nextCard)
    const cardEl = document.createElement("div")
    cardEl.classList.add('card')
    const cardNum = cardPool[nextCard]
    const cardSuit = suits[nextCard % 4]
    if (nextCard % 4 === 1 | nextCard % 4 === 3) {
        cardEl.classList.add('red')
    }
    let checkSum = 0
    if (player === "player") {
        checkSum = sum
    } else {
        checkSum = dealerSum
    }
    let cardValue = 0
    if (cardNum === 'A' & checkSum + 11 <= 21) {
        cardValue = 11
    } else if (cardNum === 'A' & checkSum + 11 > 21) {
        cardValue = 1
    } else if (faceCards.includes(cardNum)) {
        cardValue = 10
    } else {cardValue = cardNum}
        
    if (player === "player") {
        cardsContainer.appendChild(cardEl)
        cardEl.innerHTML = `${cardNum}<br>${cardSuit}`
        playerCards.push(nextCard)
        sum += cardValue
        document.getElementById("sum-el").textContent = `Sum: ${sum}`
    } else if (player === "dealer") {
        dealerCards.push(nextCard)
        dealerCardsContainer.appendChild(cardEl)
        dealerSum += cardValue
        if (dealerCards.length === 2 & dealerSum != 21) {
            cardEl.classList.add('face-down')
            cardEl.textContent = '\u2655'
            document.getElementById("dealer-sum-el").textContent = `Sum: ???`
        } else {
            cardEl.innerHTML = `${cardNum}<br>${cardSuit}`
            document.getElementById("dealer-sum-el").textContent = `Sum: ${dealerSum}`
        }
    }
}


function newCard() {
    if (isAlive & !hasBlackJack & sum !=21) {
        dealCard("player")
        checkForBust()
    }  else if (sum === 21) {
        message = "You don't want to do that!"
        document.getElementById("message-el").textContent = message 
    }
}

function flipCard(secondCard) {
    return new Promise(resolve => {
        secondCard.classList.toggle('flipped')
        setTimeout(() => resolve(1), 1000)
      })
    
}

function resetDealerCard(secondCard) {
    card = dealerCards[1]
    const cardNum = cardPool[card]
    const cardSuit = suits[card % 4]
    secondCard.classList.remove('face-down', 'flipped')
    secondCard.innerHTML = `${cardNum}<br>${cardSuit}`
}

async function hold() {
    document.getElementById("card-btn").style.display = "none"
    document.getElementById("hold-btn").style.display = "none"
    message = "dealer going..."
    document.getElementById("message-el").textContent = message
    const secondCard = dealerCardsContainer.children[1]
    const flipped = await flipCard(secondCard)
    resetDealerCard(secondCard)
    document.getElementById("dealer-sum-el").textContent = `Sum: ${dealerSum}`
    runDealer()
}

function determineOutcome() {
    if (dealerSum > 21) {
        message = "dealer busts, you win!"
        pot += ante.value * 2
    } else if (dealerSum == sum) {
        message = "Push. Ante returned."
        pot += parseInt(ante.value)
    } else if (sum > dealerSum) {
        message = "You win!"
        pot += ante.value * 2
    } else if (sum < dealerSum) {
        message = "Dealer wins :("
    }
    document.getElementById("message-el").textContent = message 
    document.getElementById("pot-el").textContent = `Pot: ${pot}`
    document.getElementById("start-btn").style.display = "inline"
}

function startDealer() {
    dealCard("dealer")
    dealCard("dealer")
}

function startGame() {
    sum = 0
    currentCards = []
    dealerCards = []
    playerCards = []
    hasBlackJack = false
    cardsContainer.innerHTML = ""
    document.getElementById("sum-el").textContent = "Sum: "
    document.getElementById("pot-el").textContent = `Pot: ${pot}`
    dealerSum=0
    dealerHiddenCard = NaN
    dealerCardsContainer.innerHTML = ""
    document.getElementById("dealer-sum-el").textContent = "Sum: "

    if (ante.value > pot) {
        message = "You don't have enough money left to play :("
        document.getElementById("message-el").textContent = message 
    } else {
        isAlive = true
        ante.disabled = true
        pot -= ante.value
        document.getElementById("pot-el").textContent = `Pot: ${pot}`
        dealCard('player')
        dealCard('player')
        startDealer()
        checkForNaturalBlackjack()
    }
}

