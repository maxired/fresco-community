
const bc = new BroadcastChannel('fresco-community-score-keeper_channel');

function sendEnter(){
    bc.postMessage({ action: 'GivePoints', payload: { points: { type: fresco.element.state.pointType, value: 1 } } });
}

fresco.onReady(function () {
    let wasInside = undefined;
    fresco.onStateChanged(function () {
        if (fresco.element.isLocalParticipantInside !== wasInside){
            wasInside = fresco.element.isLocalParticipantInside

            if(wasInside){
                sendEnter()
            }
        }
        render()
    });
    
    fresco.initialize({
        pointType: 'point',
        backgroundColor: '#ffb136',
        icon: '🌱'
    }, {
        title: 'Point',
        toolbarButtons: [{
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
        ]}
    );

    render()
});



const render = () => {
    const score = document.querySelector('.point');
    score.style.setProperty('background-color', fresco.element.state.backgroundColor);
    document.querySelector('.point--icon').innerText = fresco.element.state.icon;
};

