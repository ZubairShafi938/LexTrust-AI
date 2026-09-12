// The checklist LexTrust evaluates every incoming document against.
// In a production build this would be loaded per document-type / jurisdiction
// (e.g. from a policy library) rather than hard-coded — swap this module out
// without touching any of the agents below.

module.exports = [
  {
    id: 1,
    text: "Purpose limitation is defined",
    keywords: ["purpose"],
    weight: 1,
  },
  {
    id: 2,
    text: "Data minimization obligation present",
    keywords: ["minimization", "necessary", "minimum"],
    weight: 1,
  },
  {
    id: 3,
    text: "Encryption required at rest & in transit",
    keywords: ["encryption", "encrypted"],
    weight: 1,
  },
  {
    id: 4,
    text: "Sub-processor notice obligation",
    keywords: ["sub-processor", "subprocessor", "notice"],
    weight: 1,
  },
  {
    id: 5,
    text: "Breach notification timeline specified",
    keywords: ["breach"],
    weight: 1,
    penalizeIfVague: ["without undue delay"],
  },
  {
    id: 6,
    text: "Data subject rights procedure defined",
    keywords: ["subject rights", "data subject"],
    weight: 1,
    penalizeIfPlaceholder: true,
  },
  {
    id: 7,
    text: "International transfer mechanism named",
    keywords: ["transfer", "jurisdiction"],
    weight: 1,
    penalizeIfVague: ["approved transfer mechanism"],
  },
];
