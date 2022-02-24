
fresco.onReady(function () {
    
    fresco.onStateChanged(function () {
        render()
    });
    
    fresco.initialize({
        score: '0',
        icon: '🌱'
    }, { title: 'Score' });
    render()
});

const bc = new BroadcastChannel('fresco-community-score-keeper_channel');
bc.onmessage = (ev) => {
  if(ev.data.action === 'enter') {
      const nextScore = Number.parseInt(fresco.element.state.score, 10) + 1;
      fresco.setState({ score: nextScore })
      render()
  }
}

const render = () => {
    document.querySelector('.score--icon').innerText = fresco.element.state.icon
    document.querySelector('.score--value').innerText = fresco.element.state.score
}
