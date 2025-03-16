import styled from "styled-components";

export const SearchBarStyle = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;

  input {
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    outline: none;
    transition: border-color 0.2s;

    &:focus {
      border-color: #4a5568;
    }

    &::placeholder {
      color: #a0aec0;
    }
  }

  .search-icon {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #718096;
    pointer-events: none;
  }

  @media (max-width: 767px) {
    max-width: none;
    margin: 0 0.5rem;
  }
`; 