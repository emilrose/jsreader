import { useState } from "react";
import "styled-components/macro";
import type {} from "styled-components/cssprop";

import { Page } from "./constants";
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
- convert most CSS prop UI to styled components

TODO overall things to add:
- handle scroll size
- calculate maxHeight based on actual space
- cut long paragraphs off partway (?)
- mobile UI
*/

function App() {
  const [currentPage, setCurrentPage] = useState(Page.library);

  function selectPage(page: Page) {
    setCurrentPage(page);
  }

  // Default to always showing
  const [showPane, setShowPane] = useState(true);

  function toggleSidePane() {
    setShowPane((showPane) => !showPane);
  }

  const [savedWords, setSavedWords] = useState<string[]>([]);

  function saveWord(newWord: string) {
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
      {currentPage === Page.library && (
        <Reader showPane={showPane} saveWord={saveWord} />
      )}
      {currentPage === Page.words && <SavedWords savedWords={savedWords} />}
    </div>
  );
}

export default App;
