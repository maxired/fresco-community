const button = document.getElementById("timer-button");

function valueForm(e) {
  let minutes = parseFloat(document.getElementById('minutes').value);
  let seconds = parseFloat(document.getElementById('seconds').value) / 60;

  let formDuration = minutes + seconds;
  fresco.setState({ duration: formDuration });
}

function toTime(milliseconds) {
  if (milliseconds < 0) {
    milliseconds = 0;
  }
  const seconds = milliseconds / 1000;
  const s = Math.floor(seconds % 60);
  const m = Math.floor(seconds / 60);
  return (
    (m < 10 ? "0" : "") +
    m.toString() +
    ":" +
    (s < 10 ? "0" : "") +
    s.toString()
  );
}

let interval = null;
let targetTime = null;

function stopTimer() {
  button.classList.remove("button--done");
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
      const tingsha = new Audio("tingsha.mp3");
      tingsha.play();
      button.classList.add("button--done");
      clearInterval(interval);
      interval = null;
    }
  }, 1000);
}

function toggleTimer() {
  if (interval) {
    // We want to stop the timer
    stopTimer();
    fresco.setState({ startedAt: null });
    return;
  }

  const now = new Date().getTime();
  targetTime = now + fresco.element.state.duration * 60 * 1000;
  startTimer(targetTime, now);
  fresco.setState({ startedAt: now });
}

fresco.onReady(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const duration = urlParams.get("duration");
  
  const defaultState = {
    duration: duration ? parseFloat(duration, 2) : 5,
    startedAt: null,
  };

  
  const elementConfig = {
    title: "Timer",
    toolbarButtons: [],
  };
  
  fresco.onStateChanged(function () {
    if (!fresco.element.state.startedAt) {
      stopTimer();
    } else {
      stopTimer();
      targetTime =
      fresco.element.state.startedAt +
      fresco.element.state.duration * 60 * 1000;
      startTimer(targetTime, new Date().getTime());
    }

    const actualTime = (fresco.element.state.duration * 60);
    document.getElementById('minutes').value = Math.floor(actualTime / 60);
    document.getElementById('seconds').value = Math.floor(actualTime % 60);

    if (!fresco.localParticipant.permission.canEdit) {
      button.setAttribute("disabled", true);
    } else {
      button.removeAttribute("disabled");
    }
  });

  fresco.initialize(defaultState, elementConfig);
  button.addEventListener("click", toggleTimer);
  if (fresco.localParticipant.permission) {
    if (!fresco.localParticipant.permission.canEdit) {
      button.setAttribute("disabled", true);
    }
  }
});
