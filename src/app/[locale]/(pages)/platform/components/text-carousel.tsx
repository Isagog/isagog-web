"use client";

import { useScopedI18n } from "@/packages/locales/client";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const TextCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [height, setHeight] = useState<number>();
  const activeSlideRef = useRef<HTMLDivElement>(null);
  const t = useScopedI18n("textCarousel");

  // Track the active slide's own height so the section never reserves room
  // for the longest one; ResizeObserver also covers rewraps on resize/font
  // load.
  useEffect(() => {
    const slide = activeSlideRef.current;
    if (!slide) return;

    const measure = () => setHeight(slide.getBoundingClientRect().height);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(slide);
    return () => observer.disconnect();
  }, [currentSlide]);

  const slides = [
    {
      title: t("slide1.title"),
      subtitle: t("slide1.subtitle"),
      points: [t("slide1.point1"), t("slide1.point2"), t("slide1.point3")],
    },
    {
      title: t("slide2.title"),
      subtitle: t("slide2.subtitle"),
      points: [t("slide2.point1"), t("slide2.point2"), t("slide2.point3")],
    },
    {
      title: t("slide3.title"),
      subtitle: t("slide3.subtitle"),
      points: [
        t("slide3.point1"),
        t("slide3.point2"),
        t("slide3.point3"),
        t("slide3.point4"),
      ],
    },
  ];

  return (
    <div className="flex w-full items-center justify-center bg-transparent px-6 py-10">
      <div
        className="relative w-full overflow-hidden rounded-[5px] border border-card-border bg-paper transition-[height] duration-500 ease-in-out sm:w-2/3"
        style={{ height }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.title}
            ref={currentSlide === index ? activeSlideRef : undefined}
            className={`w-full p-6 transition-opacity duration-500 ease-in-out sm:p-8 ${
              currentSlide === index
                ? "relative opacity-100"
                : "pointer-events-none absolute inset-x-0 top-0 opacity-0"
            }`}
          >
            <div className="md:space-y-6">
              <div>
                <h3 className="text-start font-sans text-xl font-medium text-terracotta">
                  {slide.title}
                </h3>
                <h4 className="mt-2 text-start font-serif text-2xl text-forest">
                  {slide.subtitle}
                </h4>
              </div>

              <ul className="space-y-4 md:space-y-6 md:pl-8">
                {slide.points.map((point) => (
                  <li key={point} className="flex items-start">
                    {index === slides.length - 1 && (
                      <span className="mt-1 mr-2 text-forest">
                        <Check size={20} />
                      </span>
                    )}
                    <p className="font-sans text-lg font-light text-prose-muted">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="absolute top-4 right-6 space-x-6 sm:space-x-2">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={t("dotLabel", { n: String(index + 1) })}
              className={`h-3 w-3 rounded-full transition-colors ${
                currentSlide === index ? "bg-forest" : "bg-forest/25 hover:bg-forest/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
