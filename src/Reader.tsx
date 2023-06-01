import { useState, useMemo } from "react";
import "styled-components/macro";

import { TEXT } from "./constants";
import SelectedWordPane from "./SelectedWordPane";
import PaginationWrapper from "./PaginationWrapper";
import Paragraph, { ParagraphWrapperComponent } from "./Paragraph";

export default function Reader({
  showPane,
  saveWord,
}: {
  showPane: boolean;
  saveWord: (word: string) => void;
}) {
  const paragraphs = useMemo(
    () => TEXT.split("\n").filter((p) => p.trim() !== ""),
    []
  );

  const [
    [selectedWord, selectedWordIndex, selectedParagraphIndex],
    setSelectedWord,
  ] = useState(["", -1, -1]);

  function selectWord(word: string, wordIndex: number, paragraphIndex: number) {
    setSelectedWord([word, wordIndex, paragraphIndex]);
  }

  const ParagraphWrapper: ParagraphWrapperComponent = ({ item, index }) => {
    return (
      <Paragraph
        key={`${item.slice(0, 10)}-${index}`}
        paragraphText={item}
        paragraphIndex={index}
        selectWord={selectWord}
        selectedParagraphIndex={selectedParagraphIndex}
        selectedWordIndex={selectedWordIndex}
      />
    );
  };

  return (
    <div
      css={`
        display: flex;
        gap: 10px;
      `}
    >
      <div>
        <PaginationWrapper items={paragraphs} maxHeight={500}>
          {ParagraphWrapper}
        </PaginationWrapper>
      </div>
      {showPane && (
        <SelectedWordPane selectedWord={selectedWord} saveWord={saveWord} />
      )}
    </div>
  );
}
