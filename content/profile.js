/**
 * Homepage and site-wide copy. Edit this file to update what the site says
 * about you; components read from here rather than hard-coding text.
 */

export const profile = {
  name: 'Neel Patel',
  role: 'Security Engineer',
  headline: 'Security Engineer, building safer software',
  description:
    'Neel Patel is a security engineer and researcher specializing in application, mobile and cloud security, reverse engineering and threat modeling.',
  location: 'India / UTC+5:30',
  /** LinkedIn is the primary contact method. `github` shows a GitHub link in the hero and contact sections (null hides it). */
  links: {
    linkedin: 'https://www.linkedin.com/in/neel929/',
    github: 'https://github.com/0xl33n',
  },
  availability: 'available',
  quickFacts: ['India / UTC+5:30', 'web / mobile / cloud', 'reverse engineering'],
};

/** "neofetch" card rows. */
export const systemInfo = [
  { label: 'OS', value: 'Human v10.4 (engineer build)' },
  { label: 'Host', value: 'Security Engineering / Remote' },
  { label: 'Role', value: 'Security Engineer + Researcher' },
  { label: 'Shell', value: 'zsh, nvim, tmux' },
  { label: 'Stack', value: 'Python, C/C++, Swift, Go, Rust, JS' },
  { label: 'Focus', value: 'AppSec, mobile, cloud, RE, threat modeling' },
  { label: 'Status', value: profile.availability, isHighlighted: true },
];

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} role
 * @property {string} organization
 * @property {string} [formerName] - Shown as "(formerly …)".
 * @property {string} period
 * @property {string} location
 * @property {string[]} highlights
 */

/** @type {ExperienceEntry[]} */
export const experience = [
  {
    role: 'Security Engineer',
    organization: 'Bureau Veritas Cybersecurity NAM',
    formerName: 'Security Innovation Inc.',
    period: 'Aug 2023 – Jan 2026',
    location: 'Seattle, WA',
    highlights: [
      'Led and executed 40+ security assessments of web, cloud and mobile services for the world’s largest cloud provider, identifying critical vulnerabilities and verifying adherence to industry security standards.',
      'Built custom automation, including Burp Suite extensions and Scapy-based network tooling (e.g. exploiting IPv6 tunneling vulnerabilities), for project-specific challenges.',
      'Performed threat model reviews and in-depth manual code review, producing test plans, problem reports and actionable remediation guidance.',
      'Researched iOS application decryption for apps requiring newer iOS versions, built iOS tweaks, and reverse engineered apps built on custom and cross-platform frameworks such as Flutter.',
    ],
  },
];

export const education = [
  {
    degree: 'M.S. Computer Science',
    school: 'The University of Texas at Dallas',
    period: 'Aug 2021 – May 2023',
    coursework:
      'Data & Applications Security, Network Security, System Security & Malicious Code Analysis, Information Security, Advanced Operating Systems, Computer Architecture',
  },
];

export const award = {
  title: 'NSA Codebreaker Challenge',
  year: '2022',
  badge: '9 / 9 completed',
  summary:
    'Completed all 9/9 NSA Codebreaker challenges for The University of Texas at Dallas, working through progressively harder problems involving reverse engineering, digital forensics, network protocols, cryptanalysis and vulnerability research. One of 104 student solvers that year.',
  details:
    'Each challenge started from an unfamiliar binary, protocol or artifact, and solving it meant writing my own scripts and tooling to take it apart.',
  tags: ['9 / 9', 'Reverse Engineering', 'Forensics', 'Crypto', 'Vulnerability Research'],
  /** Photos in public/awards/ (web-ready WebP, metadata stripped). `small` is shown at its `width`×`height`; `large` opens on click. */
  photos: [
    {
      small: '/awards/nsa-medallion-front-480.webp',
      large: '/awards/nsa-medallion-front-1000.webp',
      width: 480,
      height: 597,
      alt: 'NSA medallion, front: the National Security Agency eagle seal, in its open wooden case',
      caption: 'medallion · front',
    },
    {
      small: '/awards/nsa-medallion-back-480.webp',
      large: '/awards/nsa-medallion-back-1000.webp',
      width: 480,
      height: 601,
      alt: 'NSA medallion, back: "Codebreaker Challenge" around a spiral of hex bytes, in its open wooden case',
      caption: 'medallion · back',
    },
  ],
  letter: {
    href: '/awards/nsa-codebreaker-letter.webp',
    label: 'letter from the NSA Director',
  },
};

/**
 * @typedef {Object} SkillGroup
 * @property {string} index - Display number, e.g. "01".
 * @property {string} label
 * @property {string[]} items
 * @property {boolean} [isFullWidth] - Spans both columns of the stack grid.
 */

/** @type {SkillGroup[]} */
export const skillGroups = [
  {
    index: '01',
    label: 'languages',
    items: ['Python', 'C/C++', 'Assembly', 'Go', 'Rust', 'Java', 'Swift', 'Objective-C', 'JavaScript', 'SQL'],
  },
  {
    index: '02',
    label: 'security',
    items: [
      'Application Security',
      'API Security',
      'Mobile Security',
      'iOS Security',
      'Reverse Engineering',
      'Binary Analysis',
      'Threat Modeling',
      'Cloud Security',
      'Network Security',
      'Web Security',
    ],
  },
  {
    index: '03',
    label: 'tools & platforms',
    isFullWidth: true,
    items: ['Burp Suite', 'Ghidra', 'IDA Pro', 'Frida', 'LLDB', 'Wireshark', 'Nmap', 'Scapy', 'Docker', 'AWS'],
  },
];
