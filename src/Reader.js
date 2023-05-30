import { useEffect, useState, useMemo, useLayoutEffect, useRef } from "react";
import "styled-components/macro";

import { TEXT } from "./constants";
import { Button } from "./components";
import SelectedWordPane from "./SelectedWordPane";

export default function Reader({ showPane, saveWord }) {
  const paragraphs = useMemo(
    () => TEXT.split("\n").filter((p) => p.trim() !== ""),
    []
  );

  const [
    [selectedWord, selectedWordIndex, selectedParagraphIndex],
    setSelectedWord,
  ] = useState(["", -1, -1]);

  function selectWord(word, wordIndex, paragraphIndex) {
    setSelectedWord([word, wordIndex, paragraphIndex]);
  }

  function ParagraphWrapper({ item, index }) {
    return (
      <Paragraph
        key={`${item.slice(0, 10)}-${index}`}
        paragraphText={item}
        paragraphIndex={index}
        selectWord={selectWord}
        selectedParagraphIndex={selectedParagraphIndex}
        selectedWordIndex={selectedWordIndex}
      />
    );
  }

  return (
    <div
      css={`
        display: flex;
        gap: 10px;
      `}
    >
      <div
        css={`
          flex: 2 1 0;
          flex-wrap: wrap;
        `}
      >
        <PaginationWrapper items={paragraphs}>
          {ParagraphWrapper}
        </PaginationWrapper>
      </div>
      {showPane && (
        <SelectedWordPane selectedWord={selectedWord} saveWord={saveWord} />
      )}
    </div>
  );
}

function PaginationWrapper({ items, children }) {
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(5);

  const itemsToShow = items.slice(startRange, endRange);
  const [show, setShow] = useState(false);

  const [height, setHeight] = useState(0);
  const maxHeight = 500;

  useLayoutEffect(() => {
    // console.log(
    //   `current height: ${height}, show: ${show}, nts: ${numItemsToShow}`
    // );
    const isTooLarge = height >= maxHeight;
    if (isTooLarge && !show) {
      setShow(true);
      setEndRange((n) => n - 1);
    } else if (!show) {
      setEndRange((n) => n + 1);
    }
  }, [height, show, startRange, endRange]);

  return (
    <HeightWrapper setHeight={setHeight} show={show}>
      {itemsToShow.map((item, index) => children({ item, index }))}
    </HeightWrapper>
  );
}

function HeightWrapper({ children, show, setHeight }) {
  const measureRef = useRef();

  useLayoutEffect(() => {
    if (measureRef.current) {
      setHeight(measureRef.current.getBoundingClientRect().height);
    }
  });

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

function Paragraph({
  paragraphText,
  paragraphIndex,
  selectWord,
  selectedWordIndex,
  selectedParagraphIndex,
}) {
  const words = paragraphText.split(" ");

  return (
    <div
      // TODO: detect when to set direction RTL
      css={`
        direction: rtl;
        margin-bottom: 0.75em;
      `}
    >
      {words.map((word, i) => (
        <Button
          onClick={() => selectWord(word, i, paragraphIndex)}
          css={`
            margin: 1px 5px;
            ${selectedWordIndex === i &&
            selectedParagraphIndex === paragraphIndex &&
            "background-color: red !important; "}
          `}
          key={`${word}-${i}`}
        >
          {word}
        </Button>
      ))}
    </div>
  );
}
