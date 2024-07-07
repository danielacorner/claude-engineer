import React, { useState, useEffect } from 'react';

interface TutorialProps {
  onComplete: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [highlight, setHighlight] = useState<string | null>(null);

  const tutorialSteps = [
    {
      title: "Welcome to Garden Designer!",
      content: "This tutorial will guide you through the basics of using our app. Click 'Next' to begin, or 'Skip' to start designing right away.",
      highlight: null,
    },
    {
      title: "Selecting Plants",
      content: "Use the plant selector on the left to choose plants for your garden. You can search for specific plants or filter by category.",
      highlight: "plant-selector",
    },
    {
      title: "Placing Plants",
      content: "After selecting a plant, click on the ground in the 3D view to place it. You can place multiple instances of the same plant.",
      highlight: "canvas",
    },
    {
      title: "Moving Plants",
      content: "Click and drag placed plants to reposition them in your garden. Use the mouse wheel to zoom in and out.",
      highlight: "canvas",
    },
    {
      title: "Plant Options",
      content: "Right-click on a plant to see options like remove, customize, or view info. Try customizing a plant's color!",
      highlight: "canvas",
    },
    {
      title: "Environment Controls",
      content: "Use the controls at the top right to adjust time of day, season, weather, and more. Watch how your garden changes!",
      highlight: "environment-controls",
    },
    {
      title: "Ground Height Adjustment",
      content: "You can adjust the ground height to create hills or valleys. Use the terrain tools to modify the landscape.",
      highlight: "terrain-tools",
    },
    {
      title: "Saving and Loading",
      content: "Save your designs and load them later using the controls at the top left. Don't forget to name your garden!",
      highlight: "save-load-controls",
    },
    {
      title: "Grid System",
      content: "Toggle the grid system on or off to help with precise plant placement and spacing.",
      highlight: "grid-toggle",
    },
    {
      title: "Plant Growth Simulation",
      content: "Use the time controls to simulate plant growth over time. Watch your garden mature!",
      highlight: "time-controls",
    },
    {
      title: "You're Ready!",
      content: "That's it! You're now ready to start designing your garden. Remember, you can always access the help menu if you need a refresher. Enjoy creating your perfect garden!",
      highlight: null,
    },
  ];

  useEffect(() => {
    if (highlight) {
      const element = document.getElementById(highlight);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('tutorial-highlight');
      }
    }

    return () => {
      if (highlight) {
        const element = document.getElementById(highlight);
        if (element) {
          element.classList.remove('tutorial-highlight');
        }
      }
    };
  }, [highlight]);

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
      setHighlight(tutorialSteps[step + 1].highlight);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
      setHighlight(tutorialSteps[step - 1].highlight);
    }
  };

  const skipTutorial = () => {
    onComplete();
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
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          {step > 0 && (
            <button onClick={prevStep}>Previous</button>
          )}
          <button onClick={nextStep}>
            {step < tutorialSteps.length - 1 ? 'Next' : 'Start Designing'}
          </button>
          {step < tutorialSteps.length - 1 && (
            <button onClick={skipTutorial}>Skip Tutorial</button>
          )}
        </div>
        <div style={{ marginTop: '10px' }}>
          Step {step + 1} of {tutorialSteps.length}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;