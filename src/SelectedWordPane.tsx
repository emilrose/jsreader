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
  // There are three versions of the word:
  // - selectedWord: the original word as selected in the text
  // - editedWord: the word after a saved edit by the user
  // - temporaryWord: the intermediate version of the word as it's being edited
  // All three forms are initially the same.
  const [editedWord, setEditedWord] = useState(selectedWord);
  const [temporaryWord, setTemporaryWord] = useState(selectedWord);

  const dictIframeSrc = dictUrl(editedWord);
  const pronounciationIframeSrc = forvoUrl(editedWord);
  const steingassSrc = steingass(editedWord);

  useEffect(() => {
    // Reset the local word state to selectedWord whenever a new word is selected.
    setEditedWord(selectedWord);
    setTemporaryWord(selectedWord);
  }, [selectedWord]);

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
      `}
    >
      {!selectedWord && <div>Click a word to select it</div>}
      {selectedWord && (
        <>
          <div>Currently selected word: {editedWord}</div>{" "}
          <div>
            <input
              type="text"
              value={temporaryWord}
              onChange={(e) => setTemporaryWord(e.target.value)}
            />
            <ActionButton onClick={() => setEditedWord(temporaryWord)}>
              Confirm edited word
            </ActionButton>
          </div>
          <div>
            <ActionButton onClick={() => saveWord(editedWord)} showConfirmation>
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
