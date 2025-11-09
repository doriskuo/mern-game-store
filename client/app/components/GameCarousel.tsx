import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "../data/imagesData";
gsap.registerPlugin(ScrollTrigger);

const GameCarousel = () => {
  const trackRef = useRef(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (!images.length || !trackRef.current) return;
    const track = trackRef.current;
    const distance = (trackRef.current as HTMLDivElement).scrollWidth / 2;

    // 基本無限循環動畫
    const tl = gsap.to(track, {
      x: -distance,
      duration: 50,
      repeat: -1,
      ease: "linear",
      modifiers: {
        // 每次位移超過 distance，就取餘數，形成無縫循環
        x: (x) => `${parseFloat(x) % distance}px`,
      },
    });

    // 滾動觸發 → 加速 or 反向
    const st1 = ScrollTrigger.create({
      trigger: track,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const velocity = self.getVelocity(); // 取得滾動速度
        if (velocity > 0) {
          tl.timeScale(2); // 向下滾動 → 加速
        } else if (velocity < 0) {
          tl.timeScale(-2); // 向上滾動 → 反向
        } else {
          tl.timeScale(1); // 停止滾動 → 回復正常速度
        }
      },
    });

    // 滾動觸發 →
    const st2 = ScrollTrigger.create({
      trigger: carouselRef.current,
      start:
        window.innerWidth < 640
          ? "top 200px"
          : window.innerWidth < 1024
            ? "top 280px"
            : "top 330px",
      endTrigger: "footer",
      end: "top+=150 bottom",
      pin: true,
      pinSpacing: false,
      onLeave: () => {
        gsap.to(carouselRef.current, {
          height: "70%",
          duration: 1,
        });
      },
    });

    return () => {
      tl.kill(); // 移除無限輪播動畫
      st1.kill(); // 移除第一個 ScrollTrigger
      st2.kill(); // 移除第二個 ScrollTrigger
    };
  }, []);

  return (
    <div className="carousel" ref={carouselRef}>
      <img
        src="http://localhost:3000/games/bgimage.png"
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
              className="w-[252px] h-[150px]  md:w-[336px] md:h-[200px] lg:w-[420px] lg:h-[250px] object-cover"
            />
          ))}
          {images.map((src, i) => (
            <img
              key={`clone-${i}`}
              src={src}
              alt={`game-clone-${i}`}
              className="w-[252px] h-[150px]  md:w-[336px] md:h-[200px] lg:w-[420px] lg:h-[250px] object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameCarousel;
