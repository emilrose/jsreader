import { useState } from "react";
import "styled-components/macro";
import type {} from "styled-components/cssprop";

import NavBar, { Page } from "./NavBar";
import Reader from "./Reader";
import SavedWords from "./SavedWords";
import { useGetText, APICallStatus } from "./api";

/* 
TODO features:
- multi page view with routing
- options for dict url
- view saved words and definitions
- export words

TODO code:
- convert most CSS prop UI to styled components

TODO overall things to add:
- reflow when size of screen changes
- calculate maxHeight based on actual space
- mobile UI
- cut long paragraphs off partway (?)
*/

function App() {
  const [text, textStatus] = useGetText();

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
  // console.log(savedWords);
  function saveWord(newWord: string) {
    console.log(newWord);
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
        <>
          {textStatus === APICallStatus.loading && <div>Loading text...</div>}
          {textStatus === APICallStatus.error && (
            <div>Failed to load text from API.</div>
          )}
          {textStatus === APICallStatus.success && (
            <Reader showPane={showPane} saveWord={saveWord} text={text} />
          )}
        </>
      )}
      {currentPage === Page.words && <SavedWords savedWords={savedWords} />}
    </div>
  );
}

export default App;
