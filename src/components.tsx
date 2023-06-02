import { useState, ReactNode, ComponentPropsWithoutRef } from "react";
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

const StyledButton = styled.div`
  :hover {
    cursor: pointer;
    background-color: slategrey;
  }
`;

interface ButtonProps extends ComponentPropsWithoutRef<"div"> {
  disabled?: boolean;
}
export function Button({ disabled, onClick, ...rest }: ButtonProps) {
  return (
    <StyledButton
      role="button"
      onClick={disabled ? () => {} : onClick}
      {...rest}
    />
  );
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
