import { FooterPaddedSectionStyle } from "@/styles/HomepageStyles/Section";
import { FooterLinkStyle } from "@/styles/LinkStyles/Link";
import React, { FunctionComponent } from "react";
import Link from "next/link";
import { FooterStyles } from "@/styles/FooterStyles/Footer";
// import { Facebook, FooterLogo, Instagram, Linkedin } from "../Icons/Icons";
// import { FaXTwitter } from "react-icons/fa6";
import {
    FaDiscord,
    FaYoutube,
    FaXTwitter,
    FaInstagram,
    FaPatreon,
    FaTelegram,
  } from "react-icons/fa6";

  import { MdOutlineAlternateEmail } from "react-icons/md";
import { FooterLogo } from "../Icons/Icons";

  export const socialLinks = [
    {
      icon: FaDiscord,
      link: "https://bit.ly/JamesCryptoGuruDiscord",
    },
    {
      icon: FaYoutube,
      link: "https://www.youtube.com/c/JamesCryptoGuru",
    },
    {
      icon: FaXTwitter,
      link: "https://twitter.com/jamyies",
    },
    {
      icon: FaInstagram,
      link: "https://instagram.com/jamescryptoguru?utm_medium=copy_link",
    },
    {
      icon: FaPatreon,
      link: "https://www.patreon.com/James_Crypto_Guru",
    },
    {
      icon: MdOutlineAlternateEmail,
      link: "mailto:contact@jamescryptoguru.com",
    },
    {
      icon: FaTelegram,
      link: "https://t.me/Jamescryptogurualerts",
    },
  ];
  
