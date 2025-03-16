import { ActualPaddedSectionStyle } from "@/styles/HomepageStyles/Section";
import { FunctionComponent } from "react";
import SectionHead from "../SectionHead/SectionHead";
import Link from "next/link";
import { SocialLinkStyle } from "@/styles/LinkStyles/Link";
import { ColorInstagram, ColorTwitter } from "../Icons/Icons";
import { SocialsCompStyles } from "@/styles/AboutpageStyles/Aboutpage";
import { FaXTwitter } from "react-icons/fa6";

const SocialsComp: FunctionComponent = () => {
  return (
    <SocialsCompStyles>
      <ActualPaddedSectionStyle>
        <SectionHead
          bigtext="Follow Us"
          smalltext="You can also reach out to us via our social media pages."
        />
        <div className="s-media">
          <div className="pad">
            <Link href={"https://www.instagram.com/jamescryptog/?hl=en"}>
              <div className="a">
                <div className="a-link">
                  <ColorInstagram />
                  <SocialLinkStyle color="var(--grey-500, #525252)">jamescryptoguru</SocialLinkStyle>
                </div>
              </div>
            </Link>
          </div>
          <div className="pad">
            <Link href={"https://twitter.com/jamescryptoguru"}>
              <div className="a">
                <div className="a-link">
                <FaXTwitter />

                  <SocialLinkStyle color="var(--grey-500, #525252)">James Cryptoguru</SocialLinkStyle>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </ActualPaddedSectionStyle>
    </SocialsCompStyles>
  );
};

export default SocialsComp;
