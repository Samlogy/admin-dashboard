import React, { useState, useRef } from "react";
import Chevron from "./Chevron";

import "./style.css";

function Accordion(props) {
  const { hiddenData, children, idx } = props;

  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const [setRotate, setRotateState] = useState("accordion__icon");

  const content = useRef(null);

  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
    setRotateState(
      setActive === "active" ? "accordion__icon" : "accordion__icon rotate"
    );
  }

  return (
    <div className="accordion__section" key={idx}>
      <button className={`accordion ${setActive}`} onClick={toggleAccordion}>
        { children }
        <Chevron className={`${setRotate}`} width={10} fill={"#777"} />
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion__hiddenData"
      >
        <p> {hiddenData} </p>
      </div>
    </div>
  );
}

export default Accordion;
