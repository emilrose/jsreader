import "styled-components/macro";

import { Button } from "./components";

export interface ParagraphWrapperComponent {
  ({ item, index }: { item: string; index: number }): JSX.Element;
}

export default function Paragraph({
  paragraphText,
  paragraphIndex,
  selectWord,
  selectedWordIndex,
  selectedParagraphIndex,
}: {
  paragraphText: string;
  paragraphIndex: number;
  selectWord: (word: string, index: number, paragraphIndex: number) => void;
  selectedWordIndex: number;
  selectedParagraphIndex: number;
}) {
  const words = paragraphText.split(" ");

  return (
    <div
      // TODO: detect when to set direction RTL
      css={`
        direction: rtl;
        margin-bottom: 0.75em;
        width: 100%;
      `}
    >
      {words.map((word, i) => (
        <Button
          onClick={() => selectWord(word, i, paragraphIndex)}
          css={`
            margin: 1px 5px;
            ${selectedWordIndex === i &&
            selectedParagraphIndex === paragraphIndex &&
            "background-color: red !important; "}
          `}
          key={`${word}-${i}`}
        >
          {word}
        </Button>
      ))}
    </div>
  );
}
