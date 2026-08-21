export type LearningMode = "group" | "personal";

export interface CourseFee {
  label: string;
  price: string;
  note: string;
}

export interface PublicCourse {
  slug: string;
  title: string;
  level: string;
  intro: string;
  about?: string;
  includes: string[];
  learn: string[];
  durationTitle: string;
  durationNote: string;
  eligibilityTitle: string;
  eligibilityNote: string;
  group: CourseFee | null;
  personal: CourseFee | null;
  thumbnail: string;
}

const beginnerLearn = [
  "Basic posture and alignment",
  "Simple combinations (Tukdas)",
  "Introduction to Tatkar (basic footwork)",
  "Introduction to Abhinaya (expressions)",
  "Hand movements (Hastas)",
  "Stage presence and confidence building",
  "Basic spins (Chakkars)",
  "Discipline, grace and overall personality development",
  "Rhythm and Taal (Theka understanding)",
];

const coreIncludes = [
  "Regular Online/Offline Classes",
  "Recorded Sessions",
  "Real-world Projects",
  "Topic-wise PDF notes",
  "Assignment & Feedback",
  "Monthly Progress Evaluation",
  "Quiz at the end of every course",
  "Certificate of Completion",
];

export const publicCourses: PublicCourse[] = [
  {
    slug: "beginner-foundation",
    title: "Beginner – Foundation Level",
    level: "Beginner",
    intro:
      "A structured introduction to Jaipur Gharana Kathak. Build posture, rhythm, and grace through guided practice — with no prior dance experience required.",
    about:
      "The Beginner – Foundation Level is designed for students who are new to Kathak. This course lays a strong foundation in basic movements, rhythm, and expressions, helping you build confidence and grace in dance.",
    includes: [
      "Regular Online / Offline Classes",
      "Assignments & Feedback",
      "Structured Curriculum",
      "Monthly Progress Evaluation",
      "Practice Videos",
      "Exam at the end of the course",
      "Study Material (PDF Notes)",
      "Certificate of Completion",
    ],
    learn: beginnerLearn,
    durationTitle: "3 Months (12 Weeks Program)",
    durationNote: "2 – 3 classes per week (depending on batch)",
    eligibilityTitle: "Anyone above 5 years",
    eligibilityNote: "No prior dance experience required",
    group: { label: "Online Group Classes", price: "$ 2200 / month", note: "10 classes per month" },
    personal: { label: "Personal One-to-One Classes", price: "$ 400 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "beginner-prarambhik",
    title: "Beginner – Prarambhik Batch",
    level: "Beginner",
    intro:
      "The Prarambhik batch takes first steps in Kathak — tatkar, hastas, and simple compositions — at a pace designed for new learners.",
    includes: coreIncludes,
    learn: beginnerLearn,
    durationTitle: "3 Months (12 Weeks Program)",
    durationNote: "2 – 3 classes per week (depending on batch)",
    eligibilityTitle: "Anyone above 5 years",
    eligibilityNote: "No prior dance experience required",
    group: { label: "Online Group Classes", price: "$ 2200 / month", note: "10 classes per month" },
    personal: { label: "Personal One-to-One Classes", price: "$ 400 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "intermediate-madhyama",
    title: "Intermediate – Madhyama Level",
    level: "Intermediate",
    intro:
      "Deepen technique with longer compositions, faster chakkars, and richer abhinaya. Madhyama is for students ready to move beyond the foundation.",
    includes: coreIncludes,
    learn: [
      "Intermediate tatkar and tihai patterns",
      "Expanded hasta vocabulary",
      "Chakkars with control and stamina",
      "Toda, tukda and paran structures",
      "Abhinaya for short bandish",
      "Stage presence and group coordination",
      "Rhythm complexity across taals",
      "Performance etiquette and discipline",
    ],
    durationTitle: "6 Months Program",
    durationNote: "2 – 3 classes per week (depending on batch)",
    eligibilityTitle: "Foundation / Prarambhik complete",
    eligibilityNote: "Or equivalent prior Kathak training",
    group: { label: "Online Group Classes", price: "$ 2200 / month", note: "10 classes per month" },
    personal: { label: "Personal One-to-One Classes", price: "$ 400 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "intermediate-progression",
    title: "Intermediate – Progression Batch",
    level: "Intermediate",
    intro:
      "A progression batch for students consolidating Madhyama skills — more repertoire, sharper footwork, and guided performance preparation.",
    includes: coreIncludes,
    learn: [
      "Refined tatkar and speed work",
      "Composition building",
      "Abhinaya and storytelling",
      "Taal theory applied in class",
      "Stage choreography basics",
      "Stamina and chakkar endurance",
      "Exam-oriented practice",
      "Confidence for recitals",
    ],
    durationTitle: "6 Months Program",
    durationNote: "2 – 3 classes per week (depending on batch)",
    eligibilityTitle: "Foundation complete",
    eligibilityNote: "Teacher assessment recommended",
    group: { label: "Online Group Classes", price: "$ 2200 / month", note: "10 classes per month" },
    personal: { label: "Personal One-to-One Classes", price: "$ 400 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "advanced-visharad",
    title: "Advanced – Visharad Level",
    level: "Advanced",
    intro:
      "Visharad-level training for serious practitioners — complex layakari, full-length presentations, and the artistry of Jaipur Gharana.",
    includes: coreIncludes,
    learn: [
      "Advanced layakari and upaj",
      "Full-length traditional repertoire",
      "Abhinaya for thumri and bhajan",
      "Choreographic thinking",
      "Performance stamina",
      "Teaching fundamentals",
      "Exam and stage readiness",
      "Gharana aesthetics in depth",
    ],
    durationTitle: "12 Months Program",
    durationNote: "2 – 3 classes per week (depending on batch)",
    eligibilityTitle: "Intermediate / Madhyama complete",
    eligibilityNote: "Faculty approval required",
    group: { label: "Online Group Classes", price: "$ 2200 / month", note: "10 classes per month" },
    personal: { label: "Personal One-to-One Classes", price: "$ 400 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "advanced-performance",
    title: "Advanced – Performance Batch",
    level: "Advanced",
    intro:
      "A performance-focused batch for students preparing recitals, competitions, and stage work under close faculty direction.",
    includes: coreIncludes,
    learn: [
      "Stage choreography and spacing",
      "Costume, makeup and presentation",
      "Solo and group repertoire",
      "Musicality with live / recorded taal",
      "Abhinaya for the audience",
      "Rehearsal discipline",
      "Competition preparation",
      "Artist mindset and stamina",
    ],
    durationTitle: "6 Months Program",
    durationNote: "2 – 3 classes per week plus rehearsals",
    eligibilityTitle: "Intermediate complete",
    eligibilityNote: "Audition / faculty recommendation",
    group: { label: "Online Group Classes", price: "$ 2200 / month", note: "10 classes per month" },
    personal: { label: "Personal One-to-One Classes", price: "$ 400 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "ladies",
    title: "Ladies Wellness Batch",
    level: "Wellness",
    intro:
      "For women who wish to learn Kathak for physical fitness, mental well-being, stress relief, confidence, and self-expression.",
    includes: [
      "Live online group classes",
      "Optional one-on-one sessions",
      "Gentle, age-inclusive pacing",
      "Focus on fitness and posture",
      "Breath, grace and expression",
      "Supportive women-only space",
      "Progress check-ins",
      "Certificate of completion",
    ],
    learn: [
      "Improves physical fitness & flexibility",
      "Reduces stress & promotes mental well-being",
      "Builds confidence and self-expression",
      "Foundational Kathak posture and footwork",
      "Simple hastas and chakkars",
      "Rhythm awareness for well-being",
    ],
    durationTitle: "Ongoing monthly batch",
    durationNote: "8 classes per month",
    eligibilityTitle: "Women, all ages",
    eligibilityNote: "No prior dance experience required",
    group: { label: "Group Classes (Online)", price: "₹2200 / month", note: "8 classes per month" },
    personal: { label: "Personal (One-on-One) Classes", price: "₹700 / class", note: "Minimum 4 classes per month" },
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "kids",
    title: "Kids Batch (Age 5+)",
    level: "Kids",
    intro:
      "A fun and structured Kathak program designed for children to build a strong foundation while enjoying the learning process.",
    includes: [
      "Live online group classes",
      "Age-appropriate syllabus",
      "Practice videos for home",
      "Playful rhythm games",
      "Monthly progress notes for parents",
      "Recital opportunities",
      "Certificate of completion",
    ],
    learn: [
      "Builds rhythm and coordination",
      "Improves focus and concentration",
      "Basic postures and tatkar",
      "Simple hastas and stories",
      "Confidence on camera / stage",
      "Joy of classical movement",
    ],
    durationTitle: "Ongoing monthly batch",
    durationNote: "10 classes per month",
    eligibilityTitle: "Age 5+",
    eligibilityNote: "No prior dance experience required",
    group: { label: "Group Classes (Online)", price: "₹2200 / month", note: "10 classes per month" },
    personal: null,
    thumbnail: "/courses-page/hero-layer.png",
  },
  {
    slug: "hobby",
    title: "Hobby Kathak Batch",
    level: "Hobby",
    intro:
      "Learn Kathak at your own pace for passion, culture and personal growth — without exam pressure.",
    includes: [
      "Flexible class pacing",
      "Focus on traditional art & culture",
      "Grace, posture and expressions",
      "Recorded support material",
      "Community practice",
    ],
    learn: [
      "Learn at your own pace",
      "Focus on traditional art & culture",
      "Improve grace, posture & expressions",
      "Foundational tatkar and hastas",
      "Cultural context of Kathak",
    ],
    durationTitle: "Flexible program",
    durationNote: "Schedule as per your convenience",
    eligibilityTitle: "All ages",
    eligibilityNote: "Passion to learn is enough",
    group: { label: "Flexible Hobby Batch", price: "₹2200 / month", note: "Learn at your own pace" },
    personal: null,
    thumbnail: "/courses-page/hero-layer.png",
  },
];

export function getPublicCourse(slug: string) {
  return publicCourses.find((course) => course.slug === slug);
}

export function getPublicCourseSlugs() {
  return publicCourses.map((course) => course.slug);
}
