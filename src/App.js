import "./App.css";
import { useState } from "react";
import styled from "styled-components";

import "styled-components/macro";

/* 
TODO:
- multi page view
- options for dict url
- view saved words and definitions
*/

const TEXT =
  "If you've previously installed create-react-app globally via npm install -g create-react-app, we recommend you uninstall the package using npm uninstall -g create-react-app or yarn global remove create-react-app to ensure that npx always uses the latest version.";

const PAGES = {
  library: "Library",
  words: "Words",
};

function dictUrl(query) {
  return `https://dsal.uchicago.edu/cgi-bin/app/hayyim_query.py?qs=${query}&matchtype=exact&searchhws=yes`;
}

const StyledButton = styled.div`
  :hover {
    cursor: pointer;
    background: ${({ backgroundColor }) => backgroundColor || "lightgrey"};
  }
`;

function Button(props) {
  return <StyledButton role="button" {...props} />;
}

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.library);

  function selectPage(page) {
    setCurrentPage(page);
  }

  const [showPane, setShowPane] = useState(false);

  function toggleSidePane() {
    setShowPane((showPane) => !showPane);
  }

  const [savedWords, setSavedWords] = useState([]);

  function saveViewedWord(newWord) {
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
        <Reader showPane={showPane} saveViewedWord={saveViewedWord} />
      )}
      {currentPage === PAGES.words && <SavedWords savedWords={savedWords} />}
    </div>
  );
}

function TopBar({ toggleSidePane, selectPage, currentPage }) {
  return (
    <div
      css={`
        display: flex;
        justify-content: flex-end;
        background: darkgrey;
        padding: 10px;
        margin-bottom: 10px;
      `}
    >
      <Button onClick={() => selectPage(PAGES.library)}>{PAGES.library}</Button>
      <Button onClick={() => selectPage(PAGES.words)}>{PAGES.words}</Button>
      {currentPage === PAGES.library && (
        <Button onClick={toggleSidePane}>X</Button>
      )}
    </div>
  );
}

function Reader({ showPane, saveViewedWord }) {
  const words = TEXT.split(" ");

  const [selectedWordIndex, setSelectedWordIndex] = useState(-1);

  function selectWord(word, i) {
    saveViewedWord(word);
    setSelectedWordIndex(i);
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
        {words.map((word, i) => (
          <Button
            onClick={() => selectWord(word, i)}
            css={`
              margin: 1px 5px;
            `}
          >
            {word}
          </Button>
        ))}
      </div>
      {showPane && <SelectedWordPane selectedWord={words[selectedWordIndex]} />}
    </div>
  );
}

function SavedWords({ savedWords }) {
  return (
    <div
      css={`
        display: flex;
        flex: 1 0 100%;
      `}
    >
      <div>Saved words:</div>
      <div
        css={`
          display: flex;
          flex-direction: column;
        `}
      >
        {savedWords.map((word) => (
          <div>
            <b>{word}</b>: definition
          </div>
        ))}
      </div>
    </div>
  );
}

function SelectedWordPane({ selectedWord }) {
  const iframeSrc = dictUrl(selectedWord);

  return (
    <div
      css={`
        flex: 1 1 0;
      `}
    >
      {!selectedWord && <div>No word selected</div>}
      {selectedWord && <div>Currently selected word: {selectedWord}</div>}
      {/* <iframe src={iframeSrc} /> */}
    </div>
  );
}

export default App;
