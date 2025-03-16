import styled from "styled-components";

export const HeaderStyle = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  .logo {
    flex-shrink: 0;
  }

  .desktop {
    display: none;
  }

  .mobile-header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .mobile-menu {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .search-container {
    flex-grow: 1;
    margin-left: 1rem;
  }

  @media (min-width: 768px) {
    padding: 1rem 2rem;

    .mobile-header-right {
      display: none;
    }

    .mobile-menu, .search-container {
      display: none;
    }

    .desktop {
      display: flex;
    }

    .desktop-nav-links {
      display: flex;
      gap: 2rem;
      margin-left: 2rem;
    }

    .icons-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
`; 