import { DesktopMobile, HeroStyles, TabOnly } from "@/styles/HeroStyles/Hero";
import React, { FunctionComponent } from "react";
import Image from "next/image";
import HeroSearch from "./HeroSearch";
import Link from "next/link";
import { LinkStyle } from "@/styles/LinkStyles/Link";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const Hero: FunctionComponent = () => {
  const [text] = useTypewriter({
    words: ["Trading", "Investing", "Business"],
    loop: true,
    typeSpeed: 100,
    delaySpeed: 4800,
  });
  return (
    <DesktopMobile>
      <HeroStyles>
        <div className="hero-text">
          <h1>
            Let’s get you Start  <br />
            your career in <strong>{text} <span><Cursor cursorColor="#D4A64E" /></span></strong>
          </h1>
          <p className="hero-p">
            JCG is an inclusive E-Learning platform that specializes in helping
            people kickstart their journey in the trade industry
          </p>
          <HeroSearch />
          <div className="alink">
            <Link href={"/courses"}>
              <LinkStyle color="var(--purple, #D4A64E)">
                View Our Courses
              </LinkStyle>
            </Link>
          </div>
        </div>
        <div className="hero-img">
          <TabOnly>
            <Image
              alt="hero img"
              src="/assets/James.png"
              width={400}
              height={300}
              className="desktop w-[200px] h-[200px]"
            />
            <Image
              alt="hero img"
              src="/assets/James.png"
              width={400}
              height={300}
              className="tab"
              sizes="100%"
            />
            <Image
              alt="hero img"
              src="/assets/James.png"
              width={0}
              height={0}
              sizes="100vw"
              priority={true}               
              className="mobile mobile-img"
            />
          </TabOnly>
        </div>
      </HeroStyles>
    </DesktopMobile>
  );
};

export default Hero;
