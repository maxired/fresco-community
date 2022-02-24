
const bc = new BroadcastChannel('fresco-community-score-keeper_channel');

function sendEnter(){
    bc.postMessage({ action: 'enter' });
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
    
    fresco.initialize({}, { title: 'Point' });
});


