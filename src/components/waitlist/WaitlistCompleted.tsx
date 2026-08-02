import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Header } from "../shared/Header";

// Hand-drawn scratchy SVG text component
const ScratchyText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 120 60"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Scratchy "Hey" style text */}
    <text
      x="10"
      y="45"
      className="font-pixter"
      fill="#c3ff49"
      fontSize="42"
      style={{
        fontFamily: "Pixter Display, sans-serif",
        paintOrder: "stroke",
        stroke: "#c3ff49",
        strokeWidth: 1,
      }}
    >
      {text}
    </text>
    {/* Scratch lines */}
    <line x1="5" y1="52" x2="115" y2="52" stroke="#c3ff49" strokeWidth="2" />
    <line
      x1="8"
      y1="56"
      x2="100"
      y2="56"
      stroke="#c3ff49"
      strokeWidth="1.5"
      opacity="0.7"
    />
    <line x1="15" y1="8" x2="25" y2="3" stroke="#c3ff49" strokeWidth="1.5" />
    <line x1="20" y1="5" x2="35" y2="10" stroke="#c3ff49" strokeWidth="1" />
    <line x1="90" y1="15" x2="110" y2="8" stroke="#c3ff49" strokeWidth="1.5" />
  </svg>
);

// Hand-drawn avatar SVG
const HandDrawnAvatar = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hair - scratchy lines */}
    <path
      d="M25 35 Q30 15, 50 12 Q70 10, 78 30"
      stroke="#c3ff49"
      strokeWidth="2.5"
      fill="none"
    />
    <path
      d="M30 25 Q35 8, 45 10"
      stroke="#c3ff49"
      strokeWidth="2"
      fill="none"
    />
    <path d="M55 8 Q65 5, 72 18" stroke="#c3ff49" strokeWidth="2" fill="none" />
    <path
      d="M40 12 Q50 3, 60 10"
      stroke="#c3ff49"
      strokeWidth="1.5"
      fill="none"
    />
    {/* More hair strokes */}
    <line x1="28" y1="30" x2="22" y2="20" stroke="#c3ff49" strokeWidth="2" />
    <line x1="35" y1="18" x2="32" y2="8" stroke="#c3ff49" strokeWidth="1.5" />
    <line x1="68" y1="15" x2="75" y2="8" stroke="#c3ff49" strokeWidth="2" />
    <line x1="60" y1="10" x2="65" y2="3" stroke="#c3ff49" strokeWidth="1.5" />

    {/* Face outline */}
    <ellipse
      cx="50"
      cy="55"
      rx="28"
      ry="32"
      stroke="#c3ff49"
      strokeWidth="2.5"
      fill="none"
    />

    {/* Eyes */}
    <circle cx="38" cy="50" r="4" fill="#c3ff49" />
    <circle cx="62" cy="50" r="4" fill="#c3ff49" />

    {/* Smile */}
    <path
      d="M35 68 Q50 82, 65 68"
      stroke="#c3ff49"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />

    {/* Headphones */}
    <path
      d="M20 50 Q15 35, 25 25"
      stroke="#c3ff49"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M80 50 Q85 35, 75 25"
      stroke="#c3ff49"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M25 25 Q50 5, 75 25"
      stroke="#c3ff49"
      strokeWidth="3"
      fill="none"
    />
    <ellipse
      cx="18"
      cy="52"
      rx="6"
      ry="8"
      stroke="#c3ff49"
      strokeWidth="2"
      fill="none"
    />
    <ellipse
      cx="82"
      cy="52"
      rx="6"
      ry="8"
      stroke="#c3ff49"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

