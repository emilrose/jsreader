import {
  useState,
  useLayoutEffect,
  useRef,
  ReactNode,
  ComponentPropsWithoutRef,
} from "react";
import styled from "styled-components";
import "styled-components/macro";

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a target="_blank" rel="noreferrer" href={href}>
      {children}
    </a>
  );
}

export function Text({ textArray }: { textArray: string }) {
  // TODO: add measured stuff here
  // const refContainer = useRef(null);

  // for (let text of textArray) {
  //   const element = <span ref={refContainer}>{text}</span>;
  //   console.log(refContainer.current.clientHeight);
  // }
  return <></>;
}

const StyledButton = styled.div`
  :hover {
    cursor: pointer;
    background-color: slategrey;
  }
`;

export function Button(props: ComponentPropsWithoutRef<"div">) {
  return <StyledButton role="button" {...props} />;
}

interface ActionButtonProps extends ComponentPropsWithoutRef<"input"> {
  showConfirmation?: boolean;
}

export function ActionButton({
  showConfirmation,
  onClick,
  ...rest
}: ActionButtonProps) {
  // TODO: improve onclick UI here

  const [confirm, setConfirm] = useState(false);

  let wrappedOnClick = onClick;
  if (showConfirmation) {
    wrappedOnClick = () => {
      setConfirm(true);
      setTimeout(() => {
        setConfirm(false);
      }, 2000);
    };
  }
  return (
    <Button
      css={`
        background-color: lightgrey;
        margin: 0 0.5em;
        border: 1px solid black;
        border-radius: 0.5em;
        padding: 0 5px;
        ${confirm && "background-color: lightgreen;"}
      `}
      {...rest}
      onClick={wrappedOnClick}
    />
  );
}
