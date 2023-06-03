import { useEffect, useState } from "react";
import "styled-components/macro";

import { ActionButton, ExternalLink } from "./components";

function dictUrl(query: string) {
  return `https://dsal.uchicago.edu/cgi-bin/app/hayyim_query.py?qs=${query}&matchtype=exact&searchhws=yes`;
}

function steingass(query: string) {
  return `https://dsal.uchicago.edu/cgi-bin/app/steingass_query.py?qs=${query}&matchtype=exact&searchhws=yes`;
}

function forvoUrl(query: string) {
  return `https://forvo.com/search/${query}/fa/`;
}

export default function SelectedWordPane({
  selectedWord = "",
  saveWord,
}: {
  selectedWord: string;
  saveWord: (word: string) => void;
}) {
  // The selected word in the text might not be the same as the lexical form that we should use for dictionary definitions and saving.
  // For example, there might be grammatical suffixes on the word.
  // So we allow the user to edit the selected word.
  const [editedWord, setEditedWord] = useState(selectedWord);

  const dictIframeSrc = dictUrl(editedWord);
  const pronounciationIframeSrc = forvoUrl(editedWord);
  const steingassSrc = steingass(editedWord);

  useEffect(() => {
    // Reset the local word state to selectedWord whenever a new word is selected.
    setEditedWord(selectedWord);
  }, [selectedWord]);

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        flex-basis: 20%;
        flex-shrink: 0;
      `}
    >
      {!selectedWord && <div>Click a word to select it</div>}
      {selectedWord && (
        <>
          <div>Currently selected word: {selectedWord}</div>{" "}
          <div>
            <input
              type="text"
              value={editedWord}
              onChange={(e) => setEditedWord(e.target.value)}
            />
          </div>
          <div>
            <ActionButton onClick={() => saveWord(editedWord)}>
              Save word
            </ActionButton>
          </div>
          <div
            css={`
              display: flex;
              gap: 10px;
            `}
          >
            <ExternalLink href={dictIframeSrc}>Hayyim</ExternalLink>
            <ExternalLink href={steingassSrc}>Steingass</ExternalLink>
            <ExternalLink href={pronounciationIframeSrc}>Forvo</ExternalLink>
          </div>
          {/* TODO: show iframes */}
          {/* <iframe src={dictIframeSrc} /> */}
          {/* <iframe src={pronounciationIframeSrc} /> */}
        </>
      )}
    </div>
  );
}
