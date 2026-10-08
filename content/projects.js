/**
 * Projects shown in the homepage "Work" section. A project can point to a
 * writeup in content/writeups/ via `writeup`, which makes its card a link.
 *
 * @typedef {Object} Project
 * @property {string} id - Unique key.
 * @property {string} name - Card title; a trailing `/` is added when rendered.
 * @property {string} description - One-sentence summary.
 * @property {string[]} highlights - What was built / done, shown as bullets.
 * @property {string} type - Badge text, e.g. "research".
 * @property {string} [period] - Shown in the card header, e.g. "Jul 2024".
 * @property {string[]} tags - The 4th tag is highlighted.
 * @property {string} [writeup] - Slug of a writeup (file name in content/writeups/ without .md).
 * @property {boolean} [isFeatured] - Spans the full width of the grid.
 */

/** @type {Project[]} */
export const projects = [
  {
    id: 'flutter-reverse-engineering',
    name: 'flutter-reverse-engineering',
    description:
      'Reverse engineered Flutter/Dart AOT applications using memory dumps, Ghidra and runtime analysis to recover useful program structure.',
    highlights: [
      'Wrote a white paper on reverse engineering iOS Flutter applications.',
      'Used Ghidra scripting to disassemble Flutter app binaries, extract metadata and patch the application binary.',
      'Resolved code and data references in disassembly and handled the Dart VM’s custom stack for accurate decompilation.',
    ],
    type: 'research',
    period: 'Jul 2024',
    tags: ['Flutter', 'Ghidra', 'Dart AOT'],
    writeup: 'flutter-reverse-engineering',
    isFeatured: true,
  },
  {
    id: 'binary-analysis',
    name: 'binary-analysis',
    description:
      'Low-level security research across binary exploitation, reverse engineering and unfamiliar execution environments.',
    highlights: [
      'Built custom disassembly and analysis tooling for instrumentation and binary introspection.',
      'Performed data-flow analysis, ELF binary modification, code injection and symbolic execution to instrument and manipulate binaries at runtime.',
    ],
    type: 'research',
    period: 'Feb 2023',
    tags: ['C/C++', 'ASM', 'IDA'],
  },
  {
    id: 'security-tooling',
    name: 'security-tooling',
    description:
      'Custom Python tooling, Burp extensions and Scapy workflows for repeatable security testing, protocol research and assessment automation.',
    highlights: [
      'Burp Suite extensions for complex, project-specific web and API testing challenges.',
      'Scapy-based scripts for network penetration testing, including exploiting IPv6 tunneling vulnerabilities.',
      'Automation reused across assessments of web, cloud and mobile services.',
    ],
    type: 'internal',
    tags: ['Python', 'Burp', 'Scapy'],
  },
];
