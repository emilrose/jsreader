import "styled-components/macro";

import { Button } from "./components";
import { punctuationRegex } from "./constants";

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
        <Word
          word={word}
          selected={
            selectedWordIndex === i && selectedParagraphIndex === paragraphIndex
          }
          selectWord={(w) => selectWord(w, i, paragraphIndex)}
          key={`${word}-${i}`}
        />
      ))}
    </div>
  );
}

function Word({
  word,
  selectWord,
  selected,
}: {
  word: string;
  selectWord: (word: string) => void;
  selected: boolean;
}) {
  const punctuationAfterWord = word.match(punctuationRegex)?.join(",");
  const cleanedUpWord = word.replace(punctuationRegex, "");

  return (
    <span
      css={`
        margin: 1px 5px;
      `}
    >
      <Button
        onClick={() => selectWord(cleanedUpWord)}
        css={`
          ${selected && "background-color: red !important; "}
        `}
      >
        {cleanedUpWord}
      </Button>
      <span>{punctuationAfterWord}</span>
    </span>
  );
}
