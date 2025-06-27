import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '../components/navbar/Navbar';
import IntroHero from '../components/introHero/IntroHero';
import ProfileCard from '../components/profileCard/ProfileCard';
import { sectionsData } from '../../utils/constants'

gsap.registerPlugin(ScrollTrigger);

/**
 * React component that renders the "About Us" page.
 * Displays a series of team member profile sections using `ProfileCard`,
 */
const AboutUs = () => {
    const sectionRefs = useRef([]);

    useEffect(() => {
        sectionRefs.current.forEach((el, i) => {
            ScrollTrigger.create({
                trigger: el,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => gsap.to('body', { backgroundColor: sectionsData[i].color, duration: 0.5 }),
                onLeaveBack: () => {
                    const prevColor = i === 0 ? '#ffffff' : sectionsData[i - 1].color;
                    gsap.to('body', { backgroundColor: prevColor, duration: 0.5 });
                },
            });
        });
    }, []);

    return (
        <>
            <Navbar headerContent='We - Write' />
            <IntroHero />
            <div className="text-center text-gray-900 pt-20 px-4 md:px-0">
                {sectionsData.map((section, index) => (
                    <section
                        key={index}
                        ref={(el) => (sectionRefs.current[index] = el)}
                        className="min-h-screen flex items-center justify-center transition-colors duration-500"
                    >
                        <ProfileCard
                            name={section.name}
                            id={section.studentId}
                            description={section.description}
                            image={section.image}
                            social={section.social}
                        />

                    </section>
                ))}
            </div>
        </>
    );
};

export default AboutUs;
