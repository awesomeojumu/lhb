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

