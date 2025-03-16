import { ITeamMember } from "@/components/Aboutpage/AboutPage";
import { IFilterButton } from "@/components/Button/FilterButton";
import { IReachout } from "@/components/Contactpage/Reachout";
import { ICourse } from "@/components/CourseCard/CourseCard";
import { IReason } from "@/components/HomepageComp/Chooseus";
import { IFaq } from "@/components/HomepageComp/Faq";
import { ITestimony } from "@/components/HomepageComp/Testimonials";
import { IPlan } from "@/components/Payments/Payments";
import { getIntroVideo, iframeData } from "@/components/iFRame";

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const courseQuizzes: { [key: number]: IQuizQuestion[] } = {
  1: [
    {
      question: "What is the primary purpose of cryptocurrency?",
      options: [
        "To replace cash entirely",
        "To provide a decentralized digital payment system",
        "To serve as a way to evade taxes",
        "To make internet transactions free"
      ],
      correctAnswer: 1
    },
    {
      question: "What was the first widely known cryptocurrency?",
      options: [
        "Ethereum",
        "Litecoin",
        "Bitcoin",
        "Ripple"
      ],
      correctAnswer: 2
    },
    {
      question: "How does blockchain technology contribute to cryptocurrency?",
      options: [
        "By allowing centralized control",
        "By keeping transactions transparent and secure",
        "By making transactions reversible",
        "By removing the need for internet access"
      ],
      correctAnswer: 1
    },
    {
      question: "Why do some people view cryptocurrency as a financial revolution?",
      options: [
        "It allows everyone to print their own money",
        "It eliminates the need for banks and traditional finance systems",
        "It is a new way to trade stocks",
        "It guarantees instant profits for everyone"
      ],
      correctAnswer: 1
    }
  ],
  2: [
    {
      question: "Which of the following is NOT a common misconception about cryptocurrency?",
      options: [
        "It has no real-world use",
        "It is always anonymous",
        "It is only used for illegal activities",
        "It has been adopted by major companies"
      ],
      correctAnswer: 3
    },
    {
      question: "What is a key reason why Bitcoin is not considered a scam?",
      options: [
        "It was created by a government agency",
        "It has a transparent ledger and decentralized control",
        "It is only used by banks",
        "It guarantees fixed profits"
      ],
      correctAnswer: 1
    },
    {
      question: "Why do billionaires and corporations invest in cryptocurrency?",
      options: [
        "To avoid paying taxes",
        "Because it has strong technological and financial value",
        "To manipulate the market",
        "To hide their money from the government"
      ],
      correctAnswer: 1
    },
    {
      question: "What ensures the security of the Bitcoin network?",
      options: [
        "A private company managing transactions",
        "Decentralized blockchain technology",
        "Government oversight",
        "A single controlling entity"
      ],
      correctAnswer: 1
    }
  ],
  3: [
    {
      question: "What is the key characteristic of Bitcoin?",
      options: [
        "Unlimited supply",
        "Decentralization and scarcity",
        "Government control",
        "Fixed transaction fees"
      ],
      correctAnswer: 1
    },
    {
      question: "What makes Ethereum different from Bitcoin?",
      options: [
        "It allows smart contracts and decentralized applications",
        "It is more expensive",
        "It is fully controlled by a central authority",
        "It has no blockchain technology"
      ],
      correctAnswer: 0
    },
    {
      question: "What are altcoins?",
      options: [
        "Alternative investment strategies",
        "Cryptocurrencies that are alternatives to Bitcoin",
        "Fake cryptocurrencies",
        "Government-backed digital currencies"
      ],
      correctAnswer: 1
    },
    {
      question: "What is the primary function of stablecoins?",
      options: [
        "To increase rapidly in value",
        "To provide a price-stable cryptocurrency alternative",
        "To replace all fiat currencies",
        "To be used exclusively in gaming"
      ],
      correctAnswer: 1
    }
  ]
};

