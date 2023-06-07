import "styled-components/macro";

import { Button } from "./components";

const punctuationRegex = /[،;.,]$/;

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
      css={`
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
        margin: 0.05rem 0.1rem;
      `}
    >
      <Button
        onClick={() => selectWord(cleanedUpWord)}
        css={`
          border: 0.1em solid white;
          border-radius: 0.5em;
          padding: 0.1em;
          ${selected &&
          "border: 1px solid hsla(14, 56%, 30%, 1); background-color: hsla(14, 56%, 95%, 1);"}
        `}
      >
        {cleanedUpWord}
      </Button>
      <span>{punctuationAfterWord}</span>
    </span>
  );
}
