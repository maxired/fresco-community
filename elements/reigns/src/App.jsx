import React from "react";
const Meters = () => {
  return <div className="block meters">
    <img src="./noun-religion-3562673.svg" />
    <img src="./noun-sword-fighting-2054626.svg" />
    <img src="./noun-crowd-2383331.svg" />
    <img src="./noun-coins-1123601.svg" />
  </div>;
};

const Question = () => {
  return <div className="block question">
    <img
      className="question__image"
      src="/jester.png"
      alt="question"
    />
    <div className="question__text">I would like to sing a song for your Majesty. It's called 'The fool and its Majesty'</div>
  </div>;
};
const YesAnswer = () => {
  return <div className="answer answer--yes">
    <div className="answer__zone"></div>
    <div className="answer__text">Yes</div>
  </div>
};

const NeutralZone = () => {
  return <div className='answer answer--neutral' />;
}

const NoAnswer = () => {
  return <div className="answer answer--no">
    <div className="answer__zone"></div>
    <div className="answer__text">No</div>
  </div>;
};

export default function App() {
  return (
    <>
      <Meters />
      <Question />
      <div className='answers'>
        <NoAnswer />
        <NeutralZone />
        <YesAnswer />
      </div>
    </>
  );
}
