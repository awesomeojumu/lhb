// roles.js

// ✅ Dropdown options (used by SelectInput)
export const sexOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

export const ageBrackets = [
  { value: "18-25", label: "18-25" },
  { value: "26-35", label: "26-35" },
  { value: "36-45", label: "36-45" },
  { value: "46-60", label: "46-60" },
  { value: "60+", label: "60+" },
];

export const battalions = [
  { value: "Alpha", label: "Alpha" },
  { value: "Bravo", label: "Bravo" },
  { value: "Charlie", label: "Charlie" },
  { value: "Delta", label: "Delta" },
];

export const leadershipRoles = [
  { value: "Team Leader", label: "Team Leader" },
  { value: "Trainer", label: "Trainer" },
  { value: "Mentor", label: "Mentor" },
  { value: "Coordinator", label: "Coordinator" },
];

// ✅ Newly Added Dropdowns
export const relationshipOptions = [
  { value: "Single", label: "Single" },
  { value: "Engaged", label: "Engaged" },
  { value: "Married", label: "Married" },
];

export const fiveFoldOptions = [
  { value: "Apostle", label: "Apostle" },
  { value: "Pastor", label: "Pastor" },
  { value: "Evangelist", label: "Evangelist" },
  { value: "Teacher", label: "Teacher" },
  { value: "Prophet", label: "Prophet" },
];

export const educationOptions = [
  { value: "SSCE", label: "SSCE" },
  { value: "OND", label: "OND" },
  { value: "HND", label: "HND" },
  { value: "Bachelors", label: "Bachelors" },
  { value: "Masters", label: "Masters" },
  { value: "PhD", label: "PhD" },
];

export const jobStatusOptions = [
  { value: "Employed", label: "Employed" },
  { value: "Self Employed", label: "Self Employed" },
  { value: "Contract", label: "Contract" },
  { value: "Unemployed", label: "Unemployed" },
];

export const purposeStatusOptions = [
  { value: "Discovered", label: "Discovered" },
  { value: "Not Yet Discovered", label: "Not Yet Discovered" },
  { value: "In Progress", label: "In Progress" },
];

// ✅ RBAC Role Arrays
export const roles = {
  commander: ["commander"],
  commando: ["commander", "commando"],
  specialForce: ["specialForce", "commander", "commando"],
  globalSoldier: ["globalSoldier", "specialForce", "commander", "commando"],
};

export const roleOptions = [
  { value: "commander", label: "Commander" },
  { value: "commando", label: "Commando" },
  { value: "specialForce", label: "Special Force" },
  { value: "globalSoldier", label: "Global Soldier" },
];
