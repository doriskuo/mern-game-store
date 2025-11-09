import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "../data/imagesData";

gsap.registerPlugin(ScrollTrigger);

const GameCarousel = () => {
  const trackRef = useRef(null);
  const carouselRef = useRef(null);
  const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL;

  useEffect(() => {
    if (!images.length || !trackRef.current) return;
    const track = trackRef.current;
    const distance = (trackRef.current as HTMLDivElement).scrollWidth / 2;

    // 無限循環動畫
    const tl = gsap.to(track, {
      x: -distance,
      duration: 50,
      repeat: -1,
      ease: "linear",
      modifiers: {
        x: (x) => `${parseFloat(x) % distance}px`,
      },
    });

    // 滾動觸發控制速度
    const st1 = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        if (velocity > 0) {
          tl.timeScale(2);
        } else if (velocity < 0) {
          tl.timeScale(-2);
        } else {
          tl.timeScale(1);
        }
      },
    });

    // 滾動固定 Carousel
    const st2 = ScrollTrigger.create({
      trigger: carouselRef.current,
      start:
        window.innerWidth < 640
          ? "top 200px"
          : window.innerWidth < 1024
            ? "top 200px"
            : "top 260px",
      endTrigger: "footer",
      end: "top+=100 bottom",
      pin: true,
      pinSpacing: false,
      onLeave: () => {
        gsap.to(carouselRef.current, {
          height: "80%",
          duration: 1,
        });
      },
    });

    return () => {
      tl.kill();
      st1.kill();
      st2.kill();
    };
  }, []);

  return (
    <div className="carousel" ref={carouselRef}>
      {/* ✅ 背景圖會自動根據環境變數切換 */}
      <img
        src={`${IMG_BASE_URL}/games/bgimage.png`}
        alt="bgimage"
        className="w-full"
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center overflow-hidden">
        <div ref={trackRef} className="flex w-max gap-10">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`game-${i}`}
              className="w-[200px] h-[120px] md:w-[270px] md:h-[160px] lg:w-[336px] lg:h-[200px] object-cover"
            />
          ))}
          {images.map((src, i) => (
            <img
              key={`clone-${i}`}
              src={src}
              alt={`game-clone-${i}`}
              className="w-[200px] h-[120px] md:w-[270px] md:h-[160px] lg:w-[336px] lg:h-[200px] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCarousel;
