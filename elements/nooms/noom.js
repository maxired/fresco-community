
const nooms = [
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/JAiBJ3KWLTgzSL8yJYGue.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/j1oKUJyAqNXsnbYWqiDA0.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/ltVmD_8ezcaTQg3WLQrU0.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/IChZpSeHteFG2wI9jPzk5.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/GxD1p9-mswUzlNQbUIGAN.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/iqNfdIGoWiglljKgfnNKi.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/cqvZtrGo8QJ4HijL5lJ0r.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/pDhpQM_sLMtg1H1xg9MYr.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/8-WNIqL5Gme8cQ3hnaDFQ.png' },
    { src: 'https://fresco-upload-prod2.s3.amazonaws.com/public/esPcTMZzL9sgqJYZeLVDX.png'}
]

const bc = new BroadcastChannel('noom_channel');

const noomDiv = document.querySelector('#noom');

const Img = (src) => `<img src="${src}" />`
noomDiv.innerHTML = Img(nooms[0].src)

fresco.onReady(function () {
    function render() {
        let value = fresco.element.state['sliderConfigurable'];
        const indexes = []
       
        while(value>10) {
            indexes.unshift(10);
            value-=10;
        }
        indexes.unshift(value);
        noomDiv.innerHTML = indexes.map((index) => Img(nooms[index -1].src)).join('')
    }

    const defaultState = {
        sliderConfigurable: 1,
    };

    const elementConfig = {
        title: 'Configurables',
        toolbarButtons: [{
            title: 'Noom value',
            ui: { type: 'slider', min: 1, max: 60 },
            property: 'sliderConfigurable',
        },
        ]
    };


    bc.onmessage = (ev) => {
        if (ev.data.action === 'onStateChanged') {
            if(!fresco.element?.transform) {
                return
            }
            const left = fresco.element.transform.position.x -  fresco.element.transform.size.x / 2
            const right = fresco.element.transform.position.x +  fresco.element.transform.size.x / 2
            const top = fresco.element.transform.position.y -  fresco.element.transform.size.y / 2
            const bottom = fresco.element.transform.position.y +  fresco.element.transform.size.y / 2
          
            const { x, y } = ev.data.payload.transform.position;
            if(
                
                x > left && x < right && 
                y > top &&  y < bottom
            ){
                // todo
                // delete moved
                // update value

                fresco.setState({ sliderConfigurable: fresco.element.state.sliderConfigurable + ev.data.payload.state.sliderConfigurable })
                
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
            }
           
        }
    }

    let currentValue = 1;
    fresco.onStateChanged(function () {

        bc.postMessage({
            action: 'onStateChanged',
            payload: fresco.element
        });

        const newValue = fresco.element.state['sliderConfigurable'];
        if (newValue !== currentValue) {
            console.log('newValue updated', { newValue, currentValue })
            const diff = newValue - currentValue;
            currentValue = newValue;
             fresco.send({
                type: 'extension/out/redux',
                payload: {
                    senderId: fresco.element.id,
                    action: {
                        userId: undefined,
                        type: 'TRANSFORM_ITEMS',
                        payload: { 
                            "diagramId":"noomlab",
                            "oldBounds": fresco.element.transform,
                            "newBounds": {
                                ...fresco.element.transform,
                                position: {
                                    ...fresco.element.transform.position,
                                    y: fresco.element.transform.position.y - diff * 50
                                },
                                size: {
                                    ...fresco.element.transform.size,
                                    y: 140 + (currentValue -1) * 100
                                },
                            },
                            "itemIds":[fresco.element.id]
                         }
                    }
                }
            });
           
        }
        render()
       
    });
    fresco.initialize(defaultState, elementConfig);
    render()
});


document.addEventListener('click', (event) => {
    const clickY = event.clientY;
    const totalHeight = window.innerHeight;
    const ratio = clickY/totalHeight;
    const newValue = Math.round( fresco.element.state.sliderConfigurable * ratio);

    const secondValue = fresco.element.state.sliderConfigurable - newValue;
   

    if (secondValue> 0 && newValue > 0) {
        fresco.setState({ sliderConfigurable: secondValue });
        const top = fresco.element.transform.position.y - fresco.element.transform.size.y / 2;
        const secondY = top + newValue * 100 - 10;
        newNoom({ x: fresco.element.transform.position.x, y: secondY, value: newValue })
    }
    
})