// Glitchy 3D phone frame with vinyl
const GlitchyVinylFrame = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Glitch layers */}
      <div className="glitch-layer absolute inset-0 opacity-0">
        <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-transparent rounded-3xl" />
      </div>
      <div className="glitch-layer-2 absolute inset-0 opacity-0">
        <div className="w-full h-full bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-3xl" />
      </div>

      {/* Phone frame */}
      <div
        className="relative w-[280px] h-[380px] md:w-[320px] md:h-[440px] rounded-[2.5rem] p-3 overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 50%, #151515 100%)",
          boxShadow: `
            0 0 0 2px #2a2a2a,
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            inset 0 1px 0 rgba(255,255,255,0.05)
          `,
        }}
      >
        {/* Screen content */}
        <div
          className="w-full h-full rounded-[2rem] overflow-hidden relative"
          style={{
            background:
              "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)",
          }}
        >
          {/* Scan lines effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            }}
          />

          {/* Vinyl record */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="vinyl-in-frame w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full relative"
              style={{
                background: `
                  radial-gradient(circle at center,
                    #1a1a1a 0%,
                    #0a0a0a 18%,
                    #1a1a1a 19%,
                    #0a0a0a 36%,
                    #1a1a1a 37%,
                    #0a0a0a 54%,
                    #1a1a1a 55%,
                    #0a0a0a 72%,
                    #1a1a1a 73%,
                    #0a0a0a 90%,
                    #0f0f0f 100%
                  )
                `,
                boxShadow: `
                  0 0 0 3px #2a2a2a,
                  0 15px 40px -10px rgba(0, 0, 0, 0.9),
                  inset 0 0 30px rgba(195, 255, 73, 0.1)
                `,
              }}
            >
              {/* Center label */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70px] h-[70px] md:w-[85px] md:h-[85px] rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #c3ff49 0%, #a8e636 40%, #8bc926 70%, #6b8e23 100%)",
                  boxShadow: "0 4px 15px rgba(195, 255, 73, 0.4)",
                }}
              >
                <span className="font-pixter text-black text-xs md:text-sm font-bold">
                  SAMPLED
                </span>
              </div>

              {/* Shine */}
              <div
                className="absolute inset-0 rounded-full opacity-30"
                style={{
                  background:
                    "linear-gradient(120deg, transparent 20%, rgba(255,255,255,0.1) 45%, transparent 70%)",
                }}
              />
            </div>
          </div>

          {/* Glow behind vinyl */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full bg-primary/10 blur-3xl" />
          </div>

          {/* Bottom UI hint */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-grey-600" />
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="w-2 h-2 rounded-full bg-grey-600" />
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
      </div>
    </div>
  );
};

