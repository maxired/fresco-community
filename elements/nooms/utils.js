const newNoom = ({x, y, value }) => {

fresco.send({
    type: 'extension/out/redux',
    payload: {
        senderId: fresco.element.id,
        action: {
            userId: undefined,
            type: 'PASTE_ITEMS',
            payload: { "diagramId":"noomlab",
            "json": JSON.stringify({
                "visuals":[     
{
"id": "MptkC0srl3oAXB1FoI0H0" + Date.now(),
"isLocked": false,
"zIndex": 98,
"layer": 0,
"renderer": "IFrame",
"transform": {
    "position": {
        "x": 410,
        "y": 610
    },
    "size": {
        "x": 140,
        "y": 160
    },
    "rotation": 0
},
"appearance": {
    "NAME":  "",
    "TEXT_BEHAVIOUR": 2,
    "SOURCE": "https://localhost:8080/elements/nooms/noom.html",
    "PINNED": false,
    "TEXT_DISABLED": true,
    "STROKE_COLOR": 13224393,
    "BACKGROUND_COLOR": "",
    "STROKE_THICKNESS": 0,
    "BORDER_RADIUS": 10,
    "ACTION": "",
    "IMAGE_TILED": false,
    "STATE": { sliderConfigurable : value }
}
}
],"groups":[]})
                ,"x": x ,"y": y,"deltaX":0,"deltaY":0 }
        }
        
    }
});
}