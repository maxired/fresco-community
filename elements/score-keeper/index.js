
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
            },
            {
                title: 'String',
                ui: { type: 'string' },
                property: 'pointType'
            }
        ]
    };

    fresco.initialize({
        score: '0',
        icon: '🌱',
        color: '#ffffff',
        backgroundColor: '#ffb136',
        pointType: 'point'
    }, elementConfig);
    render()
});

const bc = new BroadcastChannel('fresco-community-score-keeper_channel');
bc.onmessage = (ev) => {
  if(ev.data.action === 'GivePoints' && ev.data?.payload?.points?.type === fresco.element.state.pointType) {
      const point = Number.parseInt(ev.data.payload.points.value || 1, 10)
      const nextScore = Number.parseInt(fresco.element.state.score, 10) + point;
      fresco.setState({ score: nextScore });
      fresco.showParticipantMessage(`${fresco.element.state.icon} ${nextScore}`, { background: fresco.element.state.backgroundColor, color: fresco.element.state.color });
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