export const WaitlistCompleted = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Initial states
      gsap.set(".left-section", { x: -100, opacity: 0 });
      gsap.set(".center-section", { scale: 0.8, opacity: 0, rotateY: -15 });
      gsap.set(".right-section", { x: 100, opacity: 0 });
      gsap.set(".cta-section", { y: 50, opacity: 0 });

      // Entrance sequence
      tl.to(".center-section", {
        scale: 1,
        opacity: 1,
        rotateY: 0,
        duration: 1,
        ease: "back.out(1.4)",
      })
        .to(
          ".left-section",
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
          },
          "-=0.5",
        )
        .to(
          ".right-section",
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
          },
          "-=0.7",
        )
        .to(
          ".cta-section",
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
          },
          "-=0.3",
        );

      // Continuous vinyl rotation
      gsap.to(".vinyl-in-frame", {
        rotate: 360,
        duration: 15,
        repeat: -1,
        ease: "none",
      });

      // Glitch effect
      const glitchTl = gsap.timeline({ repeat: -1, repeatDelay: 4 });
      glitchTl
        .to(".glitch-layer", {
          opacity: 0.5,
          x: 5,
          duration: 0.1,
        })
        .to(
          ".glitch-layer-2",
          {
            opacity: 0.5,
            x: -5,
            duration: 0.1,
          },
          "<",
        )
        .to(".glitch-layer, .glitch-layer-2", {
          opacity: 0,
          x: 0,
          duration: 0.1,
        })
        .to(
          ".glitch-layer",
          {
            opacity: 0.3,
            x: -3,
            duration: 0.05,
          },
          "+=0.05",
        )
        .to(".glitch-layer", {
          opacity: 0,
          x: 0,
          duration: 0.05,
        });

      // Floating animation for avatar
      gsap.to(".floating-avatar", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Text reveal for scratchy elements
      gsap.to(".scratchy-line", {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      gsap.to(".center-section", {
        rotateY: xPercent * 8,
        rotateX: -yPercent * 5,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div>
      <Header />
      <div
        ref={containerRef}
        className="min-h-screen w-full flex flex-col justify-center px-4 md:px-8 lg:px-16 py-8 overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* Main 3-column layout */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-20 max-w-[1400px] mx-auto w-full">
          {/* Left Section - Greeting */}
          <div className="left-section flex-1 text-center lg:text-left max-w-[350px]">
            <div className="relative inline-block">
              <ScratchyText
                text="Hey!"
                className="w-[120px] md:w-[140px] mb-2"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-pale-grey leading-tight">
              I'm <span className="font-pixter text-primary">Frank</span>
            </h1>
            <p className="text-grey-300 mt-4 text-sm md:text-base leading-relaxed">
              Software Developer with over{" "}
              <span className="text-primary font-semibold">6 years</span> of
              experience building products that matter.
            </p>
            <p className="text-grey-400 mt-3 text-sm">
              Welcome to the future of music IP.
            </p>
          </div>

          {/* Center Section - 3D Phone/Vinyl */}
          <div
            className="center-section flex-shrink-0 order-first lg:order-none"
            style={{ transformStyle: "preserve-3d" }}
          >
            <GlitchyVinylFrame />
          </div>

          {/* Right Section - About Project */}
          <div className="right-section flex-1 text-center lg:text-left max-w-[400px]">
            <div className="floating-avatar mb-4 flex justify-center lg:justify-start">
              <HandDrawnAvatar className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]" />
            </div>
            <p className="text-grey-200 text-sm md:text-base leading-relaxed">
              <span className="text-primary font-bold">Sampled</span> is a
              two-layer music platform built on{" "}
              <span className="text-pale-grey font-semibold">
                Stellar blockchain
              </span>{" "}
              that harmonizes producers, artists, and fans.
            </p>
            <p className="text-grey-300 mt-3 text-sm leading-relaxed">
              <span className="text-primary">Layer 1 (B2B):</span> Register
              tracks as Music IP Assets, define licensing terms, and receive{" "}
              <span className="text-pale-grey">instant payments</span> from
              licenses and remixes with automatic royalty splits.
            </p>
            <p className="text-grey-300 mt-2 text-sm leading-relaxed">
              <span className="text-primary">Layer 2 (B2C):</span> Fans stream,
              tip artists, and purchase{" "}
              <span className="text-pale-grey">Royalty Tokens</span> to invest
              in songs they believe in.
            </p>
            <p className="text-grey-400 mt-3 text-xs">
              5-second finality. Micro-royalties that flow automatically. No
              middlemen.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section mt-12 md:mt-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-sm text-grey-400 mb-2">
            <div className="w-8 h-[1px] bg-grey-600" />
            <span>You're on the list</span>
            <div className="w-8 h-[1px] bg-grey-600" />
          </div>

          <div className="relative group">
            <Link to={"/explore"}>
              <div className="mt-5 md:mt-12 relative cursor-pointer inline-block">
                <div className="absolute top-0 left-0 h-[50px] w-[50px] rounded-full bg-primary"></div>
                <div className="w-[200px] h-[50px] bg-primary inline-flex items-center justify-center text-black font-semibold rounded-full ml-[40px]">
                  Explore the platform
                </div>
              </div>
            </Link>
          </div>

          <p className="text-xs text-grey-500 mt-2">
            Early access members get exclusive perks
          </p>
        </div>

        {/* Background ambient */}
        <div
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(195, 255, 73, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(195, 255, 73, 0.02) 0%, transparent 50%)",
          }}
        />
      </div>
    </div>
  );
};
