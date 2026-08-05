import gsap from "gsap";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

// Image configuration - positions and sizes for scattered layout
const imageConfig = [
  { id: 1, x: "5%", y: "0%", width: "380px", height: "420px", zIndex: 2 },
  { id: 2, x: "25%", y: "25%", width: "360px", height: "400px", zIndex: 3 },
  { id: 3, x: "42%", y: "-5%", width: "400px", height: "450px", zIndex: 4 },
  { id: 4, x: "62%", y: "30%", width: "350px", height: "380px", zIndex: 2 },
  { id: 5, x: "78%", y: "5%", width: "370px", height: "410px", zIndex: 3 },
];

// Placeholder images - will be replaced with actual images
const placeholderImages = [
  "/assets/images/artists/artist-1.avif",
  "/assets/images/artists/artist-2.png",
  "/assets/images/artists/artist-3.avif",
  "/assets/images/artists/artist-4.avif",
  "/assets/images/artists/artist-5.avif",
];

export const HeroAlt2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Title animation
    gsap.fromTo(
      ".hero-title",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
    );

    gsap.fromTo(
      ".hero-tm",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, ease: "power3.out" },
    );

    // Staggered image entrance
    gsap.fromTo(
      ".collage-image",
      { y: 100, opacity: 0, scale: 0.8 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.5,
      },
    );

    // Script text animation
    gsap.fromTo(
      ".hero-script",
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, delay: 1.2, ease: "power2.out" },
    );

    // Scroll-triggered parallax on images
    const images = document.querySelectorAll(".collage-image");
    images.forEach((img, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const speed = 50 + index * 20;

      gsap.to(img, {
        y: direction * speed,
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    // Fade out on scroll
    gsap.to(".hero-content", {
      opacity: 0,
      y: -100,
      scrollTrigger: {
        trigger: ".hero-section",
        start: "60% top",
        end: "bottom top",
        scrub: true,
      },
    });
  });

  return (
    <div
      ref={containerRef}
      className="hero-section relative min-h-screen bg-black overflow-hidden"
    >
      <div className="hero-content relative z-10 flex flex-col items-center pt-8 md:pt-16">
        {/* Large SAMPLED title at top */}
        <div className="relative flex hero-img z-[10]">
          <h2
            className="uppercase 2xl:text-[21.8vw] md:text-[20.8vw] text-[19.8vw] font-pixter leading-[0.5] text-center hero-bold-text"
            // onMouseEnter={() => {
            //   gsap.fromTo(
            //     `.hero-bold-text`,
            //     { scrambleText: "jkxsty", color: "#c3ff49" },
            //     { scrambleText: "Sampled", duration: 1.75, color: "#fff" }
            //   )
            // }}
          >
            Sampled
          </h2>
          <span className="md:text-[2rem]">TM</span>
        </div>

        {/* Scattered image collage */}
        <div
          ref={imagesRef}
          className="relative w-full h-[50vh] md:h-[55vh] max-w-[1400px] mx-auto"
        >
          {imageConfig.map((config, index) => (
            <div
              key={config.id}
              className="collage-image absolute grayscale-40 hover:grayscale-0 transition-all duration-500 cursor-pointer overflow-hidden"
              style={{
                left: config.x,
                top: config.y,
                width: config.width,
                height: config.height,
                zIndex: config.zIndex,
              }}
            >
              <img
                src={placeholderImages[index]}
                alt={`Artist ${index + 1}`}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback to placeholder color block if image doesn't exist
                  (e.target as HTMLImageElement).style.display = "none";
                  (
                    e.target as HTMLImageElement
                  ).parentElement!.style.background =
                    `linear-gradient(135deg, #1a1a1a 0%, #333 100%)`;
                }}
              />
            </div>
          ))}
        </div>

        {/* Script text at bottom */}
        <div className="hero-script mt-8 md:mt-12">
          <p
            className="text-[8vw] md:text-[5vw] text-white italic"
            style={{
              fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
              fontWeight: 300,
            }}
          >
            extraordinary
          </p>
        </div>

        {/* CTA Link */}
        <Link
          to="/market/all"
          className="mt-8 md:mt-12 group relative px-8 py-3 border border-white/30 rounded-full overflow-hidden transition-all duration-300 hover:border-primary"
        >
          <span className="relative z-10 font-pixter text-white uppercase tracking-wider text-sm group-hover:text-black transition-colors duration-300">
            Explore Samples
          </span>
          <div className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20">
        <p className="text-xs uppercase tracking-widest text-white">(Scroll)</p>
      </div>
    </div>
  );
};
