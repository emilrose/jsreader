import { useEffect, useState } from "react";
import "styled-components/macro";
import type {} from "styled-components/cssprop";

import NavBar, { Page } from "./NavBar";
import Reader from "./Reader";
import SavedWords from "./SavedWords";
import { log } from "console";

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
  // TODO: tmp code to test server
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/reader/hello");
        const text = await response.text();
        console.log(text);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

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
        <Reader showPane={showPane} saveWord={saveWord} />
      )}
      {currentPage === Page.words && <SavedWords savedWords={savedWords} />}
    </div>
  );
}

export default App;
