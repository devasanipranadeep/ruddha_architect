import hero from "@/assets/hero.jpg";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";
import about from "@/assets/about.jpeg";

export const SITE = {
  name: "Ruddhaa",
  full: "Ruddhaa Architects & Interiors",
  tagline: "Architecture of stillness. Interiors of intent.",
  description:
    "Ruddhaa Architects & Interiors crafts cinematic residential, commercial and landscape spaces where light, material and stillness become architecture.",
  email: "ruddha.arch@gmail.com",
  phone: "+91 9490324626",
  address: "Kashibugga, Warangal, Telangana",
  social: { instagram: "#", linkedin: "#", behance: "#" },
};

export const IMAGES = { hero, about, p1, p2, p3, p4, p5, p6 };

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
] as const;

export const SERVICES = [
  {
    n: "01",
    title: "Architecture",
    blurb:
      "Residences, villas and commercial volumes designed around light, climate and ritual.",
  },
  {
    n: "02",
    title: "Interior Design",
    blurb:
      "Curated interiors where every material, joint and shadow is intentional.",
  },
  {
    n: "03",
    title: "Landscape",
    blurb:
      "Gardens, courtyards and water bodies that extend the architecture outward.",
  },
  {
    n: "04",
    title: "Renovation",
    blurb:
      "Heritage and modern restorations that respect memory and rewrite function.",
  },
  {
    n: "05",
    title: "Turnkey Build",
    blurb:
      "From sketch to handover — a single accountable studio across every trade.",
  },
  {
    n: "06",
    title: "Consulting",
    blurb:
      "Feasibility, master-planning and material strategy for ambitious clients.",
  },
];

export const PROJECTS = [
  { slug: "casa-aether", title: "Casa Aether", category: "Residential", location: "Coorg, IN", year: "2024", image: p1, tall: true },
  { slug: "noir-kitchen", title: "Noir Kitchen", category: "Interior Design", location: "Bengaluru", year: "2024", image: p2 },
  { slug: "veil-hotel", title: "The Veil Hotel", category: "Commercial", location: "Goa", year: "2023", image: p3, tall: true },
  { slug: "midnight-suite", title: "Midnight Suite", category: "Interior Design", location: "Mumbai", year: "2024", image: p4, tall: true },
  { slug: "palm-court", title: "Palm Court", category: "Landscape", location: "Hyderabad", year: "2023", image: p5 },
  { slug: "the-archive", title: "The Archive", category: "Renovation", location: "Chennai", year: "2022", image: p6 },
];

export const CATEGORIES = [
  "All",
  "Architecture",
  "Interior Design",
  "Landscape",
  "Renovation",
  "Turnkey Build",
  "Consulting",
] as const;

export const STATS = [
  { n: 142, suffix: "+", label: "Projects Delivered" },
  { n: 18, suffix: "", label: "Years of Practice" },
  { n: 27, suffix: "", label: "Design Awards" },
  { n: 96, suffix: "%", label: "Repeat Clients" },
];

export const PROCESS = [
  { n: "01", title: "Discovery", text: "We listen. Site visits, briefs, and the quiet questions that shape a brief." },
  { n: "02", title: "Concept", text: "Sketches become language — volumes, light, material, choreography." },
  { n: "03", title: "Design Development", text: "Drawings, BIM, samples. Every joint resolved before site." },
  { n: "04", title: "Build", text: "Trusted contractors, weekly site stewardship, uncompromising finishes." },
  { n: "05", title: "Handover", text: "We hand you a space — and a manual to live in it for decades." },
];

export const TESTIMONIALS = [
  {
    quote: "Ruddhaa didn't design a house. They designed how we wake up, how light enters, how we host. Architecture as a quiet, daily ritual."
  },
  {
    quote: "Every detail considered, every promise kept. Eighteen months on site without a single argument — a rare kind of partnership."
  },
  {
    quote: "Their restraint is their signature. The studio removes more than it adds, and what remains feels inevitable."
  },
];
