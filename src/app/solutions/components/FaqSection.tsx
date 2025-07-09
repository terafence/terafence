import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface FAQ {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  faqs: FAQ[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ title, faqs }) => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerChildren}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-16 text-center"
          >
            {title}
          </motion.h2>
          
          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 px-8 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-semibold text-xl text-gray-800 py-6 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-lg leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;