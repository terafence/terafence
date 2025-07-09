export const heroSection = {
    title: "Data Diode Solutions",
    subtitle: "Unidirectional Hardware Security for Mission-Critical Systems",
    description: "Enforce secure, one-way data flow with Data Diode technology. Designed for critical infrastructure, defense, and high-security environments.",
    ctaText: "Learn More"
  };
  
  export const howItWorksSection = {
    title: "How Does a Data Diode Work?",
    description: "Data Diodes use hardware-based optical separation to guarantee data travels only in one direction. This physical barrier eliminates the risk of backflow or cyber intrusion."
  };
  
  export const featuresSection = {
    title: "Key Features of Our Data Diode Solutions",
    features: [
      {
        title: "Unidirectional Data Transfer",
        description: "Guarantees information flows in only one direction, eliminating the possibility of data exfiltration.",
        icon: "ArrowNarrowRight"
      },
      {
        title: "Physical Network Isolation",
        description: "Creates an impenetrable hardware barrier between networks of different security levels.",
        icon: "Lock"
      },
      {
        title: "Zero Data Leakage",
        description: "Physically impossible for sensitive data to flow in the reverse direction.",
        icon: "ShieldLock"
      },
      {
        title: "Hardware-Enforced Security",
        description: "Security enforced at the physical layer, not dependent on software configurations.",
        icon: "DeviceDesktop"
      },
      {
        title: "High-Reliability Design",
        description: "Engineered for continuous operation in mission-critical environments.",
        icon: "Diamond"
      },
      {
        title: "Long-Term Stability",
        description: "Designed for minimal maintenance with exceptional operational lifespan.",
        icon: "Clock"
      }
    ]
  };
  
  export const comparisonSection = {
    title: "Why Choose Data Diodes Over Firewalls?",
    description: "While firewalls rely on software configurations that can fail or be breached, Data Diodes guarantee physical security by design. No reverse flow, no compromises.",
    comparison: [
      {
        category: "Security Level",
        firewall: "Software-based protection",
        diode: "Physical hardware separation"
      },
      {
        category: "Configuration",
        firewall: "Complex ruleset maintenance",
        diode: "Simple, fixed configuration"
      },
      {
        category: "Attack Surface",
        firewall: "Can be compromised",
        diode: "Physically impossible to breach"
      },
      {
        category: "Maintenance",
        firewall: "Regular updates required",
        diode: "Minimal maintenance needed"
      }
    ]
  };
  
  export const applicationsSection = {
    title: "Applications Across Industries",
    applications: [
      {
        title: "Critical Infrastructure Protection",
        description: "Safeguarding power grids, water systems, and other essential services.",
        icon: "BuildingFactory"
      },
      {
        title: "Defense & Military Systems",
        description: "Securing classified networks and mission-critical communications.",
        icon: "Shield"
      },
      {
        title: "Industrial Control Systems (ICS)",
        description: "Protecting manufacturing and operational technology environments.",
        icon: "Settings"
      },
      {
        title: "Secure Data Logging",
        description: "Enabling safe collection of logs from high-security environments.",
        icon: "FileText"
      },
      {
        title: "Isolated Software Updates",
        description: "Allowing updates to reach isolated systems without creating return paths.",
        icon: "Refresh"
      }
    ]
  };
  
  export const useCasesSection = {
    title: "Common Real-World Use Cases",
    cases: [
      "Secure telemetry transmissions from operational technology to monitoring systems",
      "Securely updating air-gapped networks without creating vulnerability",
      "Cross-domain solutions for classified environments requiring strict separation",
      "Protection of sensitive logs and security events for compliance and monitoring",
      "Vendor remote access for industrial systems without bidirectional connectivity"
    ]
  };
  
  export const faqSection = {
    title: "Frequently Asked Questions",
    faqs: [
      {
        question: "What is a Data Diode?",
        answer: "A Data Diode is a hardware device that allows data to flow in only one direction, creating a physical barrier that prevents reverse data flow. It's used in high-security environments where network separation is critical."
      },
      {
        question: "How does it differ from a firewall?",
        answer: "Unlike firewalls which use software rules that can be misconfigured or exploited, Data Diodes physically enforce one-way communication at the hardware level, making reverse data flow impossible regardless of software conditions."
      },
      {
        question: "Where are Data Diodes used?",
        answer: "Data Diodes are primarily used in critical infrastructure (power plants, water systems), defense systems, industrial control environments, and any facility requiring the highest levels of network security isolation."
      },
      {
        question: "Can Data Diodes fail?",
        answer: "Data Diodes are designed with simplicity and reliability in mind. The core unidirectional function cannot 'fail open' to allow bidirectional flow. However, like any hardware, the transmission capability itself could fail, which would result in no data flow rather than insecure data flow."
      },
      {
        question: "Do Data Diodes affect network performance?",
        answer: "Modern Data Diodes support high throughput with minimal latency. However, they are designed for specific use cases where security is prioritized over certain network functions that require bidirectional communication."
      },
      {
        question: "Can Data Diodes work with standard protocols?",
        answer: "Since many protocols require bidirectional communication, Data Diodes are typically deployed with proxy servers that handle protocol translation and acknowledgments, allowing them to work with TCP/IP and other common protocols."
      }
    ]
  };
  
  export const ctaSection = {
    title: "Secure Your Critical Data Today",
    buttonText: "Talk to Our Experts"
  };
  
  export const metaTags = {
    title: "Data Diode | High-Security One-Way Data Transfer",
    description: "Learn everything about Data Diodes, their features, how they work, and why they are critical for securing high-risk environments. Explore real-world applications today.",
    ogImage: "/images/data-diode-og.jpg"
  };