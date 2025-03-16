import { CtaStyles } from "@/styles/HomepageStyles/Homepage";
import { LinkStyle } from "@/styles/LinkStyles/Link";
import Link from "next/link";
import SectionHead from "../SectionHead/SectionHead";
import { ActualPaddedSectionStyle, CtaPaddedSectionStyle } from "@/styles/HomepageStyles/Section";

const Cta = () => {
  return (
    <CtaPaddedSectionStyle>
      <CtaStyles>
        <ActualPaddedSectionStyle>
          <div className="cta">
            <SectionHead
              bigtext="Start Your Trading Journey Today"
              smalltext="Don’t wait till you’re sure, there’s space for everyone in JCG, Join Us Today"
            />
            <div className="pad">
              <Link href={"/courses"}>
                <div className="a">
                  <LinkStyle color="#fff" >
                    View all Courses
                  </LinkStyle>
                </div>
              </Link>
            </div>
          </div>
          </ActualPaddedSectionStyle>
      </CtaStyles>
      </CtaPaddedSectionStyle>
  );
};

export default Cta;
