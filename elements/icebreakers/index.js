const cards = {
    green: [
        "What has been the highlight of your week so far?",
        "What is the strangest food you have ever eaten?",
        "How well would you get along with your clone?",
        "What is the oddest thing that has ever happened to you?",
        "What is one of your favorite topics of conversation?",
        "What is the best, worst or funniest job you have ever had?",
        "What is an interesting skill that you have?",

    ],
    blue: [
        "What things hold you back from doing what you really want to do?",
        "What is one thing you want to accomplish in your lifetime?",
        "If you had 10 years left to live, how would you live your life differently?",
        "What is one personality trait you admire in others?",
        "What is one thing life is teaching you right now?",
        "What is an idea you strongly believe in?",
        "What has been your greatest achievement?",
        "How did you learn your most important lesson in life?",
        "What is a time you learned something from a failure?",
        "What is one thing or situation that scares you?",
        "What are people usually surprised to find out about you?",
        "What are you grateful for?",
        "If you could give one piece of advice to a large group of people, what would it be?",
    ],
    purple: [
        "What is one of your greatest motivators in life?",
        "What is the most adventurous thing you have ever done?",
        "What has been one of your favorite moments in life?",
        "What is a talent or skill you have always wanted? And why?",
        "How would you like to be remembered?",
        "What is something you know really well?",
        "What is something you would like to do more of?"
    ]
}

const homeScreen = document.getElementById('home-screen');
const cardScreen = document.getElementById('card-screen');
const greenDeck = document.getElementById('green-deck');
const blueDeck = document.getElementById('blue-deck');
const purpleDeck = document.getElementById('purple-deck');

// function toggleTimer() {
//     if (interval) { // We want to stop the timer
//         stopTimer();
//         fresco.setState({ startedAt: null });
//         return;
//     }

//     const now = new Date().getTime();
//     targetTime = now + fresco.element.state.duration * 60 * 1000;
//     startTimer(targetTime, now);
//     fresco.setState({ startedAt: now});
// }

function drawCard(deck) {
    // return a random card from the deck
    return cards[deck][Math.floor(Math.random() * cards[deck].length)];
}

function showCard(deck, card) {
    cardScreen.innerText = card;
    if (deck === 'green') {
        cardScreen.classList.add('card--green');
    } else {
        cardScreen.classList.remove('card--green');
    }
    if (deck === 'blue') {
        cardScreen.classList.add('card--blue');
    } else {
        cardScreen.classList.remove('card--blue');
    }
    if (deck === 'purple') {
        cardScreen.classList.add('card--purple');
    } else {
        cardScreen.classList.remove('card--purple');
    }
    cardScreen.classList.remove('is-hidden');
    homeScreen.classList.add('is-hidden');
}

greenDeck.addEventListener('click', () => {
    const card = drawCard('green');
    fresco.setState({ card, deck: 'green' });
    showCard('green', card);
});

blueDeck.addEventListener('click', () => {
    const card = drawCard('blue');
    fresco.setState({ card, deck: 'blue' });
    showCard('blue', card);
});

purpleDeck.addEventListener('click', () => {
    const card = drawCard('purple');
    fresco.setState({ card, deck: 'purple' });
    showCard('purple', card);
});

function backToHome() {
    cardScreen.classList.add('is-hidden');
    homeScreen.classList.remove('is-hidden');
}

cardScreen.addEventListener('click', () => {
    fresco.setState({ card: null, deck: null });
    backToHome();
});

fresco.onReady(function () {
    
    fresco.onStateChanged(function () {
        if (!fresco.element.state.card) {
            backToHome();
        } else {
            showCard(fresco.element.state.deck, fresco.element.state.card);
        }
    });
    
    const defaultState = { card: null, deck: null };
    fresco.initialize(defaultState, { title: 'Icebreakers' });
});


