import { useState, useLayoutEffect, useRef, ReactNode } from "react";
import "styled-components/macro";

import { ParagraphWrapperComponent } from "./Paragraph";

/* 
New approach based on looking at react-virtualized:
- render a bunch of nodes first based on min height, then unrender the unnecessary ones 
- then once all nodes are rendered, look at heights and remove the overflow ones

- but do I even need this? it's just an optimization
- i guess worth if i cache heights of the overflow ones? then i can use the heights the next time
*/

function calculateParagraphsToShow(maxHeight: number) {
  const minNodeHeight = 20;
  return Math.ceil(maxHeight / minNodeHeight);
}

export default function PaginationWrapper({
  items,
  maxHeight,
  children,
}: {
  items: string[];
  maxHeight: number;
  children: ParagraphWrapperComponent;
}) {
  const [itemHeight, _setItemHeight] = useState<{ [key: string]: number }>({});
  function setItemHeight(height: number, index: number) {
    _setItemHeight((ih) => ({ ...ih, [index]: height }));
  }

  const [[startIndex, endIndex], setRange] = useState(() => [
    0,
    calculateParagraphsToShow(maxHeight),
  ]);
  console.log(`range ${[startIndex, endIndex]}`);

  function pageForward() {
    setRange(([_, endRange]) => [
      endRange,
      endRange + calculateParagraphsToShow(maxHeight),
    ]);
  }
  function pageBackward() {
    // setRange(([_, endRange]) => [
    //   endRange,
    //   endRange + calculateParagraphsToShow(maxHeight),
    // ]);
  }

  useLayoutEffect(() => {
    if (endIndex - startIndex === 0 || itemHeight[endIndex] !== undefined) {
      return;
    }
    let remainingSpace = maxHeight;
    let index = startIndex;
    while (remainingSpace >= 0) {
      remainingSpace -= itemHeight[index];
      // console.log(index, remainingSpace, itemHeight[index]);
      index += 1;
    }
    index -= 2; // Adjust for going two indexes too far
    setRange([startIndex, index]);
  }, [endIndex, itemHeight, maxHeight, startIndex]);

  const itemsToShow = items.slice(startIndex, endIndex + 1);

  console.log(endIndex + 1, items.length);
  const nextPageExists = endIndex + 1 !== items.length;
  const prevPageExists = startIndex > 0;

  return (
    <>
      {" "}
      <div>
        {nextPageExists && <button onClick={pageForward}>next page</button>}
        {prevPageExists && (
          <button onClick={pageBackward}>previous page</button>
        )}
      </div>
      <div
        css={`
          display: flex;
          flex-flow: column;
          height: ${maxHeight}px;
          width: 100%;
        `}
      >
        {itemsToShow.map((item, index) => (
          <HeightWrapper
            key={index} // TODO: fix
            setHeight={(h: number) => setItemHeight(h, index + startIndex)}
            show={true}
          >
            {console.log("rendering", index + startIndex) as unknown as "4"}
            {children({ item, index })}
          </HeightWrapper>
        ))}
      </div>
    </>
  );
}

function HeightWrapper({
  children,
  show,
  setHeight,
}: {
  children: ReactNode;
  show: boolean;
  setHeight: (height: number) => void;
}) {
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (measureRef.current) {
      setHeight(measureRef.current.getBoundingClientRect().height);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // setHeight identity doesn't matter and it's awkward to make its identity consistent

  return (
    <div
      css={`
        ${!show && "visibility: hidden;"}
        display: flex;
        flex-direction: column;
      `}
      ref={measureRef}
    >
      {children}
    </div>
  );
}
