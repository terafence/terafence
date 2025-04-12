"use client"
import Container from "../global/container";
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import company1 from '../../../public/images/c1.png';
import company2 from '../../../public/images/c2.png';
import company3 from '../../../public/images/c3.png';
import company4 from '../../../public/images/c4.png';
import company5 from '../../../public/images/c5.png';
import company6 from '../../../public/images/c6.png';
import company7 from '../../../public/images/c7.png';

const Companies = () => {
    const sectionRef = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-visible');
                    }
                });
            },
            { threshold: 0.2 }
        );
        
        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        
        return () => {
            if (sectionRef.current) {
                // eslint-disable-next-line react-hooks/exhaustive-deps
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);
    
    const companyLogos = [
        { src: company1, alt: "Company 1" },
        { src: company2, alt: "Company 2" },
        { src: company3, alt: "Company 3" },
        { src: company4, alt: "Company 4" },
        { src: company6, alt: "Company 6" },
        { src: company7, alt: "Company 7" },
        { src: company5, alt: "Company 5" },
    ];

    return (
        <section 
            ref={sectionRef}
            className="relative w-full py-24 md:py-32 lg:py-40 mt-12 md:mt-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden fade-in-section"
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-100 to-transparent"></div>
                <div className="absolute -left-10 top-20 w-40 h-40 rounded-full bg-blue-200 blur-3xl"></div>
                <div className="absolute -right-10 top-40 w-60 h-60 rounded-full bg-purple-200 blur-3xl"></div>
            </div>
            
            <Container>
                <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            Trusted by <span className="font-subheading italic text-blue-700">leading</span> companies
                        </h2>
                        <div className="w-32 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                    </div>
                </div>
            </Container>

            <Container>
                <div className="relative z-10">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-16 max-w-7xl mx-auto">
                        {companyLogos.map((logo, index) => (
                            <div 
                                key={logo.alt}
                                className="flex items-center justify-center group transition-all duration-300"
                                style={{ 
                                    animationDelay: `${index * 0.1}s`,
                                    opacity: 0,
                                    animation: 'fadeInUp 0.6s ease forwards',
                                }}
                            >
                                <div className="relative p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-full h-44 flex items-center justify-center overflow-hidden group">
                                    <Image 
                                        src={logo.src} 
                                        alt={logo.alt} 
                                        className="h-24 w-auto object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110" 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    

                </div>
            </Container>
            
            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .fade-in-section {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                
                .fade-in-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </section>
    );
};

export default Companies;