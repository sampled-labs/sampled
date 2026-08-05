"use client";
import "./project-ui.css";

import AnimatedH1 from "../AnimatedTypo/AnimatedH1";
import ParallaxImage from "./ParallaxImage";
import AnimatedCopy from "../AnimatedTypo/AnimatedCopy";
import { Link } from "react-router-dom";

const ProjectHero = () => {
  return (
    <div className=" text-[#bac4b8] bg-[#1a1a1a]">
      <section className="project-hero">
        <div className="col">
          <div className="project-hero-img">
            <div className="project-hero-img-wrapper grayscale-80">
              <ParallaxImage
                src="/assets/landing/image-1.jpg"
                alt=""
                speed={0.2}
              />
            </div>
          </div>
        </div>
        <div className="col  md:pt-0 pt-40">
          <div className="container">
            <div className="project-page-title">
              <AnimatedH1 delay={1}>Music IP Meets Blockchain</AnimatedH1>
            </div>
            <div className="row">
              <div className="sub-col">
                <AnimatedCopy delay={1.125} animateOnScroll={false}>
                  Platform
                </AnimatedCopy>
                <AnimatedCopy
                  delay={1.25}
                  tag="h3"
                  animateOnScroll={false}
                  className="font-pixter text-primary! text-lg h3"
                >
                  Sampled
                </AnimatedCopy>
              </div>
              <div className="sub-col">
                <AnimatedCopy delay={1.125} animateOnScroll={false}>
                  Built On
                </AnimatedCopy>
                <AnimatedCopy
                  delay={1.25}
                  tag="h3"
                  className="h3"
                  animateOnScroll={false}
                >
                  Stellar Blockchain
                </AnimatedCopy>
              </div>
            </div>
            <div className="row">
              <div className="sub-col"></div>
              <div className="sub-col">
                <AnimatedCopy delay={1.5}>
                  Register your music as IP assets, define licensing terms, and
                  receive instant royalty payments with 5-second finality.
                </AnimatedCopy>
                <div className="relative">
                  <Link to={"/explore"}>
                    <div className="mt-5 md:mt-7 relative cursor-pointer inline-block">
                      <div className="absolute top-0 left-0 h-[50px] w-[50px] rounded-full bg-primary"></div>
                      <div className="w-[200px] h-[50px] bg-primary inline-flex items-center justify-center text-black font-medium rounded-full ml-[40px]">
                        Explore the platform
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative z-[10] flex items-end justify-end">
              <p>(Scroll down)</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectHero;
