import { css, styled } from "styled-components";
import { SearchStyle } from "../HeaderStyles/Search";
import { IContactBtn } from "../ContactpageStyles/Contact";

export const HeroSearchStyles = styled(SearchStyle)`
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  input {
    border-radius: 8px;
    width: 100%;
    height: 2.8rem;
    padding: 1.2rem 2.2rem;
    color: var(--grey-500, #525252);
    position: relative;
  }
  input:focus {
    border: 1px solid var(--grey-500, #525252);
  }
  gap: 0.5rem;
  // this error tag is strictly for mobile
  .error p {
    text-align: center;
  }
  @media screen and (min-width: 490px) {
    flex-direction: row;
    align-items: center;
    gap: 0rem;
    input {
      width: 14rem;
      border-radius: 8px 0px 0px 8px;
      height: 2.85rem;
    }
    margin-top: 1rem;
  }
  @media screen and (min-width: 490px) and (max-width: 728px) {
    position: relative;
    justify-content: center;
    input{
      height: 3rem;
    }
    .mobile{
      display: none;
    }
    .desktop{
      display: block;
    }
    gap: 0rem;
  }
  @media screen and (min-width: 768px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0rem;
    input {
      width: 14rem;
      border-radius: 8px 0px 0px 8px;
      height: 2.85rem;
    }
    margin-top: 1rem;
    .error p {
      text-align: left;
    }
  }
  @media screen and (min-width: 810px) {
    input {
      width: 15rem;
    }
  }
  @media screen and (min-width: 998px) {
    input {
      width: 20rem;
      height: 3rem;
    }
    margin-top: 2.5rem;
  }
`;

export const FormButton = styled.button`
  background: var(--purple, #D4A64E);
  
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: var(--off-white, #fefefe);
  font-size: 1rem;
  font-family: DM Sans;
  font-weight: 700;
  line-height: 1.5rem;
  width: 100%;
  &:hover {
    background: var(--purple-600,  #111);
  }
  @media screen and (min-width: 490px) and (max-width: 768px) {
    width: auto;
  }
  @media screen and (min-width: 490px) {
    width: auto;
    border-radius: 0px 8px 8px 0px;
  }
`;

export const SubscribeButton = styled(FormButton)<IContactBtn>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$submitted ? "#111" : "var(--purple, #D4A64E)"};
  gap: 0.5rem;
  ${(props) =>
    props.$submitted &&
    css`
      &:hover {
        background: #111;
      }
    `}
`;

export const PaymentButtonStyles = styled(FormButton)`
      border-radius : 0.5rem;
`