import "styled-components/macro";

import { Button } from "./components";
import { Page } from "./constants";

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
        color: white;
        ${isSelected && "text-decoration: underline"}
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
