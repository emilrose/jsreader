import "styled-components/macro";

import { Button } from "./components";

export enum Page {
  library = "Library",
  words = "Words",
}

function NavButton({
  page,
  selectPage,
  isSelected,
}: {
  page: Page;
  selectPage: (page: Page) => void;
  isSelected: boolean;
}) {
  return (
    <Button
      css={`
        ${isSelected && "text-decoration: underline"}
        color: black;
        background-color: white;
      `}
      onClick={() => selectPage(page)}
    >
      {page}
    </Button>
  );
}

export default function NavBar({
  toggleSidePane,
  selectPage,
  currentPage,
}: {
  toggleSidePane: () => void;
  selectPage: (page: Page) => void;
  currentPage: Page;
}) {
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
          page={Page.library}
          isSelected={currentPage === Page.library}
          selectPage={selectPage}
        />
        <NavButton
          page={Page.words}
          isSelected={currentPage === Page.words}
          selectPage={selectPage}
        />
      </div>
      {currentPage === Page.library && (
        <Button onClick={toggleSidePane}>Toggle side pane</Button>
      )}
    </div>
  );
}
