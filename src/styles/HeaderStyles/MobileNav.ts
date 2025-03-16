import styled from "styled-components";

export const MobileNavStyles = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  z-index: 1000;

  &.open {
    visibility: visible;
    opacity: 1;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  &.open .overlay {
    opacity: 1;
  }

  .sidemenu {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100%;
    background: white;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  &.open .sidemenu {
    left: 0;
  }

  .sidemenu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;

    .close-button {
      font-size: 1.5rem;
      background: none;
      border: none;
      color: #525252;
      cursor: pointer;
      padding: 0.5rem;
      transition: color 0.2s ease;
      margin-right: -0.5rem;

      &:hover {
        color: #000;
      }
    }
  }

  .sidemenu-links {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    a {
      color: #4b5563;
      font-size: 1rem;
      font-weight: 500;
      transition: color 0.2s;

      &:hover {
        color: #1f2937;
      }

      &.active {
        color: #e39c44;
      }
    }
  }

  .user-profile {
    padding: 1.5rem;
    border-top: 1px solid #e5e7eb;
    margin: 0 -1.5rem;
    background: #f9fafb;
  }

  .auth-section {
    margin-top: auto;
    padding-top: 1.5rem;
    border-top: 1px solid #eee;

    .user-button-wrapper {
      display: flex;
      justify-content: flex-start;
    }

    .subscribe-button {
      width: 100%;
      padding: 0.875rem;
      background: #e39c44;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      transition: background 0.2s ease;

      &:hover {
        background: #d38933;
      }
    }
  }

  @media (min-width: 768px) {
    display: none;
  }
`; 