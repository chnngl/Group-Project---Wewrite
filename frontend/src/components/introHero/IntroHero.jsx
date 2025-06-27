import React, { useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./IntroHero.css";

/**
 * IntroHero component.
 *
 * This component renders the hero section of the introduction page, featuring a heading,
 * description, and animated scroll icon. It also temporarily sets a dark background color
 */

const IntroHero = () => {
  useEffect(() => {
    document.body.style.background = "#0f172a";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <section className="intro-hero d-flex align-items-center justify-content-center text-white text-center">
      <div className="pt-10 container">
        <h4 className="display-5 fw-bold animate-fade-in-up">
          Meet Our Developer Team
        </h4>
        <p className="lead text-white-50 mt-3 animate-fade-in-up delay-1s">
          A passionate group of full-stack developers, UI/UX enthusiasts, and
          creative minds building the future of collaborative storytelling.
        </p>
        <div className="mt-5 animate-bounce">
          <FaArrowDown size={28} />
        </div>
      </div>
    </section>
  );
};

export default IntroHero;
