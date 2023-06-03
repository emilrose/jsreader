import { useState, useMemo } from "react";
import "styled-components/macro";

import { TEXT } from "./constants";
import SelectedWordPane from "./SelectedWordPane";
import PaginationWrapper from "./PaginationWrapper";
import Paragraph, { ParagraphWrapperComponent } from "./Paragraph";

type WordState = [string, number, number];
const initialSelectedWordState: WordState = ["", -1, -1];
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
  ] = useState<WordState>(initialSelectedWordState);

  function selectWord(word: string, wordIndex: number, paragraphIndex: number) {
    setSelectedWord([word, wordIndex, paragraphIndex]);
  }

  function onPagination() {
    setSelectedWord(initialSelectedWordState);
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
      `}
    >
      <div
        // TODO: detect RTL
        css={`
          display: flex;
          flex-direction: column;
          direction: rtl;
          padding: 0 1rem;
        `}
      >
        <PaginationWrapper
          items={paragraphs}
          maxHeight={500}
          onPagination={onPagination}
        >
          {ParagraphWrapper}
        </PaginationWrapper>
      </div>
      {showPane && (
        <SelectedWordPane selectedWord={selectedWord} saveWord={saveWord} />
      )}
    </div>
  );
}
