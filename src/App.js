import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import "styled-components/macro";

import TEXT from "./text";

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

const StyledButton = styled.div`
  :hover {
    cursor: pointer;
    background-color: slategrey;
  }
`;

function Button(props) {
  return <StyledButton role="button" {...props} />;
}

function ActionButton(props) {
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
      {currentPage === PAGES.words && <SavedWords savedWords={savedWords} />}{" "}
    </div>
  );
}

function NavButton({ currentPage, page, selectPage }) {
  return (
    <Button
      css={`
        color: white;
        ${currentPage === page && "text-decoration: underline"}
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
          currentPage={currentPage}
          selectPage={selectPage}
        />
        <NavButton
          page={PAGES.words}
          currentPage={currentPage}
          selectPage={selectPage}
        />
      </div>
      {/* {currentPage === PAGES.library && (
        <Button onClick={toggleSidePane}>Toggle side pane</Button>
      )} */}
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
        <Text textArray={["asd"]} />
        {paragraphs.map((paragraphText, paragraphIndex) => (
          <Paragraph
            paragraphText={paragraphText}
            paragraphIndex={paragraphIndex}
            selectWord={selectWord}
            selectedParagraphIndex={selectedParagraphIndex}
            selectedWordIndex={selectedWordIndex}
          />
        ))}
      </div>
      {showPane && (
        <SelectedWordPane selectedWord={selectedWord} saveWord={saveWord} />
      )}
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

function Text({ textArray }) {
  // const refContainer = useRef(null);

  // for (let text of textArray) {
  //   const element = <span ref={refContainer}>{text}</span>;
  //   console.log(refContainer.current.clientHeight);
  // }
  return <></>;
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

function ExternalLink({ href, children }) {
  return (
    <a target="_blank" rel="noreferrer" href={href}>
      {children}
    </a>
  );
}
export default App;
