import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useLayoutEffect,
  useRef,
} from "react";
import "styled-components/macro";

import { TEXT } from "./constants";
import { Button, Text } from "./components";
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
        key={`${paragraph.slice(10)}-${paragraphIndex}`}
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
      <MeasureExample>
        <div>asd</div>
      </MeasureExample>
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

function HeightWrapper({ children, show }) {
  // const measuredRef = useCallback((node) => {
  //   if (node !== null) {
  //     console.log("in cb with node", node);
  //     debugger;
  //     const height = node.getBoundingClientRect().height;
  //     console.log(height);
  //     setHeight(height);
  //   }
  // }, []);
  // const ref = useRef();

  // useLayoutEffect(() => {}, [ref.current]);

  const [height, setHeight] = useState(0);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);
  console.log(height);

  return (
    <div
      css={`
        // ${!show && "visibility: hidden;"}
      `}
      ref={measuredRef}
    >
      {children}
    </div>
  );
}

function PaginationWrapper({ items, renderItem }) {
  const [itemsToShow, setItemsToShow] = useState([]);
  const [show, setShow] = useState(true);

  const [height, setHeight] = useState(0);
  const maxHeight = "500";

  useEffect(() => {
    const isTooLarge = height > maxHeight;
    if (isTooLarge) {
      if (!show) setShow(true);
    } else {
      if (itemsToShow.length === 0) {
        setItemsToShow(items.slice(0, 5));
      }
      // setItemsToShow(items.slice(0, itemsToShow.length + 1));
    }
  });

  return (
    <HeightWrapper setHeight={setHeight} show={show}>
      {itemsToShow.map((item, index) => renderItem(item, index))}
    </HeightWrapper>
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
