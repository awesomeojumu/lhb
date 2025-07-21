// forms.js

// ✅ Login Form
export const loginFields = [
  { name: "email", label: "Email", type: "email", rules: { required: "Email is required" } },
  { name: "password", label: "Password", type: "password", rules: { required: "Password is required" } },
];

// ✅ Register Form
export const registerFields = [
  { name: "firstName", label: "First Name", type: "text", rules: { required: "First name is required" } },
  { name: "lastName", label: "Last Name", type: "text", rules: { required: "Last name is required" } },
  { name: "email", label: "Email", type: "email", rules: { required: "Email is required" } },
  {
    name: "password",
    label: "Password",
    type: "password",
    rules: { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } }
  },
  { name: "battalion", label: "Battalion", type: "select", optionsKey: "battalions" },
];

// ✅ Profile Update Form
export const profileFields = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "sex", label: "Sex", type: "select", optionsKey: "sexOptions" },
  { name: "ageBracket", label: "Age Bracket", type: "select", optionsKey: "ageBrackets" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "battalion", label: "Battalion", type: "select", optionsKey: "battalions" },
  { name: "relationshipStatus", label: "Relationship Status", type: "select", optionsKey: "relationshipOptions" },
  { name: "weddingAnniversary", label: "Wedding Anniversary", type: "date" },
  { name: "address", label: "Address", type: "text" },
  { name: "country", label: "Country", type: "text" },
  { name: "personalityType", label: "Personality Type", type: "text" },
  { name: "fiveFoldGift", label: "5-Fold Ministry Gift", type: "select", optionsKey: "fiveFoldOptions" },
  { name: "leadershipRoles", label: "Leadership Roles", type: "multi-select", optionsKey: "leadershipRoles" },
  { name: "education", label: "Education", type: "select", optionsKey: "educationOptions" },
  { name: "jobStatus", label: "Job Status", type: "select", optionsKey: "jobStatusOptions" },
  { name: "incomeRange", label: "Income Range", type: "text" },
  { name: "purposeStatus", label: "Purpose Discovery Status", type: "select", optionsKey: "purposeStatusOptions" },
  { name: "primaryMountain", label: "Primary Mountain of Influence", type: "text" },
  { name: "secondaryMountain", label: "Secondary Mountain of Influence", type: "text" },
  { name: "purposeBootcampCompleted", label: "Completed Purpose Bootcamp", type: "checkbox" },
  { name: "discipleshipCompleted", label: "Completed Discipleship", type: "checkbox" },
  { name: "hasVoterCard", label: "Has Voter Card", type: "checkbox" },
  { name: "hasPassport", label: "Has Passport", type: "checkbox" },
  { name: "hasDriversLicense", label: "Has Driver’s License", type: "checkbox" },
];
