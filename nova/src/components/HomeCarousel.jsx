// src/components/HomeCarousel.jsx
import { useEffect, useRef } from "react";

export default function HomeCarousel() {
  const ref = useRef(null);

  useEffect(() => {
    const $ = window.$ || window.jQuery;
    if (!ref.current || !$ || !$.fn?.owlCarousel) return;

    const $el = $(ref.current);
    $el.owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      dots: true,
      nav: true,
      navText: ["‹", "›"],
    });

    // Clean up on unmount (important when navigating away)
    return () => {
      try {
        $el.trigger("destroy.owl.carousel");
        $el.find(".owl-stage-outer").children().unwrap();
        $el.removeClass("owl-center owl-loaded owl-text-select-on");
      } catch {}
    };
  }, []);

  return (
    <div className="owl-carousel owl-theme home_slider" ref={ref}>
      <div className="owl-item home_slider_item">
        <div
          className="home_slider_background"
          style={{ backgroundImage: "url(/assets/images/home_slider.jpg)" }}
        />
        <div className="home_slider_content text-center">
          <div className="home_slider_content_inner">
            <h1>Find or Share</h1>
            <h1>in Halifax</h1>
          </div>
        </div>
      </div>
      {/* add more slides here */}
    </div>
  );
}