const Footer: FunctionComponent = () => {
  return (
    <FooterStyles>
      <FooterPaddedSectionStyle>
        <div className="fl">
        <div className="one">
          <div className="icons">
            <Link href={"/"}>
              <FooterLogo />
            </Link>
            <div className="">
            <p className="text-balance text-center  text-white text-lg lg:text-left">
              Activate your Millionaire<br/>
              Mindset with Expert Guidance
            </p>
            <div className=" flex flex-row text-white gap-2 mt-4">
            {socialLinks.map((item, i) => (
              <Link key={i} href={item.link}>
                {<item.icon />}
              </Link>
            ))}
</div>
              
            </div>
          </div>
          <div className="pane">
            {/* <h4>Company</h4> */}
            {/* <div className="links">
              <Link href={"/courses"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  Courses
                </FooterLinkStyle>
              </Link>
              <Link href={"/about"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  About Us
                </FooterLinkStyle>
              </Link>
              <Link href={"/contact"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  Contact Us
                </FooterLinkStyle>
              </Link>
            </div> */}
          </div>
          <div className="pane">
            <h4>Community</h4> 
            <div className="links">
              <Link href={"/courses"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  Courses
                </FooterLinkStyle>
              </Link>
              <Link href={"/about"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  About Us
                </FooterLinkStyle>
              </Link>
              <Link href={"/contact"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  Contact Us
                </FooterLinkStyle>
              </Link>
            </div>
          </div>
          <div className="pane m-b">
             <h4>Platform</h4> 
             <div className="links">
              {/* <Link href={"#"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  Become a Tutor
                </FooterLinkStyle>
              </Link> */}
               <Link href={"#"}>
              <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                Privacy Policy
              </FooterLinkStyle>
            </Link>
            <Link href={"#"}>
              <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                Terms and Conditions
              </FooterLinkStyle>
            </Link>
              <Link href={"#"}>
                <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                  Tutor Help Centre
                </FooterLinkStyle>
              </Link>
            </div> 
          </div>
        </div>
        <div className="two">
          <p>jamescryptoguru All Rights Reserved</p>
          <div className="flat">
            {/* <Link href={"#"}>
              <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                Privacy Policy
              </FooterLinkStyle>
            </Link>
            <Link href={"#"}>
              <FooterLinkStyle color="var(--off-white, #F9F7F7)" hovercolor="#fff">
                Terms and Conditions
              </FooterLinkStyle>
            </Link> */}
          </div>
        </div>
        </div>
      </FooterPaddedSectionStyle>
    </FooterStyles>
  );
};

export default Footer;
// import Image from "next/image";
// import Link from "next/link";
// // import jcgLogo from "@/assets/icons/jcg-logo.svg";
// import {
//   FaDiscord,
//   FaYoutube,
//   FaXTwitter,
//   FaInstagram,
//   FaPatreon,
//   FaTelegram,
// } from "react-icons/fa6";
// import { MdOutlineAlternateEmail } from "react-icons/md";
// // import SubscribeForm from "./SubscribeForm";
// import { IconType } from "react-icons";
// import React from "react";

// export const socialLinks = [
//   {
//     icon: FaDiscord,
//     link: "https://bit.ly/JamesCryptoGuruDiscord",
//   },
//   {
//     icon: FaYoutube,
//     link: "https://www.youtube.com/c/JamesCryptoGuru",
//   },
//   {
//     icon: FaXTwitter,
//     link: "https://twitter.com/jamyies",
//   },
//   {
//     icon: FaInstagram,
//     link: "https://instagram.com/jamescryptoguru?utm_medium=copy_link",
//   },
//   {
//     icon: FaPatreon,
//     link: "https://www.patreon.com/James_Crypto_Guru",
//   },
//   {
//     icon: MdOutlineAlternateEmail,
//     link: "mailto:contact@jamescryptoguru.com",
//   },
//   {
//     icon: FaTelegram,
//     link: "https://t.me/Jamescryptogurualerts",
//   },
// ];

// const footerLinks = [
//   [
//     {
//       title: "About James",
//       link: "#about-james",
//     },
//     {
//       title: "Testimonials",
//       link: "#testimonials",
//     },
//     {
//       title: "Pricing",
//       link: "#pricing",
//     },
//     {
//       title: "Trailer",
//       link: "#trailer",
//     },
//     {
//       title: "Topics",
//       link: "#topics",
//     },
//   ],
//   [
//     {
//       title: "Main Page",
//       link: "https://jamescryptoguru.com",
//     },
//     {
//       title: "FAQ",
//       link: "#faq",
//     },
//     {
//       title: "Privacy Policy",
//       link: "#",
//     },
//     {
//       title: "Terms and Conditions",
//       link: "#",
//     },
//     {
//       title: "Disclaimer",
//       link: "#",
//     },
//   ],
// ];

// const Footer = () => {
//   return (
//     <footer className="mx-auto w-11/12 max-w-screen-2xl bg-primary text-black">
//       <div className="pb-14 pt-28">
//         <div className="flex flex-col items-center justify-center  gap-10 pb-10 lg:flex-row lg:items-stretch lg:justify-between lg:pb-32">
//           <div className="flex max-w-sm flex-col items-center justify-between gap-4 pb-8 lg:max-w-64 lg:items-start lg:justify-normal">
//             {/* <Image src={jcgLogo} alt="JCG logo" /> */}

//             <p className="text-balance text-center text-lg lg:text-left">
//               Activate your Millionaire Mindset with Expert Guidance
//             </p>
//           </div>

//           <div className="space-y-5 ">
//             <h6 className="yellow-gradient-text text-center text-lg font-bold lg:text-left">
//               Navigation
//             </h6>
//             <ul className="flex max-w-sm flex-row flex-wrap justify-center gap-4 font-medium text-footer lg:max-w-full lg:flex-col">
//               {footerLinks[0].map((item, i) => (
//                 <Link key={i} href={item.link}>
//                   {item.title}
//                 </Link>
//               ))}
//             </ul>
//           </div>
//           <div className="space-y-5">
//             <h6 className="yellow-gradient-text text-center text-lg font-bold lg:text-left">
//               For you
//             </h6>
//             <ul className="flex max-w-sm flex-row flex-wrap justify-center gap-4 font-medium text-footer lg:max-w-full lg:flex-col">
//               {footerLinks[1].map((item, i) => (
//                 <Link key={i} href={item.link}>
//                   {item.title}
//                 </Link>
//               ))}
//             </ul>
//           </div>

//           <div className="max-w-xl lg:max-w-2xl ">
//             <div className="flex h-full flex-col justify-between ">
//               <div className=" flex flex-col justify-center gap-5 pt-8 lg:pt-0">
//                 <h6 className="yellow-gradient-text text-center text-lg font-bold lg:text-left">
//                   Subscribe to newsletters
//                 </h6>

//                 {/* <SubscribeForm /> */}

//                 <p className="text-sm text-footer">
//                   or via email:{" "}
//                   <Link
//                     href="mailto:contact@jamescryptoguru.com"
//                     className="text-secondary"
//                   >
//                     contact@jamescryptoguru.com
//                   </Link>
//                 </p>
//               </div>
//               <div className="flex justify-center gap-5 pt-10 text-2xl text-white/50 md:justify-normal lg:pt-0">
//                 {socialLinks.map((item, i) => (
//                   <Link key={i} rel="noopener noreferrer" href={item.link}>
//                     {<item.icon />}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="h-px w-full bg-footer opacity-50" />

//         <div className="py-16 text-center lg:pb-0">
//           <p className="text-sm font-medium text-secondary">
//             &copy; {new Date().getFullYear()} James Crypto Guru. All rights
//             reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;