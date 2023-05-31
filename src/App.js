import { useState } from "react";
import "styled-components/macro";

import { PAGES } from "./constants";
import NavBar from "./NavBar";
import Reader from "./Reader";
import SavedWords from "./SavedWords";

/* 
TODO features:
- multi page view with routing
- options for dict url
- view saved words and definitions
- export words

TODO code:
- convert to TS?
- convert most CSS prop UI to styled components

TODO overall things to add:
- handle scroll size
- calculate maxHeight based on actual space
- cut long paragraphs off partway (?)
- mobile UI
*/

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.library);

  function selectPage(page) {
    setCurrentPage(page);
  }

  // Default to always showing
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
      <NavBar
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

export default App;
