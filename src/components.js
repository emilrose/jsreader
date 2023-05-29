import { useState, useLayoutEffect, useRef } from "react";
import styled from "styled-components";
import "styled-components/macro";

export function ExternalLink({ href, children }) {
  return (
    <a target="_blank" rel="noreferrer" href={href}>
      {children}
    </a>
  );
}

export function Text({ textArray }) {
  // TODO: add measured stuff here
  // const refContainer = useRef(null);

  // for (let text of textArray) {
  //   const element = <span ref={refContainer}>{text}</span>;
  //   console.log(refContainer.current.clientHeight);
  // }
  return <></>;
}

const StyledButton = styled.div`
  :hover {
    cursor: pointer;
    background-color: slategrey;
  }
`;

export function Button(props) {
  return <StyledButton role="button" {...props} />;
}

export function ActionButton(props) {
  // TODO: improve onclick UI here
  const { showConfirmation, onClick } = props;

  const [confirm, setConfirm] = useState(false);

  let wrappedOnClick = onClick;
  if (showConfirmation) {
    wrappedOnClick = () => {
      setConfirm(true);
      setTimeout(() => {
        setConfirm(false);
      }, 2000);
    };
  }
  return (
    <Button
      css={`
        background-color: lightgrey;
        margin: 0 0.5em;
        border: 1px solid black;
        border-radius: 0.5em;
        padding: 0 5px;
        ${confirm && "background-color: lightgreen;"}
      `}
      {...props}
      onClick={wrappedOnClick}
    />
  );
}

function MeasureExample({ children }) {
  const [height, setHeight] = useState(0);
  const measureRef = useRef();

  useLayoutEffect(() => {
    if (measureRef.current) {
      setHeight(measureRef.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <div style={{}} ref={measureRef}>
        {children}
      </div>

      <h2>The wrapped child is {Math.round(height)}px tall</h2>
    </>
  );
}
