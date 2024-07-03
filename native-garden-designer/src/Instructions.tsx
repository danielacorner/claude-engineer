import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

export function Instructions() {
  const [minimized, setMinimized] = useState(true);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        background: "rgba(255, 255, 255, 0.8)",
        padding: "10px",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>Instructions:</h3>
        <IconButton onClick={() => setMinimized(!minimized)}>
          {minimized ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>
      {!minimized && (
        <>
          <p>1. Select a plant from the list on the left.</p>
          <p>2. Click on the ground to place the selected plant.</p>
          <p>3. Click and drag to move placed plants.</p>
          <p>4. Right-click on a plant for more options:</p>
          <ul>
            <li>View plant information</li>
            <li>Customize plant appearance</li>
            <li>Remove plant</li>
          </ul>
          <p>
            5. Use the environment controls to adjust time, season, weather, and
            growth speed.
          </p>
          <p>6. Save and load your garden designs using the controls.</p>
        </>
      )}
    </div>
  );
}
