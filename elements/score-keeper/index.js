
fresco.onReady(function () {
    
    fresco.onStateChanged(function () {
        render()
    });
    
    const elementConfig = {
        title: 'Score',
        toolbarButtons: [
            {
                title: 'Color',
                ui: { type: 'color' },
                property: 'color'
            },{
                title: 'Color',
                ui: { type: 'color' },
                property: 'backgroundColor'
            },
            {
                title: 'String',
                ui: { type: 'string' },
                property: 'icon'
            }
        ]
    };

    fresco.initialize({
        score: '0',
        icon: '🌱',
        color: '#ffffff',
        backgroundColor: '#ffb136'
    }, elementConfig);
    render()
});

const bc = new BroadcastChannel('fresco-community-score-keeper_channel');
bc.onmessage = (ev) => {
  if(ev.data.action === 'enter') {
      const nextScore = Number.parseInt(fresco.element.state.score, 10) + 1;
      fresco.setState({ score: nextScore });
      fresco.setParticipantLiveFeedItem(`${fresco.element.state.icon} ${nextScore}`, { background: fresco.element.state.backgroundColor, color: fresco.element.state.color });
      render();
    }
}

const render = () => {
    const score = document.querySelector('.score');
    score.style.setProperty('background-color', fresco.element.state.backgroundColor);
    score.style.setProperty('color', fresco.element.state.color);
    document.querySelector('.score--icon').innerText = fresco.element.state.icon;
    document.querySelector('.score--value').innerText = fresco.element.state.score;
};
