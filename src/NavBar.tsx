import "styled-components/macro";

import { Button } from "./components";
import { PAGES } from "./constants";

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

export default function NavBar({ toggleSidePane, selectPage, currentPage }) {
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
