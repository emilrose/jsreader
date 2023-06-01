import {
  useEffect,
  useState,
  useMemo,
  useLayoutEffect,
  useRef,
  ReactNode,
} from "react";
import "styled-components/macro";

import { TEXT } from "./constants";
import { Button } from "./components";
import SelectedWordPane from "./SelectedWordPane";

interface ParagraphWrapperComponent {
  ({ item, index }: { item: string; index: number }): JSX.Element;
}
export default function Reader({
  showPane,
  saveWord,
}: {
  showPane: boolean;
  saveWord: (word: string) => void;
}) {
  const paragraphs = useMemo(
    () => TEXT.split("\n").filter((p) => p.trim() !== ""),
    []
  );

  const [
    [selectedWord, selectedWordIndex, selectedParagraphIndex],
    setSelectedWord,
  ] = useState(["", -1, -1]);

  function selectWord(word: string, wordIndex: number, paragraphIndex: number) {
    setSelectedWord([word, wordIndex, paragraphIndex]);
  }

  const ParagraphWrapper: ParagraphWrapperComponent = ({ item, index }) => {
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
  };

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
        <PaginationWrapper items={paragraphs} maxHeight={500}>
          {ParagraphWrapper}
        </PaginationWrapper>
      </div>
      {showPane && (
        <SelectedWordPane selectedWord={selectedWord} saveWord={saveWord} />
      )}
    </div>
  );
}

/* 
New approach based on looking at react-virtualized:
- render a bunch of nodes first based on min height, then unrender them 
- then once all nodes are rendered, look at heights and remove the overflow ones

- but do I even need this? it's just an optimization
- i guess worth if i cache heights of the overflow ones? then i can use the heights the next time
*/

function PaginationWrapper({
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

  const [[startRange, endRange], setRange] = useState([0, 0]);
  // console.log(`range ${[startRange, endRange]}`);

  function pageForward() {
    setRange([endRange, endRange + 5]);
  }

  useEffect(() => {
    let remainingSpace = maxHeight;
    let index = startRange;
    while (remainingSpace >= 0) {
      const minNodeHeight = 20;

      remainingSpace -= minNodeHeight;
      index += 1;
    }
    setRange([startRange, index - 1]);
    // console.log("firstrange:", [startRange, index - 1]);
  }, [startRange, maxHeight]);

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
      // console.log(
      //   `change range ${[startRange, endRange]} to ${[startRange, index - 1]}`
      // );

      setRange([startRange, index - 1]);
    }
  }, [endRange, itemHeight, maxHeight, startRange]);

  const itemsToShow = items.slice(startRange, endRange);

  return (
    <>
      <button onClick={pageForward}>page forward</button>
      <div
        css={`
          display: flex;
          flex-flow: column wrap;
          overflow: hidden;
          height: ${maxHeight}px;
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

function Paragraph({
  paragraphText,
  paragraphIndex,
  selectWord,
  selectedWordIndex,
  selectedParagraphIndex,
}: {
  paragraphText: string;
  paragraphIndex: number;
  selectWord: (word: string, index: number, paragraphIndex: number) => void;
  selectedWordIndex: number;
  selectedParagraphIndex: number;
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
