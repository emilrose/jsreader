import { useEffect, useState } from "react";

export interface Text {
  title: string;
  content: string;
}

export enum APICallStatus {
  loading = "loading",
  success = "success",
  error = "error",
}

export function useGetText(): [Text, APICallStatus] {
  const [text, setText] = useState<Text>({ title: "", content: "" });
  const [textStatus, setTextStatus] = useState(APICallStatus.loading);

  // TODO: add logic to pick between texts
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/reader/texts/");
        const texts = await response.json();
        const text = texts[0];

        setText({ title: text.title, content: text.content });
        setTextStatus(APICallStatus.success);
      } catch (e) {
        setTextStatus(APICallStatus.error);
      }
    })();
  }, []);

  return [text, textStatus];
}
