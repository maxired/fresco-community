export class GameEngine {
    constructor(gameDefinition) {
        this.gameDefinition = gameDefinition;
        this.state = {
            selectedCard: null,
            stats: gameDefinition.stats.map(stat => ({...stat})),
            isDead: false
        };
    }

    getAllValidCards() {
        // TODO: weighting
        // TODO: cooldown
        // TODO: flag        
        return this.gameDefinition.cards;
    }

    setValue(statUpdate, stat) {
        if (statUpdate) {
            stat.value += statUpdate;
            stat.value = Math.min(100, Math.max(0, stat.value));
        }
    }

    answerNo() {
        this.setValue(this.state.selectedCard.no_stat1, this.state.stats[0]);
        this.setValue(this.state.selectedCard.no_stat2, this.state.stats[1]);
        this.setValue(this.state.selectedCard.no_stat3, this.state.stats[2]);
        this.setValue(this.state.selectedCard.no_stat4, this.state.stats[3]);
        this.state.selectedCard = null;
    }

    answerYes() {
        this.setValue(this.state.selectedCard.yes_stat1, this.state.stats[0]);
        this.setValue(this.state.selectedCard.yes_stat2, this.state.stats[1]);
        this.setValue(this.state.selectedCard.yes_stat3, this.state.stats[2]);
        this.setValue(this.state.selectedCard.yes_stat4, this.state.stats[3]);
        this.state.selectedCard = null;
    }

    setState(state) {
        this.state = state;
    }

    getState() {
        if (this.state.stats.filter(x => x.value === 0).length) {
            this.state.isDead = true;
            return this.state;
        }
        if (!this.state.selectedCard) {
            const validCards = this.getAllValidCards();
            const randomCard = validCards[Math.floor(Math.random() * validCards.length)];
            console.log('New card selected', randomCard.card);
            this.state.selectedCard = randomCard;
        }
        return this.state;
    }
}