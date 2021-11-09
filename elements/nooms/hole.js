
const bc = new BroadcastChannel('noom_channel');

fresco.onReady(function () {
    
    bc.onmessage = (ev) => {
        if (ev.data.action === 'onStateChanged') {
            if (!fresco.element?.transform) {
                return
            }
            const left = fresco.element.transform.position.x -  fresco.element.transform.size.x / 2
            const right = fresco.element.transform.position.x +  fresco.element.transform.size.x / 2
            const top = fresco.element.transform.position.y -  fresco.element.transform.size.y / 2
            const bottom = fresco.element.transform.position.y +  fresco.element.transform.size.y / 2
          
            const { x, y } = ev.data.payload.transform.position;
            console.log('maxired onStateChanged', { x, left, right}, { y, top, bottom })
            if( 
                x > left && x < right && 
                y > top &&  y < bottom
            ) {
                console.log('maxired remove item')
                fresco.send({
                    type: 'extension/out/redux',
                    payload: {
                        senderId: fresco.element.id,
                        action: {
                            userId: undefined,
                            type: 'REMOVE_ITEMS',
                            payload: {
                                "diagramId":"noomlab",
                                "itemIds":[ev.data.payload.id]
                            }
                        }
                    }
                })
            } else {
                console.log('maxired do not remove item')
            }
           
        }
    }
});

