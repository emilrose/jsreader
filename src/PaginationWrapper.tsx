import { useState, useLayoutEffect, useRef, ReactNode } from "react";
import "styled-components/macro";

import { ParagraphWrapperComponent } from "./Paragraph";

function calculateParagraphsToShow(maxHeight: number) {
  const minNodeHeight = 20;
  return Math.ceil(maxHeight / minNodeHeight);
}

enum AnchorIndex {
  start = "start",
  end = "end",
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

  const [[startIndex, endIndex, anchorIndex], setRange] = useState(() => [
    0,
    calculateParagraphsToShow(maxHeight),
    AnchorIndex.start,
  ]);
  console.log(`range ${[startIndex, endIndex, anchorIndex]}`);

  function pageForward() {
    setRange(([_, endIndex]) => [
      endIndex,
      Math.min(
        endIndex + calculateParagraphsToShow(maxHeight),
        items.length - 1
      ),
      AnchorIndex.start,
    ]);
  }
  function pageBackward() {
    setRange(([_, endIndex]) => [
      Math.max(endIndex - calculateParagraphsToShow(maxHeight), 0),
      startIndex,
      AnchorIndex.end,
    ]);
  }

  useLayoutEffect(() => {
    // TODO: can avoid running this as much
    const calculatedAllNodesInRange = itemHeight[endIndex] !== undefined;
    if (!calculatedAllNodesInRange) {
      return;
    }

    let index,
      newStartIndex = startIndex,
      newEndIndex = endIndex,
      remainingSpace = maxHeight;
    switch (anchorIndex) {
      case AnchorIndex.start:
        index = startIndex;
        while (remainingSpace >= 0) {
          remainingSpace -= itemHeight[index];
          // console.log(index, remainingSpace, itemHeight[index]);
          index += 1;
        }
        index -= 2; // Adjust for going two indexes too far
        newEndIndex = index;
        break;
      case AnchorIndex.end:
        index = endIndex;
        while (remainingSpace >= 0) {
          remainingSpace -= itemHeight[index];
          // console.log(index, remainingSpace, itemHeight[index]);
          index -= 1;
        }
        index += 2; // Adjust for going two indexes too far
        newStartIndex = index;
        break;
      default:
        const check: never = anchorIndex;
        return check;
    }

    setRange([newStartIndex, newEndIndex, anchorIndex]);
  }, [endIndex, itemHeight, maxHeight, startIndex]);

  const itemsToShow = items.slice(startIndex, endIndex + 1);

  const nextPageExists = endIndex + 1 !== items.length;
  const prevPageExists = startIndex > 0;

  return (
    <>
      <div>
        <button disabled={!nextPageExists} onClick={pageForward}>
          next page
        </button>
        <button disabled={!prevPageExists} onClick={pageBackward}>
          previous page
        </button>
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
            {/* {console.log("rendering", index + startIndex) as unknown as "4"} */}
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
