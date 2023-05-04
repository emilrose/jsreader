import { useEffect, useState, useMemo, useCallback } from "react";
import "styled-components/macro";

import TEXT from "./text";
import { Button, ActionButton, ExternalLink, Text } from "./components";

/* 
TODO:
- multi page view
- options for dict url
- view saved words and definitions
*/

const PAGES = {
  library: "Library",
  words: "Words",
};

function dictUrl(query) {
  return `https://dsal.uchicago.edu/cgi-bin/app/hayyim_query.py?qs=${query}&matchtype=exact&searchhws=yes`;
}

function steingass(query) {
  return `https://dsal.uchicago.edu/cgi-bin/app/steingass_query.py?qs=${query}&matchtype=exact&searchhws=yes`;
}

function forvoUrl(selectedWord) {
  return `https://forvo.com/search/${selectedWord}/fa/`;
}

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.library);

  function selectPage(page) {
    setCurrentPage(page);
  }

  // Just default to always showing
  const [showPane, setShowPane] = useState(true);

  function toggleSidePane() {
    setShowPane((showPane) => !showPane);
  }

  const [savedWords, setSavedWords] = useState([]);

  function saveWord(newWord) {
    setSavedWords((words) => [...words, newWord]);
  }

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      <TopBar
        selectPage={selectPage}
        toggleSidePane={toggleSidePane}
        currentPage={currentPage}
      />
      {currentPage === PAGES.library && (
        <Reader showPane={showPane} saveWord={saveWord} />
      )}
      {currentPage === PAGES.words && <SavedWords savedWords={savedWords} />}
    </div>
  );
}

function NavButton({ page, selectPage, isSelected }) {
  return (
    <Button
      css={`
        color: white;
        ${isSelected && "text-decoration: underline"}
      `}
      onClick={() => selectPage(page)}
    >
      {page}
    </Button>
  );
}

function TopBar({ toggleSidePane, selectPage, currentPage }) {
  return (
    <div
      css={`
        display: flex;
        justify-content: space-between;
        background: dimgrey;
        padding: 10px;
        margin-bottom: 10px;
      `}
    >
      <div
        css={`
          display: flex;
          gap: 10px;
        `}
      >
        <NavButton
          page={PAGES.library}
          isSelected={currentPage === PAGES.library}
          selectPage={selectPage}
        />
        <NavButton
          page={PAGES.words}
          isSelected={currentPage === PAGES.words}
          selectPage={selectPage}
        />
      </div>
      {currentPage === PAGES.library && (
        <Button onClick={toggleSidePane}>Toggle side pane</Button>
      )}
    </div>
  );
}

function Reader({ showPane, saveWord }) {
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
      <MeasureExample />
      <div
        css={`
          flex: 2 1 0;
          flex-wrap: wrap;
        `}
      >
        <Text textArray={["asd"]} />
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
  console.log(itemsToShow);
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

function MeasureExample() {
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback((node) => {
    if (node !== null) {
      setHeight(node.getBoundingClientRect().height);
    }
  }, []);

  return (
    <>
      <h1 ref={measuredRef}>asd</h1>
      <h2>The above header is {Math.round(height)}px tall</h2>
    </>
  );
}

function SavedWords({ savedWords }) {
  return (
    <div
      css={`
        display: flex;
        flex-grow: 1;
      `}
    >
      <div
        css={`
          flex-grow: 1;
        `}
      >
        Saved words:
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        `}
      >
        {savedWords.map((word) => (
          <div key={word}>
            <b>{word}</b>: definition
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectedWordPane({ selectedWord = "", saveWord }) {
  // The selected word in the text might not be the same as the lexical form that we should use for dictionary definitions and saving.
  // For example, there might be grammatical suffixes on the word.
  // So we allow the user to edit the selected word.
  // There are three versions of the word:
  // - selectedWord: the original word as selected in the text
  // - editedWord: the word after edits by the user
  // - temporaryWord: the intermediate version of the word as it's being edited
  // All three forms are initially the same.
  const [editedWord, setEditedWord] = useState(selectedWord);
  const [temporaryWord, setTemporaryWord] = useState(selectedWord);

  const dictIframeSrc = dictUrl(editedWord);
  const pronounciationIframeSrc = forvoUrl(editedWord);
  const steingassSrc = steingass(editedWord);

  useEffect(() => {
    // Reset the local word state to selectedWord whenever a new word is selected.
    setEditedWord(selectedWord);
    setTemporaryWord(selectedWord);
  }, [selectedWord]);

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      {!selectedWord && <div>Click a word to select it</div>}
      {selectedWord && (
        <>
          <div>Currently selected word: {editedWord}</div>{" "}
          <div>
            <input
              type="text"
              value={temporaryWord}
              onChange={(e) => setTemporaryWord(e.target.value)}
            />
            <ActionButton onClick={() => setEditedWord(temporaryWord)}>
              Confirm edited word
            </ActionButton>
          </div>
          <div>
            <ActionButton onClick={() => saveWord(editedWord)} showConfirmation>
              Save word
            </ActionButton>
          </div>
          <div
            css={`
              display: flex;
              gap: 10px;
            `}
          >
            <ExternalLink href={dictIframeSrc}>Hayyim</ExternalLink>
            <ExternalLink href={steingassSrc}>Steingass</ExternalLink>
            <ExternalLink href={pronounciationIframeSrc}>Forvo</ExternalLink>
          </div>
          {/* <iframe src={dictIframeSrc} /> */}
          {/* <iframe src={pronounciationIframeSrc} /> */}
        </>
      )}
    </div>
  );
}

export default App;