export const AllCourses: ICourse[] = [
  {
    name: "What is cryptocurrency?",
    img: "/assets/thumbnails/thumb1.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 1,
    desc: "Dive into the fundamentals of cryptocurrency and blockchain technology. Learn about the evolution of money, the problems with traditional financial systems, and how cryptocurrencies are revolutionizing finance.",
    skills: [
      "Understanding Blockchain Technology",
      "Cryptocurrency Fundamentals",
      "Financial Systems Analysis",
      "Digital Currency Evolution",
      "Blockchain Applications",
      "Decentralized Finance",
      "Cryptocurrency Economics",
    ],
    duration: 3,
    requirements: [
      "No prior knowledge of cryptocurrency or finance is required",
      "Basic understanding of using computers and internet",
      "Open mind to learn about new financial technologies",
    ],
    syllabus: [
      {
        title: "Introduction to the Course",
        number: 1,
        topics: [
          "Course overview and objectives",
          "Setting expectations",
          "Learning path roadmap",
        ],
      },
      {
        title: "History of Cryptocurrency",
        number: 2,
        topics: [
          "Early digital currency attempts",
          "Birth of Bitcoin",
          "Major milestones in cryptocurrency history",
        ],
      },
      {
        title: "The Evolution of Money",
        number: 3,
        topics: [
          "From barter to digital currencies",
          "Functions of money",
          "Different forms of money through history",
        ],
      },
      {
        title: "Problems of the Traditional Financial System",
        number: 4,
        topics: [
          "Centralization issues",
          "Banking system limitations",
          "Financial inclusion challenges",
        ],
      },
      {
        title: "Advantages of Cryptocurrencies",
        number: 5,
        topics: [
          "Decentralization benefits",
          "Security features",
          "Global accessibility",
        ],
      },
      {
        title: "How Blockchain Works",
        number: 6,
        topics: [
          "Blockchain architecture",
          "Consensus mechanisms",
          "Cryptography basics",
        ],
      },
      {
        title: "Practical Benefits of Cryptocurrencies",
        number: 7,
        topics: [
          "Real-world use cases",
          "Payment solutions",
          "Financial services innovation",
        ],
      },
      {
        title: "The Financial Revolution",
        number: 8,
        topics: [
          "Impact on traditional banking",
          "DeFi introduction",
          "Future of finance",
        ],
      },
      {
        title: "Modern Recognition of Cryptocurrencies",
        number: 9,
        topics: [
          "Institutional adoption",
          "Regulatory landscape",
          "Integration with existing systems",
        ],
      },
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This comprehensive introduction to cryptocurrency opened my eyes to the future of finance. The course structure made complex concepts easy to understand.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1,
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "An excellent foundation course that covers everything from basic concepts to practical applications. The historical context really helped me understand why cryptocurrencies matter.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3,
      },
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(1),
  },
  {
    name: "Why is cryptocurrency not a scam?",
    img: "/assets/thumbnails/thumb2.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 2,
    desc: "Discover why cryptocurrency is a legitimate financial innovation, backed by institutional adoption, technological advancement, and market fundamentals. Learn about Bitcoin's remarkable journey from a digital experiment to a trillion-dollar asset class.",
    skills: [
      "Cryptocurrency Market Analysis",
      "Blockchain Technology Understanding",
      "Digital Asset Fundamentals",
      "Institutional Investment Analysis",
      "Network Security Principles",
      "Decentralized Systems",
      "Financial Market Integration"
    ],
    duration: 3,
    requirements: [
      "No prior knowledge of cryptocurrency or finance is required",
      "Basic understanding of using computers and internet",
      "Open mind to learn about modern financial systems",
      "Interest in understanding digital assets and blockchain technology"
    ],
    syllabus: [
      {
        title: "Introduction to Cryptocurrency and Misconceptions",
        number: 1,
        topics: [
          "Common myths about cryptocurrency",
          "Understanding digital assets",
          "The evolution of money and value"
        ]
      },
      {
        title: "Bitcoin's Growth and Market Capitalization",
        number: 2,
        topics: [
          "Bitcoin's historical price development",
          "Market capitalization analysis",
          "Institutional adoption trends"
        ]
      },
      {
        title: "Comparing Cryptocurrency with Traditional Markets",
        number: 3,
        topics: [
          "Cryptocurrency vs traditional assets",
          "Market dynamics and volatility",
          "Integration with existing financial systems"
        ]
      },
      {
        title: "Involvement of Billionaires and Major Corporations",
        number: 4,
        topics: [
          "Corporate treasury adoption",
          "Major investors and their strategies",
          "Institutional investment vehicles"
        ]
      },
      {
        title: "The Limited Supply of Bitcoin and Its Implications",
        number: 5,
        topics: [
          "Bitcoin's fixed supply mechanism",
          "Scarcity economics",
          "Impact on long-term value"
        ]
      },
      {
        title: "The Role of Blockchain Technology in Financial Freedom",
        number: 6,
        topics: [
          "Blockchain fundamentals",
          "Financial inclusion opportunities",
          "Decentralized finance applications"
        ]
      },
      {
        title: "Government Influence vs. Decentralized Networks",
        number: 7,
        topics: [
          "Regulatory landscape",
          "Network decentralization",
          "Censorship resistance"
        ]
      },
      {
        title: "Security and Resilience of the Bitcoin Network",
        number: 8,
        topics: [
          "Network security mechanisms",
          "Attack resistance",
          "Long-term sustainability"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This course completely changed my perspective on cryptocurrency. The evidence-based approach and clear explanations of institutional adoption really helped me understand the legitimacy of this technology.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Finally, a course that addresses cryptocurrency skepticism with facts and data! The sections on market capitalization and institutional adoption were particularly enlightening.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(2),
  },
  {
    name: "Bitcoin, Ethereum, Altcoins, Stablecoins, Blockchain explained",
    img: "/assets/thumbnails/thumb3.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 3,
    desc: "A comprehensive guide to understanding the major cryptocurrencies and blockchain technology. Learn about Bitcoin's journey, Ethereum's smart contracts, the role of altcoins, and how blockchain technology powers the crypto ecosystem.",
    skills: [
      "Bitcoin Fundamentals",
      "Ethereum & Smart Contracts",
      "Altcoin Analysis",
      "Blockchain Technology",
      "Stablecoin Understanding",
      "DeFi Basics",
      "Cryptocurrency Ecosystems"
    ],
    duration: 3,
    requirements: [
      "No prior knowledge of cryptocurrency required",
      "Basic understanding of digital technology",
      "Interest in learning about blockchain and cryptocurrencies"
    ],
    syllabus: [
      {
        title: "Introduction to Bitcoin: History and Concept",
        number: 1,
        topics: [
          "Origins of Bitcoin",
          "Satoshi Nakamoto's vision",
          "Core principles of cryptocurrency"
        ]
      },
      {
        title: "Bitcoin's Journey from Zero to One Trillion Dollars",
        number: 2,
        topics: [
          "Historical price milestones",
          "Major adoption events",
          "Market impact analysis"
        ]
      },
      {
        title: "Bitcoin as a Global Payment System",
        number: 3,
        topics: [
          "Transaction mechanics",
          "Lightning Network",
          "Cross-border payments"
        ]
      },
      {
        title: "The Deflationary Nature of Bitcoin",
        number: 4,
        topics: [
          "Halving events",
          "Supply mechanics",
          "Economic implications"
        ]
      },
      {
        title: "Ethereum and Smart Contracts",
        number: 5,
        topics: [
          "Ethereum basics",
          "Smart contract functionality",
          "DApp ecosystem"
        ]
      },
      {
        title: "The Power of Programmable Money",
        number: 6,
        topics: [
          "Smart contract applications",
          "DeFi protocols",
          "Token standards"
        ]
      },
      {
        title: "Altcoins and Their Role in the Cryptocurrency Ecosystem",
        number: 7,
        topics: [
          "Major altcoins overview",
          "Use cases and applications",
          "Market dynamics"
        ]
      },
      {
        title: "How Blockchain and Cryptocurrency Work Together",
        number: 8,
        topics: [
          "Blockchain fundamentals",
          "Consensus mechanisms",
          "Network security"
        ]
      },
      {
        title: "Stablecoins and Their Role in the Market",
        number: 9,
        topics: [
          "Types of stablecoins",
          "Use cases and benefits",
          "Market impact"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review: "This course provided an excellent overview of the entire cryptocurrency ecosystem. The explanations of different cryptocurrencies and their purposes were particularly helpful.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review: "The comprehensive coverage of Bitcoin, Ethereum, and other cryptocurrencies helped me understand how they all fit together in the broader ecosystem.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(3)
  },
  {
    name: "Cryptocurrency Security",
    img: "/assets/thumbnails/thumb4.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 4,
    desc: "Master the essential security practices for safely storing and managing your cryptocurrencies. Learn about hardware wallets, exchange security, and protecting yourself from common threats in the crypto space.",
    skills: [
      "Cryptocurrency Security Fundamentals",
      "Exchange Security Management",
      "Hardware Wallet Usage",
      "Seed Phrase Protection",
      "Network Security",
      "Anti-Phishing Techniques",
      "Account Protection Methods"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency concepts",
      "Access to a computer or smartphone",
      "Interest in learning about digital security"
    ],
    syllabus: [
      {
        title: "Personal Responsibility for Security",
        number: 1,
        topics: [
          "Understanding self-custody",
          "Security best practices",
          "Common security pitfalls"
        ]
      },
      {
        title: "Centralized Exchanges as Cryptocurrency Banks",
        number: 2,
        topics: [
          "Exchange security features",
          "Custodial vs non-custodial solutions",
          "Exchange selection criteria"
        ]
      },
      {
        title: "Main Risks When Using Exchanges",
        number: 3,
        topics: [
          "Account compromise risks",
          "Platform risks",
          "Regulatory risks"
        ]
      },
      {
        title: "Key Security Measures for Storing Cryptocurrencies",
        number: 4,
        topics: [
          "Cold storage solutions",
          "Hot wallet security",
          "Backup strategies"
        ]
      },
      {
        title: "Importance of the Seed Phrase and Ways to Secure It",
        number: 5,
        topics: [
          "Understanding seed phrases",
          "Storage methods",
          "Recovery procedures"
        ]
      },
      {
        title: "Additional Account and Device Protection Methods",
        number: 6,
        topics: [
          "Two-factor authentication",
          "Password management",
          "Device security"
        ]
      },
      {
        title: "Security When Using Wi-Fi and Router Configuration",
        number: 7,
        topics: [
          "Network security basics",
          "Safe browsing practices",
          "VPN usage"
        ]
      },
      {
        title: "Advantages of Hardware Wallets and Ways to Prevent Phishing",
        number: 8,
        topics: [
          "Hardware wallet benefits",
          "Phishing prevention",
          "Security best practices"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review: "This course taught me crucial security practices that every crypto investor should know. The section on hardware wallets was particularly enlightening.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review: "The comprehensive coverage of security measures and practical examples made it easy to implement proper security for my crypto assets.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(4)
  },
  {
    name: "How to use Binance",
    img: "/assets/thumbnails/thumb5.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 5,
    desc: "A comprehensive guide to using Binance, the world's largest cryptocurrency exchange. Learn how to safely set up your account, make trades, manage security, and handle deposits and withdrawals effectively.",
    skills: [
      "Binance Platform Navigation",
      "Cryptocurrency Trading Basics",
      "Security Setup",
      "Transaction Management",
      "Deposit/Withdrawal Processes",
      "Fee Understanding",
      "Account Protection"
    ],
    duration: 3,
    requirements: [
      "Basic computer skills",
      "Valid email address",
      "Smartphone for 2FA setup",
      "Government-issued ID for verification"
    ],
    syllabus: [
      {
        title: "How to install the Binance app safely and avoid phishing sites",
        number: 1,
        topics: [
          "Official download sources",
          "Verification of authenticity",
          "Phishing prevention"
        ]
      },
      {
        title: "Registering on Binance and creating your account",
        number: 2,
        topics: [
          "Account creation process",
          "KYC verification",
          "Security setup"
        ]
      },
      {
        title: "Key elements of the Binance trading platform interface",
        number: 3,
        topics: [
          "Platform navigation",
          "Essential features",
          "Trading interface overview"
        ]
      },
      {
        title: "How to make your first cryptocurrency purchase",
        number: 4,
        topics: [
          "Payment methods",
          "Order types",
          "Purchase process"
        ]
      },
      {
        title: "How to deposit or receive cryptocurrency in your trading account",
        number: 5,
        topics: [
          "Deposit methods",
          "Wallet addresses",
          "Network selection"
        ]
      },
      {
        title: "Understanding blockchain fees for cryptocurrency transactions",
        number: 6,
        topics: [
          "Network fees",
          "Trading fees",
          "Fee optimization"
        ]
      },
      {
        title: "Two-factor authentication: an extra layer of security",
        number: 7,
        topics: [
          "2FA setup",
          "Authentication methods",
          "Recovery options"
        ]
      },
      {
        title: "How to withdraw cryptocurrency from your account",
        number: 8,
        topics: [
          "Withdrawal process",
          "Security verifications",
          "Common issues"
        ]
      },
      {
        title: "Converting cryptocurrency to fiat money",
        number: 9,
        topics: [
          "Fiat conversion options",
          "Payment methods",
          "Withdrawal limits"
        ]
      },
      {
        title: "Advantages of cryptocurrency transactions over traditional bank transfers",
        number: 10,
        topics: [
          "Speed comparison",
          "Cost benefits",
          "Global accessibility"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review: "The step-by-step guide to using Binance was exactly what I needed. Now I can confidently trade and manage my crypto assets on the platform.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review: "Great course for beginners! The security setup and transaction management sections were particularly helpful in getting started safely.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(5)
  },
  {
    name: "Fundamental Analysis",
    img: "/assets/thumbnails/thumb6.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 6,
    desc: "Learn how to evaluate cryptocurrency projects using fundamental analysis. Understand the key differences from traditional markets, master research techniques, and analyze real-world cases like XRP to make informed investment decisions.",
    skills: [
      "Cryptocurrency Market Analysis",
      "Project Evaluation",
      "Market Metrics Understanding",
      "Research Methodology",
      "Data Analysis",
      "Social Metrics Analysis",
      "Case Study Analysis"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency concepts",
      "Familiarity with market terminology",
      "Interest in research and analysis",
      "Critical thinking skills"
    ],
    syllabus: [
      {
        title: "Differences between fundamental analysis in cryptocurrency and the stock market",
        number: 1,
        topics: [
          "Traditional vs crypto metrics",
          "Key evaluation factors",
          "Market behavior differences"
        ]
      },
      {
        title: "Challenges in evaluating blockchain projects",
        number: 2,
        topics: [
          "Research methodology",
          "Information verification",
          "Red flags identification"
        ]
      },
      {
        title: "Using CoinMarketCap for analyzing cryptocurrency market data",
        number: 3,
        topics: [
          "Platform navigation",
          "Data interpretation",
          "Metric analysis"
        ]
      },
      {
        title: "Understanding supply, demand, and market capitalization",
        number: 4,
        topics: [
          "Supply mechanics",
          "Demand drivers",
          "Market cap analysis"
        ]
      },
      {
        title: "Ripple (XRP) Case Study - Part 1",
        number: 5,
        topics: [
          "Project concept analysis",
          "Market position evaluation",
          "Price history analysis"
        ]
      },
      {
        title: "Ripple (XRP) Case Study - Part 2",
        number: 6,
        topics: [
          "Technical documentation review",
          "Development team assessment",
          "Social media impact analysis"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The comprehensive approach to fundamental analysis and real-world case studies helped me develop a structured approach to evaluating crypto projects.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "The XRP case study was particularly enlightening. It showed how to apply fundamental analysis principles to real cryptocurrency projects.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(6)
  },
  {
    name: "Technical Analysis",
    img: "/assets/thumbnails/thumb7.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 7,
     desc: "Master the art of technical analysis in cryptocurrency trading. Learn to use TradingView effectively, understand key indicators like RSI and Stochastic Oscillator, and develop skills in identifying profitable trading opportunities through practical examples with major cryptocurrencies.",
    skills: [
      "Technical Analysis Fundamentals",
      "TradingView Platform Mastery",
      "Indicator Analysis",
      "Chart Pattern Recognition",
      "Volume Analysis",
      "Entry/Exit Strategy",
      "Market Psychology Understanding"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency markets",
      "Access to a TradingView account (free version is sufficient)",
      "Willingness to practice technical analysis regularly",
      "Basic math skills for understanding indicators"
    ],
    syllabus: [
      {
        title: "Introduction to Technical Analysis",
        number: 1,
        topics: [
         "Fundamentals of technical analysis",
          "Price action basics",
          "Chart types and timeframes"
        ],
      },
      {
        title: "TradingView Platform Overview",
        number: 2,
        topics: [
          "Platform interface navigation",
          "Chart customization",
          "Essential tools and features"
        ],
      },
      {
        title: "Setting up TradingView for Market Analysis",
        number: 3,
        topics: [
          "Workspace organization",
          "Indicator setup",
          "Alert configuration"
        ],
      },
      {
        title: "RSI Indicator Analysis",
        number: 4,
        topics: [
         "Understanding RSI mechanics",
          "Signal interpretation",
          "Trading strategy development"
        ],
      },
            {
        title: "RSI Practical Applications",
        number: 5,
        topics: [
          "Real-world trading examples",
          "Signal confirmation techniques",
          "Risk management with RSI"
        ]
      },
      {
        title: "Japanese Candlesticks and Patterns",
        number: 6,
        topics: [
          "Candlestick formation",
          "Pattern recognition",
          "Trading pattern setups"
        ]
      },
       {
        title: "Overbought and Oversold Analysis",
        number: 7,
        topics: [
          "Identifying market extremes",
          "Confirmation signals",
          "Trading reversals"
        ]
      },
       {
        title: "Stochastic Oscillator Deep Dive",
        number: 8,
        topics: [
          "Oscillator mechanics",
          "Signal generation",
          "Trading strategy implementation"
        ]
      },
       {
        title: "Squeeze Momentum Indicator",
        number: 9,
        topics: [
          "Understanding momentum",
          "Volatility analysis",
          "Trade timing optimization"
        ]
      },
      {
        title: "Volume Analysis",
        number: 10,
        topics: [
          "Volume interpretation",
          "Price-volume relationships",
          "Volume-based strategies"
        ]
      },
       {
        title: "Entry and Exit Strategy",
        number: 11,
        topics: [
         "Multiple indicator confluence",
          "Real cryptocurrency examples",
          "Risk management techniques"
        ]
      },
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This course is a great starting point for anyone looking to get into crypto trading...",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1,
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "I was skeptical about taking an online course on crypto trading, but this course exceeded my expectations...",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3,
      },
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(7),

  },
  {
    name: "How to identify pumps and dumps",
    img: "/assets/thumbnails/thumb8.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 8,
    desc: "Learn to protect yourself from market manipulation by understanding how to identify pump and dump schemes in cryptocurrency markets. Master the techniques to analyze suspicious price movements, social media influence, and market patterns.",
    skills: [
      "Market Manipulation Detection",
      "Social Media Analysis",
      "Volume Analysis",
      "Risk Assessment",
      "Pattern Recognition",
      "Price Action Analysis",
      "Market Psychology Understanding"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency markets",
      "Familiarity with trading charts",
      "Critical thinking skills",
      "Access to social media platforms for market analysis"
    ],
    syllabus: [
      {
        title: "Definition and signs of pumps and dumps",
        number: 1,
        topics: [
          "Understanding market manipulation",
          "Common pump and dump patterns",
          "Early warning signs"
        ]
      },
      {
        title: "Risks of buying at the peak",
        number: 2,
        topics: [
          "Price action analysis",
          "FOMO psychology",
          "Risk assessment techniques"
        ]
      },
      {
        title: "How pumps are created",
        number: 3,
        topics: [
          "Volume manipulation tactics",
          "Influencer coordination",
          "Market psychology exploitation"
        ]
      },
      {
        title: "Technical analysis for identifying pumps",
        number: 4,
        topics: [
          "Volume analysis",
          "Price pattern recognition",
          "Indicator divergences"
        ]
      },
      {
        title: "Fundamental analysis for pump identification",
        number: 5,
        topics: [
          "Project evaluation",
          "Red flags identification",
          "News impact analysis"
        ]
      },
      {
        title: "Social media influence analysis",
        number: 6,
        topics: [
          "Twitter sentiment analysis",
          "Influencer credibility assessment",
          "Coordinated promotion detection"
        ]
      },
      {
        title: "Analyzing cheap coins",
        number: 7,
        topics: [
          "Market cap analysis",
          "Supply mechanics",
          "Price manipulation risks"
        ]
      },
      {
        title: "Protection strategies",
        number: 8,
        topics: [
          "Risk management techniques",
          "Due diligence practices",
          "Exit strategy development"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This course opened my eyes to the various manipulation tactics in crypto markets. The section on social media influence analysis was particularly enlightening.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "The practical examples of pump and dump patterns helped me avoid several potential losses. Essential knowledge for any crypto investor.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(8)
  },
  {
    name: "Technical Analysis: Advanced",
    img: "/assets/thumbnails/thumb9.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Advanced",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 9,
    desc: "Master advanced technical analysis techniques for cryptocurrency trading. Learn complex chart patterns, Fibonacci analysis, and combine multiple indicators for precise trade entries and exits. Includes practical examples using Bitcoin, Ethereum, and other major cryptocurrencies.",
    skills: [
      "Advanced Chart Pattern Analysis",
      "Fibonacci Trading",
      "Multi-Indicator Strategy",
      "Trend Analysis Mastery",
      "Support/Resistance Identification",
      "Price Action Trading",
      "Trade Setup Optimization"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of technical analysis",
      "Experience with TradingView platform",
      "Knowledge of basic chart patterns",
      "Familiarity with trading indicators"
    ],
    syllabus: [
      {
        title: "Advanced Trendline Analysis",
        number: 1,
        topics: [
          "Trendline identification techniques",
          "Multiple timeframe analysis",
          "Trend strength assessment"
        ]
      },
      {
        title: "Support and Resistance Mastery",
        number: 2,
        topics: [
          "Dynamic support/resistance",
          "Multiple timeframe confirmation",
          "Break and retest patterns"
        ]
      },
      {
        title: "Head and Shoulders Pattern Trading",
        number: 3,
        topics: [
          "Pattern identification",
          "Entry and exit points",
          "Risk management strategies"
        ]
      },
      {
        title: "Triangle Patterns Analysis",
        number: 4,
        topics: [
          "Ascending/Descending triangles",
          "Symmetrical triangles",
          "Breakout trading strategies"
        ]
      },
      {
        title: "Entry and Exit Point Optimization",
        number: 5,
        topics: [
          "Multiple confirmation signals",
          "Take-profit level setting",
          "Stop-loss placement"
        ]
      },
      {
        title: "Fibonacci Trading Strategies",
        number: 6,
        topics: [
          "Key Fibonacci levels",
          "Retracement analysis",
          "Extension targets"
        ]
      },
      {
        title: "Multi-Indicator Strategy Development",
        number: 7,
        topics: [
          "Indicator combination techniques",
          "Avoiding indicator redundancy",
          "Signal confirmation methods"
        ]
      },
      {
        title: "Advanced TradingView Tools",
        number: 8,
        topics: [
          "Custom indicator setup",
          "Alert configuration",
          "Chart layout optimization"
        ]
      },
      {
        title: "Practical Analysis Examples",
        number: 9,
        topics: [
          "Bitcoin chart analysis",
          "Ethereum trading setups",
          "ETC case studies"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The advanced technical analysis techniques and real-world cryptocurrency examples helped take my trading to the next level. The Fibonacci section was particularly valuable.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Excellent advanced course! The combination of multiple technical analysis elements and practical examples using major cryptocurrencies was extremely helpful.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(9)
  },
  {
    name: "Warning of leverages",
    img: "/assets/thumbnails/thumb10.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 10,
    desc: "Understand the risks and dangers of leveraged trading in cryptocurrency markets. Learn why most traders lose money with leverage, how to avoid common pitfalls, and when (if ever) leverage might be appropriate.",
    skills: [
      "Risk Assessment",
      "Leverage Mechanics",
      "Margin Trading Understanding",
      "Liquidation Prevention",
      "Position Sizing",
      "Risk Management",
      "Market Psychology"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency trading",
      "Knowledge of market terminology",
      "Calculator for leverage examples",
      "Willingness to learn from others' mistakes"
    ],
    syllabus: [
      {
        title: "What is leverage in trading?",
        number: 1,
        topics: [
          "Basic leverage concepts",
          "Types of leverage",
          "Margin trading fundamentals"
        ]
      },
      {
        title: "Risks of using leverage",
        number: 2,
        topics: [
          "Potential for total loss",
          "Psychological impact",
          "Market volatility risks"
        ]
      },
      {
        title: "How leverage works, with an example",
        number: 3,
        topics: [
          "Practical calculations",
          "Real-world scenarios",
          "Profit and loss examples"
        ]
      },
      {
        title: "Leverage as a gambling game",
        number: 4,
        topics: [
          "Gambling mentality",
          "Addiction risks",
          "Common psychological traps"
        ]
      },
      {
        title: "Problems with liquidation and margin calls",
        number: 5,
        topics: [
          "Understanding liquidation prices",
          "Margin call mechanics",
          "Prevention strategies"
        ]
      },
      {
        title: "Investing vs. using leverage",
        number: 6,
        topics: [
          "Long-term vs short-term",
          "Risk comparison",
          "Success rate analysis"
        ]
      },
      {
        title: "When can leverage be used?",
        number: 7,
        topics: [
          "Professional scenarios",
          "Risk management requirements",
          "Experience prerequisites"
        ]
      },
      {
        title: "Recommendations and conclusions",
        number: 8,
        topics: [
          "Best practices",
          "Alternative strategies",
          "Final warnings"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This course saved me from potential disasters with leverage trading. The real-world examples and clear warnings were eye-opening.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Essential knowledge for any crypto trader. The section on liquidation risks and practical examples helped me understand why leverage is so dangerous.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(10)
  },
  {
    name: "How to trade. Basics",
    img: "/assets/thumbnails/thumb11.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 11,
    desc: "Master the fundamentals of cryptocurrency trading with practical examples and hands-on experience. Learn essential trading concepts, order types, analysis techniques, and risk management strategies using popular exchanges like Binance and Kraken.",
    skills: [
      "Trading Fundamentals",
      "Order Type Management",
      "Technical Analysis Basics",
      "Risk Management",
      "Exchange Platform Usage",
      "Pattern Recognition",
      "Multi-Timeframe Analysis"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency",
      "Access to Binance and Kraken accounts",
      "Willingness to start with small amounts",
      "Patient approach to learning"
    ],
    syllabus: [
      {
        title: "Trading vs Long-term Investing",
        number: 1,
        topics: [
          "Key differences and strategies",
          "Risk and reward comparison",
          "Choosing your approach"
        ]
      },
      {
        title: "Understanding Order Types",
        number: 2,
        topics: [
          "Stop-loss mechanics",
          "Take-profit strategies",
          "Market vs Limit orders"
        ]
      },
      {
        title: "Technical Analysis for Trade Parameters",
        number: 3,
        topics: [
          "Entry point identification",
          "Stop-loss placement",
          "Take-profit targets"
        ]
      },
      {
        title: "Multiple Timeframe Analysis",
        number: 4,
        topics: [
          "Timeframe correlation",
          "Entry/exit confirmation",
          "Trend alignment"
        ]
      },
      {
        title: "Moving Averages in Trading",
        number: 5,
        topics: [
          "Types of moving averages",
          "Signal interpretation",
          "Trading strategies"
        ]
      },
      {
        title: "Practical Trading Examples",
        number: 6,
        topics: [
          "Ethereum trade analysis",
          "Solana setup examples",
          "Link trading scenarios"
        ]
      },
      {
        title: "Cup and Handle Pattern Trading",
        number: 7,
        topics: [
          "Pattern identification",
          "Entry/exit points",
          "Risk management"
        ]
      },
      {
        title: "Margin Trading Basics",
        number: 8,
        topics: [
          "Isolated vs Cross margin",
          "Risk assessment",
          "Position sizing"
        ]
      },
      {
        title: "Binance Trading Terminal",
        number: 9,
        topics: [
          "Interface navigation",
          "Order execution",
          "Position management"
        ]
      },
      {
        title: "Kraken Trading Terminal",
        number: 10,
        topics: [
          "Platform features",
          "Order placement",
          "Trade management"
        ]
      },
      {
        title: "Risk Reduction for Beginners",
        number: 11,
        topics: [
          "Position sizing",
          "Risk management rules",
          "Common pitfalls"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The practical examples and step-by-step guidance through real trades on Binance and Kraken were invaluable. Perfect for beginners!",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "The focus on risk management and practical trading examples helped me start trading confidently. The multiple timeframe analysis section was particularly helpful.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(11)
  },
  {
    name: "Trading: Advanced",
    img: "/assets/thumbnails/thumb12.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Advanced",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 12,
    desc: "Master advanced trading techniques including leverage trading, position sizing, and complex order strategies. Learn how to create comprehensive trading plans and execute sophisticated trades using Bitcoin, Ethereum, and BNB as practical examples.",
    skills: [
      "Advanced Risk Management",
      "Leverage Trading Mastery",
      "Position Sizing Strategy",
      "Technical Analysis Application",
      "Trade Planning",
      "Order Execution",
      "Portfolio Management"
    ],
    duration: 3,
    requirements: [
      "Strong understanding of basic trading concepts",
      "Experience with technical analysis",
      "Familiarity with trading platforms",
      "Basic math skills for position sizing"
    ],
    syllabus: [
      {
        title: "Advanced Leverage Trading",
        number: 1,
        topics: [
          "Leverage mechanics",
          "Risk assessment",
          "Benefits and dangers"
        ]
      },
      {
        title: "Advanced Indicator Strategy",
        number: 2,
        topics: [
          "Multi-indicator analysis",
          "Parameter definition",
          "Signal confirmation"
        ]
      },
      {
        title: "Comprehensive Trading Plan Development",
        number: 3,
        topics: [
          "Success scenario planning",
          "Failure mitigation strategies",
          "Loss prevention tactics"
        ]
      },
      {
        title: "Risk and Profit Calculation",
        number: 4,
        topics: [
          "Risk-reward ratios",
          "Profit potential analysis",
          "Loss limitation strategies"
        ]
      },
      {
        title: "Position Sizing Optimization",
        number: 5,
        topics: [
          "Position size calculation",
          "Risk per trade",
          "Portfolio allocation"
        ]
      },
      {
        title: "Advanced Order Types",
        number: 6,
        topics: [
          "Limit order strategies",
          "Market order timing",
          "Order execution optimization"
        ]
      },
      {
        title: "Long Position Strategy",
        number: 7,
        topics: [
          "Bitcoin analysis example",
          "Entry/exit timing",
          "Position management"
        ]
      },
      {
        title: "Short Position Strategy",
        number: 8,
        topics: [
          "Ethereum analysis example",
          "Short entry tactics",
          "Risk management specifics"
        ]
      },
      {
        title: "Leveraged Position Execution",
        number: 9,
        topics: [
          "BNB trading example",
          "Leverage optimization",
          "Risk control methods"
        ]
      },
      {
        title: "Safe Leverage Practices",
        number: 10,
        topics: [
          "Risk management rules",
          "Position sizing with leverage",
          "Emergency procedures"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The advanced trading concepts and real-world examples using major cryptocurrencies were extremely valuable. The position sizing and risk management sections were game-changers.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Excellent advanced course! The practical examples with Bitcoin, Ethereum, and BNB helped me understand complex trading strategies and risk management techniques.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(12)
  },
  {
    name: "How to use Kraken",
    img: "/assets/thumbnails/thumb13.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 13,
    desc: "Learn how to effectively use the Kraken cryptocurrency exchange. Master account setup, navigation, funding, and executing trades with practical examples using Dogecoin. Perfect for beginners looking to start trading on Kraken.",
    skills: [
      "Kraken Platform Navigation",
      "Account Management",
      "Order Execution",
      "Funding Procedures",
      "Trade Management",
      "Security Setup",
      "Platform Features"
    ],
    duration: 3,
    requirements: [
      "Valid email address",
      "Government ID for verification",
      "Basic computer skills",
      "Access to banking/payment methods"
    ],
    syllabus: [
      {
        title: "Navigating Kraken Platform",
        number: 1,
        topics: [
          "Platform interface overview",
          "Account setup process",
          "Security features"
        ]
      },
      {
        title: "Funding Your Account",
        number: 2,
        topics: [
          "Deposit methods",
          "Fee structure",
          "Processing times"
        ]
      },
      {
        title: "Creating Market Orders",
        number: 3,
        topics: [
          "Order types explained",
          "Dogecoin trading example",
          "Order placement process"
        ]
      },
      {
        title: "Understanding Order Execution",
        number: 4,
        topics: [
          "Execution mechanics",
          "Order status tracking",
          "Trade confirmation"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The step-by-step guide to using Kraken was exactly what I needed. The Dogecoin trading example made it easy to understand the platform.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Clear and concise instructions on using Kraken. The funding and order execution sections were particularly helpful for getting started.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(13)
  },
  {
    name: "How to build your portfolio",
    img: "/assets/thumbnails/thumb14.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 14,
    desc: "Learn how to build and manage a balanced cryptocurrency portfolio. Understand portfolio fundamentals, risk management, and diversification strategies while exploring both established cryptocurrencies and emerging projects.",
    skills: [
      "Portfolio Management",
      "Risk Assessment",
      "Asset Allocation",
      "Investment Strategy",
      "Fundamental Analysis",
      "Diversification Techniques",
      "Long-term Planning"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency",
      "Long-term investment mindset",
      "Willingness to research projects",
      "Risk management awareness"
    ],
    syllabus: [
      {
        title: "General Principles of Portfolio Creation",
        number: 1,
        topics: [
          "Portfolio basics",
          "Risk assessment",
          "Investment goals"
        ]
      },
      {
        title: "Market Approach Comparison",
        number: 2,
        topics: [
          "Stock market strategies",
          "Crypto market differences",
          "Adaptation techniques"
        ]
      },
      {
        title: "Foundation Assets: Bitcoin and Ethereum",
        number: 3,
        topics: [
          "Bitcoin allocation strategy",
          "Ethereum's role",
          "Portfolio weighting"
        ]
      },
      {
        title: "BNB Strategic Investment",
        number: 4,
        topics: [
          "BNB ecosystem benefits",
          "Utility analysis",
          "Growth potential"
        ]
      },
      {
        title: "Dollar-Cost Averaging Strategy",
        number: 5,
        topics: [
          "DCA implementation",
          "Risk management",
          "Investment scheduling"
        ]
      },
      {
        title: "Managing Speculative Investments",
        number: 6,
        topics: [
          "Dogecoin case study",
          "Risk assessment",
          "Position sizing"
        ]
      },
      {
        title: "Fundamental Analysis for Coin Selection",
        number: 7,
        topics: [
          "Evaluation criteria",
          "Research methodology",
          "Red flags identification"
        ]
      },
      {
        title: "Portfolio Diversification",
        number: 8,
        topics: [
          "Asset allocation",
          "Risk distribution",
          "Rebalancing strategies"
        ]
      },
      {
        title: "Long-Term Investment Strategy",
        number: 9,
        topics: [
          "Time horizon planning",
          "Market cycle analysis",
          "Portfolio adjustment"
        ]
      },
      {
        title: "Early-Stage Project Investment",
        number: 10,
        topics: [
          "Risk assessment",
          "Due diligence",
          "Position management"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The comprehensive approach to portfolio building and the emphasis on risk management helped me create a well-balanced cryptocurrency investment strategy.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "The sections on Bitcoin and Ethereum as foundation assets and the dollar-cost averaging strategy were particularly valuable for long-term planning.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(14)
  },
  {
    name: "Crypto mistakes to avoid",
    img: "/assets/thumbnails/thumb15.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 15,
    desc: "Learn from the most common mistakes in cryptocurrency investing and trading. This course helps you identify and avoid critical errors that can lead to significant losses, focusing on risk management, security, and smart investment practices.",
    skills: [
      "Risk Management",
      "Security Best Practices",
      "Portfolio Diversification",
      "Investment Strategy",
      "Market Psychology",
      "Asset Protection",
      "Critical Analysis"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency concepts",
      "Willingness to learn from others' mistakes",
      "Open mind to changing investment habits",
      "Commitment to security practices"
    ],
    syllabus: [
      {
        title: "The Dangers of Leverage",
        number: 1,
        topics: [
          "Why leverage is dangerous",
          "Real examples of leverage losses",
          "Alternative investment strategies"
        ]
      },
      {
        title: "Security Fundamentals",
        number: 2,
        topics: [
          "Common security vulnerabilities",
          "Best practices for wallet security",
          "Exchange security measures"
        ]
      },
      {
        title: "Avoiding Speculative Assets",
        number: 3,
        topics: [
          "Identifying risky projects",
          "Due diligence process",
          "Red flags in crypto projects"
        ]
      },
      {
        title: "Pump and Dump Schemes",
        number: 4,
        topics: [
          "Recognizing pump signals",
          "Why chasing pumps fails",
          "Protection strategies"
        ]
      },
      {
        title: "Portfolio Diversification",
        number: 5,
        topics: [
          "Importance of diversification",
          "Balanced portfolio strategy",
          "Risk distribution methods"
        ]
      },
      {
        title: "Smart Investment Allocation",
        number: 6,
        topics: [
          "Position sizing principles",
          "Dollar-cost averaging benefits",
          "Risk management techniques"
        ]
      },
      {
        title: "Practical Knowledge Application",
        number: 7,
        topics: [
          "Learning from case studies",
          "Implementing safety measures",
          "Building good habits"
        ]
      },
      {
        title: "Final Insights and Motivation",
        number: 8,
        topics: [
          "Key takeaways",
          "Success principles",
          "Long-term strategy"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This course saved me from making costly mistakes. The section on security practices was particularly eye-opening and helped me protect my investments.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Learning about common mistakes before making them was invaluable. The practical examples and case studies really drove the points home.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(15)
  },
  {
    name: "Pumps and Dumps",
    img: "/assets/thumbnails/thumb16.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 16,
    desc: "Master the art of identifying pump and dump schemes in cryptocurrency markets. Learn to protect your investments by recognizing manipulation patterns, understanding market psychology, and analyzing warning signs across technical, fundamental, and social indicators.",
    skills: [
      "Market Manipulation Detection",
      "Social Media Analysis",
      "Technical Pattern Recognition",
      "Risk Assessment",
      "Project Evaluation",
      "FOMO Management",
      "Market Psychology"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency markets",
      "Familiarity with trading charts",
      "Access to social media platforms",
      "Critical thinking skills"
    ],
    syllabus: [
      {
        title: "Understanding Pumps and Dumps",
        number: 1,
        topics: [
          "What defines a pump and dump",
          "Historical examples in crypto",
          "Common manipulation tactics"
        ]
      },
      {
        title: "Psychology and FOMO",
        number: 2,
        topics: [
          "Understanding market psychology",
          "FOMO triggers and responses",
          "Managing emotional trading"
        ]
      },
      {
        title: "Technical Analysis for Pumps",
        number: 3,
        topics: [
          "Volume analysis patterns",
          "Price action indicators",
          "Chart pattern warnings"
        ]
      },
      {
        title: "Project Evaluation",
        number: 4,
        topics: [
          "Developer background checks",
          "Project age significance",
          "Code audit importance"
        ]
      },
      {
        title: "Social Media Analysis",
        number: 5,
        topics: [
          "Influencer red flags",
          "Coordinated promotion signs",
          "Social sentiment analysis"
        ]
      },
      {
        title: "Trading Strategy",
        number: 6,
        topics: [
          "Buy the rumor concept",
          "Sell the news timing",
          "Exit strategy planning"
        ]
      },
      {
        title: "Risk Management",
        number: 7,
        topics: [
          "Dangers of participation",
          "Legal implications",
          "Portfolio protection"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "This course opened my eyes to the manipulation tactics in crypto markets. The technical analysis section helped me spot several pump and dumps before they crashed.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "The social media analysis section was particularly valuable. I now know exactly what red flags to look for when evaluating crypto projects and promotions.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(16)
  },
  {
    name: "Bybit tutorial",
    img: "/assets/thumbnails/thumb1.webp",
    dollarPrice: 245.99,
    nairaPrice: null,
    level: "Beginner",
    category: "Most Popular",
    isLoved: false,
    rating: 4.9,
    noEnrolled: 100,
    field: "Finance",
    id: 17,
    desc: "Master Bybit trading with this comprehensive tutorial. Learn everything from platform navigation to executing trades, using TradingView integration, and managing positions effectively. Perfect for beginners looking to start trading on Bybit with confidence.",
    skills: [
      "Bybit Platform Navigation",
      "TradingView Integration",
      "Pattern Recognition",
      "Trade Execution",
      "Risk Management",
      "Position Sizing",
      "Order Management"
    ],
    duration: 3,
    requirements: [
      "Basic understanding of cryptocurrency",
      "Verified Bybit account",
      "TradingView account (free version is fine)",
      "Access to computer or mobile device"
    ],
    syllabus: [
      {
        title: "Bybit Platform Basics",
        number: 1,
        topics: [
          "Platform overview and features",
          "Account setup and verification",
          "Understanding the interface"
        ]
      },
      {
        title: "TradingView Integration",
        number: 2,
        topics: [
          "Connecting TradingView with Bybit",
          "Chart setup and customization",
          "Using indicators effectively"
        ]
      },
      {
        title: "Pattern Recognition",
        number: 3,
        topics: [
          "Descending Wedge patterns",
          "Bull Flag identification",
          "Breakout confirmation"
        ]
      },
      {
        title: "Trade Execution",
        number: 4,
        topics: [
          "Order types on Bybit",
          "Position entry timing",
          "Execution confirmation"
        ]
      },
      {
        title: "Mobile Trading",
        number: 5,
        topics: [
          "Bybit mobile app setup",
          "Navigation differences",
          "Mobile-specific features"
        ]
      },
      {
        title: "Bitcoin Trading Practice",
        number: 6,
        topics: [
          "Opening BTC positions",
          "Position management",
          "Trade monitoring"
        ]
      },
      {
        title: "Risk Settings",
        number: 7,
        topics: [
          "Leverage configuration",
          "Stop-loss placement",
          "Take-profit strategies"
        ]
      },
      {
        title: "Trade Management",
        number: 8,
        topics: [
          "Position monitoring",
          "Adjusting orders",
          "Closing positions"
        ]
      }
    ],
    reviews: [
      {
        name: "Omotayo",
        post: "Alumni",
        review:
          "The step-by-step guide to Bybit trading was exactly what I needed. The TradingView integration section was particularly helpful for my analysis.",
        likes: 50,
        comments: 51,
        img: "/assets/tayo.png",
        daysAgo: 1
      },
      {
        name: "Tolulope",
        post: "Student",
        review:
          "Great practical tutorial! The pattern recognition and risk management sections helped me set up my first successful trades on Bybit.",
        likes: 70,
        comments: 151,
        img: "/assets/tayo.png",
        daysAgo: 3
      }
    ],
    totalReviews: 700,
    introVideo: getIntroVideo(17)
  },
];

export const FiltersByTime: IFilterButton[] = [
  { filter: "Most Popular", isSelected: true },
  // { filter: "New", isSelected: false },
];
export const FiltersByType: IFilterButton[] = [
  { filter: "All Courses", isSelected: true, filterByType: true },
  // { filter: "Design", isSelected: false, filterByType: true },
  // { filter: "Programming", isSelected: false, filterByType: true },
  // { filter: "Data", isSelected: false, filterByType: true },
  // { filter: "Finance", isSelected: false, filterByType: true },
  // { filter: "Security", isSelected: false, filterByType: true },
];

export const Reasons: IReason[] = [
  {
    img: "/assets/one.png",
    head: "Regular Accessments",
    text: "We give our students real life accessments to help them improve their knowledge on core areas",
  },
  {
    img: "/assets/two.png",
    head: "On-site & Remote Learning",
    text: "We are fully an online learning platform but for special cases, we can go the extra mile to provide mentorship service",
  },
  {
    img: "/assets/three.png",
    head: "Certificate",
    text: "On graduation, every student will be awarded our prestigious certificate of completion",
  },
 
];

export const Testimonies: ITestimony[] = [
  {
    id: null,
    img: "/assets/mide.png",
    name: "Omotosho Mide",
    position: "Alumni",
    isActive: false,
    comment:
      "Definitely one of the best places to learn. I can say that I'm very confident with my skills in Trading ",
  },
  {
    id: null,
    img: "/assets/mike.png",
    name: "Micheal Ajala",
    position: "Alumni",
    isActive: true,
    comment:
      "I enjoyed each course from the first week. I got to practise in real trading  and this made me confident",
  },
  {
    id: null,
    img: "/assets/tayo.png",
    name: "Omotayo",
    position: "Student",
    isActive: false,
    comment:
      "Definitely one of the best places to learn. I can say that I'm very confident with my skills in now",
  },
];

export const Faqs: IFaq[] = [
  {
    id: null,
    question: "How many months will it take to complete a course?",
    showAnswer: true,
    answer:
      "Each course takes approximately 3-4 months to be complete after which you take a certification test and you're given a project to work on. Your classes .",
  },
  {
    id: null,
    question: "How long is the demo class each course?",
    showAnswer: false,
    answer:
      "The demo class for each course will last for approximately 7days, you are advised to make the best use of it.",
  },
  {
    id: null,
    question: "Do I get a recognized a certificate?",
    answer: "You get a recognized certificate after completing a course",
    showAnswer: false,
  },
  {
    id: null,
    question: "Will i'll be able to trade after completing a course?",
    showAnswer: false,
    answer:
      "Yes, you will be able to trade after completing the course",
  },
  {
    id: null,
    showAnswer: false,
    question: "Are onsite classes available?",
    answer:
      "Our services are fully online but if needs be that you need an onsite, contact our hotlines.",
  },
];

export const TeamMembers: ITeamMember[] = [
  {
    name: "James",
    image: "/assets/mike-team.png",
    post: "CEO",
    desc: "James has built a reputation in the trading ecosystem",
  },
  {
    name: "Matthew",
    image: "/assets/mike-team.png",
    post: "Head of Trading",
    desc: "Matthew has built a reputation in the trading community",
  },
  {
    name: "Dev. Micheal Ajala",
    image: "/assets/mike-team.png",
    post: "Head of Trading",
    desc: "Michael has built a reputation in the trading community",
  },
];

export const Contacts: IReachout[] = [
  {
    name: "Email",
    deet: "contact@jamescryptoguru.com",
    note: "You can send us an email and we'll get back to you.",
    svg: "email",
    link: "mailto:contact@jamescryptoguru.com",
  },
  {
    name: "Call",
    deet: "+234 813 556 7894",
    note: "Have more questions? call us anytime, anyday",
    svg: "phone",
    link: "tel:08149756765",
  },
  {
    name: "Meet Us",
    deet: "Unilag, Akoka, Lagos",
    note: "  Mon-Thur:  8:00AM - 4:00PM Fri :  8:00AM - 1:30PM",
    svg: "location",
    link: "https://maps.google.com?q=6.5158,3.3898",
  },
];

export interface ITab {
  num: number;
  name: string;
  isSelected: boolean;
}

export const Tabs: ITab[] = [
  { num: 0, name: "OVERVIEW", isSelected: true },
  { num: 1, name: "SYLLABUS", isSelected: false },
  { num: 2, name: "REQUIREMENTS", isSelected: false },
  { num: 3, name: "QUIZ", isSelected: false },
  { num: 4, name: "REVIEWS", isSelected: false },
 
];

export interface IEnrolledCourse {
  courseId: number;
  isFree: boolean;
  isPaid: boolean;
  plan : IPlan;
}
export interface IUser {
  name: string;
  email: string;
  enrolledCourses: IEnrolledCourse[] | null;
}
