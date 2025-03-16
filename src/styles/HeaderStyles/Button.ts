import styled from "styled-components";

export const ButtonStyle = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;

  &.primary {
    background-color: #2563eb;
    color: white;
    border: none;

    &:hover {
      background-color: #1d4ed8;
    }
  }

  &.secondary {
    background-color: transparent;
    color: #4b5563;
    border: 1px solid #e5e7eb;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  &.icon-button {
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: #4b5563;

    &:hover {
      color: #1f2937;
      background-color: #f3f4f6;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 767px) {
    font-size: 0.8125rem;
    padding: 0.4375rem 0.875rem;
  }
`; 