const button = document.getElementById('timer-button');

function toTime(milliseconds) {
    if (milliseconds < 0) { milliseconds = 0; }
    const seconds = milliseconds / 1000;
    const s = Math.floor(seconds % 60);
    const m = Math.floor(seconds / 60);
    return (m < 10 ? "0" : "") + m.toString() + ":" + (s < 10 ? "0" : "") + s.toString();
}

let interval = null;
let targetTime = null;

function stopTimer() {
    button.classList.remove('button--done');
    button.innerText = toTime(fresco.element.state.duration * 60 * 1000);
    if (interval) { 
        clearInterval(interval); 
        interval = null;
    }
}

function startTimer(targetTime, now) {
    button.innerText = toTime(targetTime - 1 - now);

    interval = setInterval(() => {
        const timeRemaining = targetTime - new Date().getTime();
        button.innerText = toTime(timeRemaining);
        if (timeRemaining <= 0) {
            button.classList.add('button--done');
        }
    }, 1000);
}

function toggleTimer() {
    if (interval) { // We want to stop the timer
        stopTimer();
        fresco.setState({ startedAt: null });
        return;
    }
    
    const now = new Date().getTime();
    targetTime = now + fresco.element.state.duration * 60 * 1000;
    startTimer(targetTime, now);
    fresco.setState({ startedAt: now});
}

fresco.onReady(function () {
    const defaultState = {
        duration: 1,
        startedAt: null
    };

    const elementConfig = {
        title: 'Timer',
        toolbarButtons: [{
            title: 'Duration (min)',
            icon: '<i class="fa fa-users" />',
            ui: { type: 'slider', min: 1, max: 60 },
            property: 'duration'
        }]
    };

    fresco.initialize(defaultState, elementConfig);

    fresco.onStateChanged(function () {
        if (!fresco.element.state.startedAt) {
            stopTimer();
        } else {
            stopTimer();
            targetTime = fresco.element.state.startedAt + fresco.element.state.duration * 60 * 1000;
            startTimer(targetTime, new Date().getTime());
        }
    });

    stopTimer();
    button.addEventListener('click', toggleTimer);
});


