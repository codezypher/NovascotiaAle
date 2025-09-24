// src/components/HomeCarousel.jsx
import { useEffect, useRef } from "react";

export default function HomeCarousel() {
  const sliderRef = useRef(null);
  const navHostRef = useRef(null);
  const dotsHostRef = useRef(null);

  useEffect(() => {
    const $ = window.$ || window.jQuery;
    if (!sliderRef.current || !($ && $.fn && $.fn.owlCarousel)) return;

    const $slider = $(sliderRef.current);

    // Initialize with external containers for nav/dots
    $slider.owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 5000,
      smartSpeed: 700,
      nav: true,
      dots: true,
      navContainer: navHostRef.current,   // <-- render arrows here
      dotsContainer: dotsHostRef.current, // <-- render dots here
      navText: [
        '<i class="fa fa-angle-left" aria-hidden="true"></i>',
        '<i class="fa fa-angle-right" aria-hidden="true"></i>'
      ]
    });

    return () => {
      try { $slider.trigger("destroy.owl.carousel"); } catch {}
    };
  }, []);

  return (
    <div className="home">
      <div className="home_slider_container">
        <div className="owl-carousel owl-theme home_slider" ref={sliderRef}>
          <div className="item">
            <div className="home_slider_background" style={{ backgroundImage: "url(/assets/images/home_slider.jpg)" }} />
            <div className="home_slider_content text-center">
              <div className="home_slider_content_inner">
                <h1>Find or Share</h1><h1>in Halifax</h1>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="home_slider_background" style={{ backgroundImage: "url(/assets/images/home_slider_2.jpg)" }} />
            <div className="home_slider_content text-center">
              <div className="home_slider_content_inner">
                <h1>Rooms • Jobs • Rides</h1><h1>All in one place</h1>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="home_slider_background" style={{ backgroundImage: "url(/assets/images/home_slider_3.jpg)" }} />
            <div className="home_slider_content text-center">
              <div className="home_slider_content_inner">
                <h1>Post in minutes</h1><h1>Explore instantly</h1>
              </div>
            </div>
          </div>
        </div>

        {/* We control where nav/dots are mounted */}
        <div className="home_nav_host" ref={navHostRef} />
        <div className="home_dots_host" ref={dotsHostRef} />
      </div>
    </div>
  );
}
