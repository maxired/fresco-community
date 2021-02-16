const button = document.getElementById('timer-button');

function toTime(milliseconds) {
    if (milliseconds < 0) { milliseconds = 0; }
    const seconds = milliseconds / 1000;
    const s = Math.floor(seconds % 60);
    const m = Math.floor(seconds / 60);
    return (m < 10 ? "0" : "") + m.toString() + ":" + (s < 10 ? "0" : "") + s.toString();
}

function resetTimer() {
    button.classList.remove('button--done');
    console.log('iframe', 'fresco.state.appearance', fresco.state.appearance);
    button.innerText = toTime(fresco.state.appearance.duration * 60 * 1000);
}

let interval = null;
let targetTime = null;
function startTimer() {
    if (!interval) {
        targetTime = new Date().getTime() + fresco.state.appearance.duration * 60 * 1000;
        button.innerText = toTime(targetTime - 1 - new Date().getTime());

        interval = setInterval(() => {
            const timeRemaining = targetTime - new Date().getTime();
            button.innerText = toTime(timeRemaining);
            if (timeRemaining <= 0) {
                button.classList.add('button--done');
            }
        }, 1000);

    } else {
        clearInterval(interval);
        interval = null;
        resetTimer(fresco.state.appearance.duration * 60 * 1000);
    }
}

fresco.onReady(function () {
    fresco.initialize({
            duration: 1
        },
        {
            titlebar: {
                title: 'Timer'
            },
            toolbar: [{
                title: 'Duration (min)',
                icon: '<i class="fa fa-users" />',
                ui: { type: 'slider', min: 1, max: 60 },
                property: 'duration'
            }]
        });

    fresco.onStateChanged(function () {
        resetTimer();
    });

    resetTimer();
    button.addEventListener('click', startTimer);
});


