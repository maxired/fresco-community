export class GameEngine {
    constructor(gameDefinition) {
        this.gameDefinition = gameDefinition;
        this.state = {
            selectedCard: null,
            stats: gameDefinition.stats.map(stat => ({...stat})),
        };
    }

    getAllValidCards() {
        // TODO: weighting
        // TODO: cooldown
        // TODO: flag        
        return this.gameDefinition.cards;
    }

    answerNo() {
        if (this.state.selectedCard.no_stat1) {
            this.state.stats[0].value += this.state.selectedCard.no_stat1;
        }
        if (this.state.selectedCard.no_stat2) {
            this.state.stats[1].value += this.state.selectedCard.no_stat2;
        }
        if (this.state.selectedCard.no_stat3) {
            this.state.stats[2].value += this.state.selectedCard.no_stat3;
        }
        if (this.state.selectedCard.no_stat4) {
            this.state.stats[3].value += this.state.selectedCard.no_stat4;
        }
        this.state.selectedCard = null;
    }

    answerYes() {
        if (this.state.selectedCard.yes_stat1) {
            this.state.stats[0].value += this.state.selectedCard.yes_stat1;
        }
        if (this.state.selectedCard.yes_stat2) {
            this.state.stats[1].value += this.state.selectedCard.yes_stat2;
        }
        if (this.state.selectedCard.yes_stat3) {
            this.state.stats[2].value += this.state.selectedCard.yes_stat3;
        }
        if (this.state.selectedCard.yes_stat4) {
            this.state.stats[3].value += this.state.selectedCard.yes_stat4;
        }
        this.state.selectedCard = null;
    }

    getState() {
        if (!this.state.selectedCard) {
            const validCards = this.getAllValidCards();
            const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
            console.log('New card selected', randomCard.card);
            this.state.selectedCard = randomCard;

        }
        return this.state;
    }
}