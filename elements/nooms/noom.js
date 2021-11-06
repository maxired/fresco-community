console.log('maxire dnoom')
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

 const img = document.querySelector('#noom');

 const index = Math.floor(Math.random() * nooms.length);

 img.src = nooms[index].src