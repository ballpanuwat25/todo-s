import { useState, useEffect } from "react";

import './App.css'

const HackerEffect = ({ text, tag: TagName = "h1" }) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const [intervalId, setIntervalId] = useState(null);
  
    useEffect(() => {
      return () => clearInterval(intervalId);
    }, [intervalId]);
  
    const handleMouseOver = (event) => {
      let iteration = 0;
  
      clearInterval(intervalId);
  
      setIntervalId(
        setInterval(() => {
          const innerText = event.target.innerText;
          const newText = innerText
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
  
              return letters[Math.floor(Math.random() * 26)];
            })
            .join("");
  
          if (iteration >= text.length) {
            clearInterval(intervalId);
          }
  
          iteration += 1 / 3;
  
          if (event.target.tagName === TagName.toUpperCase()) {
            event.target.innerText = newText;
          }
        }, 30)
      );
    };
  
    return (
      <TagName onMouseOver={handleMouseOver}>
        {text}
      </TagName>
    );
  };
  

export default HackerEffect;
