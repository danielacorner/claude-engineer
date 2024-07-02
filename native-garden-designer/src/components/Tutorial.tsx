import React, { useState } from 'react';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Garden Designer!",
      content: "This tutorial will guide you through the basics of using our app.",
    },
    {
      title: "Selecting Plants",
      content: "Use the plant selector on the left to choose plants for your garden.",
    },
    {
      title: "Placing Plants",
      content: "Click on the ground in the 3D view to place your selected plant.",
    },
    {
      title: "Moving Plants",
      content: "Click and drag placed plants to reposition them in your garden.",
    },
    {
      title: "Plant Options",
      content: "Right-click on a plant to see options like remove, customize, or view info.",
    },
    {
      title: "Environment Controls",
      content: "Use the controls at the top right to adjust time of day and season.",
    },
    {
      title: "Saving and Loading",
      content: "Save your designs and load them later using the controls at the top left.",
    },
    {
      title: "You're Ready!",
      content: "That's it! You're now ready to start designing your garden. Enjoy!",
    },
  ];

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <h2>{tutorialSteps[step].title}</h2>
        <p>{tutorialSteps[step].content}</p>
        <button onClick={nextStep}>
          {step < tutorialSteps.length - 1 ? 'Next' : 'Start Designing'}
        </button>
      </div>
    </div>
  );
};

export default Tutorial;