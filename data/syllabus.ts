export type Chapter = {
  id: string;
  name: string;
  totalQuestions: number;
  class: 11 | 12;
};

export type Subject = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  chapters: Chapter[];
};

export const SYLLABUS: Subject[] = [
  {
    id: "physics",
    name: "Physics",
    emoji: "⚛️",
    color: "from-blue-600 to-indigo-700",
    // ✅ Official NTA NEET 2026 Physics Syllabus
    chapters: [
      // Class 11
      { id: "phy_1", name: "Physics and Measurement", totalQuestions: 40, class: 11 },
      { id: "phy_2", name: "Kinematics", totalQuestions: 50, class: 11 },
      { id: "phy_3", name: "Laws of Motion", totalQuestions: 55, class: 11 },
      { id: "phy_4", name: "Work, Energy and Power", totalQuestions: 55, class: 11 },
      { id: "phy_5", name: "Rotational Motion", totalQuestions: 60, class: 11 },
      { id: "phy_6", name: "Gravitation", totalQuestions: 50, class: 11 },
      { id: "phy_7", name: "Properties of Solids and Liquids", totalQuestions: 45, class: 11 },
      { id: "phy_8", name: "Thermodynamics", totalQuestions: 55, class: 11 },
      { id: "phy_9", name: "Kinetic Theory of Gases", totalQuestions: 45, class: 11 },
      { id: "phy_10", name: "Oscillations and Waves", totalQuestions: 60, class: 11 },
      // Class 12
      { id: "phy_11", name: "Electrostatics", totalQuestions: 65, class: 12 },
      { id: "phy_12", name: "Current Electricity", totalQuestions: 70, class: 12 },
      { id: "phy_13", name: "Magnetic Effects of Current and Magnetism", totalQuestions: 65, class: 12 },
      { id: "phy_14", name: "Electromagnetic Induction and Alternating Currents", totalQuestions: 60, class: 12 },
      { id: "phy_15", name: "Electromagnetic Waves", totalQuestions: 40, class: 12 },
      { id: "phy_16", name: "Optics", totalQuestions: 75, class: 12 },
      { id: "phy_17", name: "Dual Nature of Matter and Radiation", totalQuestions: 50, class: 12 },
      { id: "phy_18", name: "Atoms and Nuclei", totalQuestions: 55, class: 12 },
      { id: "phy_19", name: "Electronic Devices", totalQuestions: 50, class: 12 },
      { id: "phy_20", name: "Experimental Skills", totalQuestions: 30, class: 12 },
    ],
  },
  {
    id: "chemistry",
    name: "Chemistry",
    emoji: "🧪",
    color: "from-emerald-600 to-teal-700",
    // ✅ Official NTA NEET 2026 Chemistry Syllabus
    chapters: [
      // Class 11 - Physical Chemistry
      { id: "chem_1", name: "Some Basic Concepts of Chemistry", totalQuestions: 40, class: 11 },
      { id: "chem_2", name: "Structure of Atom", totalQuestions: 55, class: 11 },
      { id: "chem_3", name: "Classification of Elements and Periodicity", totalQuestions: 50, class: 11 },
      { id: "chem_4", name: "Chemical Bonding and Molecular Structure", totalQuestions: 65, class: 11 },
      { id: "chem_5", name: "States of Matter", totalQuestions: 45, class: 11 },
      { id: "chem_6", name: "Chemical Thermodynamics", totalQuestions: 60, class: 11 },
      { id: "chem_7", name: "Equilibrium", totalQuestions: 70, class: 11 },
      { id: "chem_8", name: "Redox Reactions", totalQuestions: 40, class: 11 },
      // Class 11 - Inorganic
      { id: "chem_9", name: "Hydrogen", totalQuestions: 35, class: 11 },
      { id: "chem_10", name: "s-Block Elements", totalQuestions: 45, class: 11 },
      { id: "chem_11", name: "p-Block Elements (Group 13 & 14)", totalQuestions: 55, class: 11 },
      // Class 11 - Organic
      { id: "chem_12", name: "Organic Chemistry – Basic Principles", totalQuestions: 60, class: 11 },
      { id: "chem_13", name: "Hydrocarbons", totalQuestions: 55, class: 11 },
      { id: "chem_14", name: "Environmental Chemistry", totalQuestions: 30, class: 11 },
      // Class 12 - Physical
      { id: "chem_15", name: "Solutions", totalQuestions: 55, class: 12 },
      { id: "chem_16", name: "Electrochemistry", totalQuestions: 60, class: 12 },
      { id: "chem_17", name: "Chemical Kinetics", totalQuestions: 60, class: 12 },
      { id: "chem_18", name: "Surface Chemistry", totalQuestions: 40, class: 12 },
      // Class 12 - Inorganic
      { id: "chem_19", name: "p-Block Elements (Group 15-18)", totalQuestions: 60, class: 12 },
      { id: "chem_20", name: "d and f Block Elements", totalQuestions: 55, class: 12 },
      { id: "chem_21", name: "Coordination Compounds", totalQuestions: 60, class: 12 },
      // Class 12 - Organic
      { id: "chem_22", name: "Haloalkanes and Haloarenes", totalQuestions: 50, class: 12 },
      { id: "chem_23", name: "Alcohols, Phenols and Ethers", totalQuestions: 55, class: 12 },
      { id: "chem_24", name: "Aldehydes, Ketones and Carboxylic Acids", totalQuestions: 65, class: 12 },
      { id: "chem_25", name: "Amines", totalQuestions: 50, class: 12 },
      { id: "chem_26", name: "Biomolecules", totalQuestions: 45, class: 12 },
      { id: "chem_27", name: "Polymers", totalQuestions: 35, class: 12 },
      { id: "chem_28", name: "Chemistry in Everyday Life", totalQuestions: 30, class: 12 },
    ],
  },
  {
    id: "biology",
    name: "Biology",
    emoji: "🧬",
    color: "from-rose-600 to-pink-700",
    // ✅ Official NTA NEET 2026 Biology Syllabus
    chapters: [
      // Class 11 - Diversity of Living Organisms
      { id: "bio_1", name: "The Living World", totalQuestions: 35, class: 11 },
      { id: "bio_2", name: "Biological Classification", totalQuestions: 50, class: 11 },
      { id: "bio_3", name: "Plant Kingdom", totalQuestions: 60, class: 11 },
      { id: "bio_4", name: "Animal Kingdom", totalQuestions: 65, class: 11 },
      // Class 11 - Structural Organisation
      { id: "bio_5", name: "Morphology of Flowering Plants", totalQuestions: 55, class: 11 },
      { id: "bio_6", name: "Anatomy of Flowering Plants", totalQuestions: 50, class: 11 },
      { id: "bio_7", name: "Structural Organisation in Animals", totalQuestions: 45, class: 11 },
      // Class 11 - Cell Structure
      { id: "bio_8", name: "Cell: The Unit of Life", totalQuestions: 70, class: 11 },
      { id: "bio_9", name: "Biomolecules", totalQuestions: 60, class: 11 },
      { id: "bio_10", name: "Cell Cycle and Cell Division", totalQuestions: 55, class: 11 },
      // Class 11 - Plant Physiology
      { id: "bio_11", name: "Transport in Plants", totalQuestions: 50, class: 11 },
      { id: "bio_12", name: "Mineral Nutrition", totalQuestions: 40, class: 11 },
      { id: "bio_13", name: "Photosynthesis in Higher Plants", totalQuestions: 70, class: 11 },
      { id: "bio_14", name: "Respiration in Plants", totalQuestions: 55, class: 11 },
      { id: "bio_15", name: "Plant Growth and Development", totalQuestions: 50, class: 11 },
      // Class 11 - Human Physiology
      { id: "bio_16", name: "Digestion and Absorption", totalQuestions: 60, class: 11 },
      { id: "bio_17", name: "Breathing and Exchange of Gases", totalQuestions: 55, class: 11 },
      { id: "bio_18", name: "Body Fluids and Circulation", totalQuestions: 65, class: 11 },
      { id: "bio_19", name: "Excretory Products and Elimination", totalQuestions: 60, class: 11 },
      { id: "bio_20", name: "Locomotion and Movement", totalQuestions: 55, class: 11 },
      { id: "bio_21", name: "Neural Control and Coordination", totalQuestions: 65, class: 11 },
      { id: "bio_22", name: "Chemical Coordination and Integration", totalQuestions: 60, class: 11 },
      // Class 12 - Reproduction
      { id: "bio_23", name: "Sexual Reproduction in Flowering Plants", totalQuestions: 65, class: 12 },
      { id: "bio_24", name: "Human Reproduction", totalQuestions: 70, class: 12 },
      { id: "bio_25", name: "Reproductive Health", totalQuestions: 45, class: 12 },
      // Class 12 - Genetics
      { id: "bio_26", name: "Principles of Inheritance and Variation", totalQuestions: 75, class: 12 },
      { id: "bio_27", name: "Molecular Basis of Inheritance", totalQuestions: 80, class: 12 },
      { id: "bio_28", name: "Evolution", totalQuestions: 60, class: 12 },
      // Class 12 - Biology in Human Welfare
      { id: "bio_29", name: "Human Health and Disease", totalQuestions: 65, class: 12 },
      { id: "bio_30", name: "Microbes in Human Welfare", totalQuestions: 50, class: 12 },
      // Class 12 - Biotechnology
      { id: "bio_31", name: "Biotechnology: Principles and Processes", totalQuestions: 70, class: 12 },
      { id: "bio_32", name: "Biotechnology and Its Applications", totalQuestions: 60, class: 12 },
      // Class 12 - Ecology
      { id: "bio_33", name: "Organisms and Populations", totalQuestions: 55, class: 12 },
      { id: "bio_34", name: "Ecosystem", totalQuestions: 60, class: 12 },
      { id: "bio_35", name: "Biodiversity and Conservation", totalQuestions: 55, class: 12 },
    ],
  },
];