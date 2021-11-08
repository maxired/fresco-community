
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
        console.log('maxired indexes', { indexes })
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

    fresco.onStateChanged(function () {
        render()
    });
    fresco.initialize(defaultState, elementConfig);
    render()
});
