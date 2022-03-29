// const cards = {
//     green: [
//         "What has been the highlight of your week so far?",
//         "What is the strangest food you have ever eaten?",
//         "How well would you get along with your clone?",
//         "What is the oddest thing that has ever happened to you?",
//         "What is one of your favorite topics of conversation?",
//         "What is the best, worst or funniest job you have ever had?",
//         "What is an interesting skill that you have?",

//     ],
//     blue: [
//         "What things hold you back from doing what you really want to do?",
//         "What is one thing you want to accomplish in your lifetime?",
//         "If you had 10 years left to live, how would you live your life differently?",
//         "What is one personality trait you admire in others?",
//         "What is one thing life is teaching you right now?",
//         "What is an idea you strongly believe in?",
//         "What has been your greatest achievement?",
//         "How did you learn your most important lesson in life?",
//         "What is a time you learned something from a failure?",
//         "What is one thing or situation that scares you?",
//         "What are people usually surprised to find out about you?",
//         "What are you grateful for?",
//         "If you could give one piece of advice to a large group of people, what would it be?",
//     ],
//     purple: [
//         "What is one of your greatest motivators in life?",
//         "What is the most adventurous thing you have ever done?",
//         "What has been one of your favorite moments in life?",
//         "What is a talent or skill you have always wanted? And why?",
//         "How would you like to be remembered?",
//         "What is something you know really well?",
//         "What is something you would like to do more of?"
//     ]
// }

// .card--blue {
//     background-color: #006ED0;
// }

// .card--purple {
//     background-color: #8B3C91;
// }

// .card--green {
//     background-color: #85BD42;
// }

const defaultCardList = 'Set the card list in the toolbar';

const homeScreen = document.getElementById('home-screen');
const cardScreen = document.getElementById('card-screen');
const deck = document.getElementById('deck');

function drawCard() {
    const cards = (!fresco.element ? defaultCardList : fresco.element.state.cardList).split('|');
    // return a random card from the deck
    const card = cards[Math.floor(Math.random() * cards.length)];
    return card.trim();
}

function showCard(state) {
    cardScreen.innerText = state.card;
    document.body.style.setProperty('--background-color', state.backgroundColor || null);
    document.body.style.setProperty('--color', state.color || null);
    cardScreen.classList.remove('is-hidden');
    homeScreen.classList.add('is-hidden');
}

deck.addEventListener('click', () => {
    const card = drawCard();
    fresco.setState({ card });
    showCard({ card });
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
        const state = fresco.element.state;
        document.body.style.setProperty('--background-color', state.backgroundColor || null);
        document.body.style.setProperty('--color', state.color || null);
    
        if (!state.card) {
            backToHome();
        } else {
            showCard(state);
        }
    });
    
    const defaultState = { card: null, backgroundColor: '#333', color: '#fff', cardList: defaultCardList };
    fresco.initialize(defaultState, { 
        title: 'Deck of cards',
        toolbarButtons: [{
            title: 'Background color',
            ui: { type: 'color' },
            property: 'backgroundColor'
        },
        {
            title: 'Text color',
            ui: { type: 'color' },
            property: 'color'
        },
        {
            title: 'Card list (separated with |)',
            ui: { type: 'string' },
            property: 'cardList'
        }] 
    });
});


