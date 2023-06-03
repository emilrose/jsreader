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

const BaseButton = styled.button`
  cursor: pointer;
  :disabled {
    pointer-events: none;
  }
  :hover {
    filter: brightness(0.85);
  }
  border-radius: 0.6em;
  background-color: inherit;
`;

export function Button(props: ComponentPropsWithoutRef<"button">) {
  return <BaseButton {...props} />;
}

interface ActionButtonProps extends ComponentPropsWithoutRef<"button"> {
  showConfirmation?: boolean;
}

export const ActionButton = styled(Button)`
  background-color: lightgrey;
  padding: 0.2rem 1rem;
  border: 1px solid black;
  border-radius: 0.5em;
  padding: 0 5px;
`;
