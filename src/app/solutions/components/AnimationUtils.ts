export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.9, 
      ease: [0.25, 0.1, 0.25, 1.0]  // Cubic bezier for smooth, premium feel
    }
  }
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: 80 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.9, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const fadeInRight = {
  hidden: { opacity: 0, x: -80 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.9, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

export const scaleUp = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.34, 1.56, 0.64, 1] // Custom spring-like effect
    }
  }
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    }
  }
};

export const staggerFast = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

export const staggerSlow = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.3,
    }
  }
};

// Path drawing animation for SVG elements
export const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { 
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.3 }
    }
  }
};

// Animation for section dividers
export const revealWidth = {
  hidden: { width: "0%" },
  visible: { 
    width: "100%",
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.03,
  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
};

export const hoverElevate = {
  y: -8,
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }
};

// Standard viewport options for animation triggers with more sensitive margins
export const standardViewport = { once: true, margin: "-120px" };
export const earlyViewport = { once: true, margin: "-200px" };
export const lateViewport = { once: true, margin: "-50px" };