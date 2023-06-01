import "styled-components/macro";

export default function SavedWords({ savedWords }) {
  return (
    <div
      css={`
        display: flex;
        flex-grow: 1;
      `}
    >
      <div
        css={`
          flex-grow: 1;
        `}
      >
        Saved words:
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        `}
      >
        {savedWords.map((word) => (
          <div key={word}>
            <b>{word}</b>: definition
          </div>
        ))}
      </div>
    </div>
  );
}
