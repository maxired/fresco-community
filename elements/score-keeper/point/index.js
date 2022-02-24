
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
    });
    
    fresco.initialize({
        pointType: 'point'
    }, { title: 'Point',
    toolbarButtons: [
        {
            title: 'String',
            ui: { type: 'string' },
            property: 'pointType'
        }]});
});


