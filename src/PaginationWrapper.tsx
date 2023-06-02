import { useEffect, useState, useLayoutEffect, useRef, ReactNode } from "react";
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

  const [[startRange, endRange], setRange] = useState(() => [
    0,
    calculateParagraphsToShow(maxHeight),
  ]);
  //   console.log(`range ${[startRange, endRange]}`);

  function pageForward() {
    setRange(([_, endRange]) => [
      endRange,
      endRange + calculateParagraphsToShow(maxHeight),
    ]);
  }

  useLayoutEffect(() => {
    if (
      endRange - startRange === 0 ||
      Object.keys(itemHeight).length !== endRange - startRange
    ) {
      return;
    }
    let remainingSpace = maxHeight;
    let index = startRange;
    while (remainingSpace >= 0) {
      remainingSpace -= itemHeight[index];
      index += 1;
    }
    let newEndRange = index;
    if (newEndRange !== endRange) {
      setRange([startRange, index - 1]);
    }
  }, [endRange, itemHeight, maxHeight, startRange]);

  const itemsToShow = items.slice(startRange, endRange);

  return (
    <>
      {" "}
      <button onClick={pageForward}>page forward</button>
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
            setHeight={(h: number) => setItemHeight(h, index)}
            show={true}
          >
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
