import { useEffect, useState, useMemo, useLayoutEffect, useRef } from "react";
import "styled-components/macro";

import { TEXT } from "./constants";
import { Button } from "./components";
import SelectedWordPane from "./SelectedWordPane";

export default function Reader({ showPane, saveWord }) {
  const paragraphs = useMemo(() => TEXT.split("\n"), []);

  const [
    [selectedWord, selectedWordIndex, selectedParagraphIndex],
    setSelectedWord,
  ] = useState(["", -1, -1]);

  function selectWord(word, wordIndex, paragraphIndex) {
    setSelectedWord([word, wordIndex, paragraphIndex]);
  }

  function renderParagraph(paragraph, paragraphIndex) {
    return (
      <Paragraph
        key={`${paragraph.slice(0, 10)}-${paragraphIndex}`}
        paragraphText={paragraph}
        paragraphIndex={paragraphIndex}
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
        <PaginationWrapper items={paragraphs} renderItem={renderParagraph} />
      </div>
      {showPane && (
        <SelectedWordPane selectedWord={selectedWord} saveWord={saveWord} />
      )}
    </div>
  );
}

function PaginationWrapper({ items, renderItem }) {
  const [numItemsToShow, setNumItemsToShow] = useState(0);
  const itemsToShow = items.slice(0, numItemsToShow);
  const [show, setShow] = useState(false);

  const [height, setHeight] = useState(0);
  console.log(
    `current height: ${height}, show: ${show}, nts: ${numItemsToShow}`
  );
  const maxHeight = "800";

  useEffect(() => {
    const isTooLarge = height > maxHeight;
    if (isTooLarge && !show) {
      // TODO: remove last one?
      setNumItemsToShow((n) => n - 1);
      setShow(true);
    } else if (!show) {
      setNumItemsToShow((n) => n + 1);
    }
  });

  return (
    <HeightWrapper setHeight={setHeight} show={show}>
      {itemsToShow.map((item, index) => renderItem(item, index))}
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
        // ${!show && "visibility: hidden;"}
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
