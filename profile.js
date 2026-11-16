// Edit portfolio facts here. Null fields are intentionally not presented as verified claims.
export const profile = {
  name: 'Bhavesh Sharma',
  introduction: 'Exploring the intersection of software, intelligence, and the physical world. Building products. Learning by doing.',
  education: 'BTech Computer Science · Newton School of Technology, S-VYASA University, Bengaluru',
  interests: ['AI / ML', 'Software engineering', 'Robotics', 'Product building'],
  skills: [], // Add only skills Bhavesh has confirmed, e.g. { name: '...', description: '...' }.
  github: 'https://github.com/bhavesh-210',
  linkedin: 'https://www.linkedin.com/in/bhavesh-sharma-405831373/',
  projects: [
    { name: 'AI Agent Ride Matcher', tag: 'ROAD INTELLIGENCE', description: 'Prioritizes road pickup ETA, filters unavailable drivers, and uses a deterministic fallback when an AI selection is invalid.', url: 'https://github.com/bhavesh-210/ai-agent-ride-matcher', gear: 'scanner' },
    { name: 'FilePilot AI', tag: 'IN PROGRESS', description: 'A privacy-first macOS file organizer project/concept exploring local processing, automatic organization, and review / undo controls.', url: 'https://github.com/bhavesh-210/filepilot-ai', gear: 'case' },
    { name: 'Alumini', tag: 'IN PROGRESS', description: 'An unfinished group project. Verified project details will be added here.', url: null, gear: 'radio' }
  ],
  contribution: { title: 'Fix crash in reports#show when reported content is deleted', description: 'Proposed a fallback for reports whose content has been deleted, preserved reportable type information, and added regression tests.', url: 'https://github.com/openSUSE/open-build-service/pull/20538', status: 'PULL REQUEST · CLOSED' }
};
