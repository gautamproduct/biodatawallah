// Builds the sample portraits from DiceBear "Notionists" by Zoish (CC0 1.0 — free for commercial use, no attribution required).
// Run: node scripts/make-avatars.mjs   →   src/assets/samples/{girl,boy}-N.svg
import { createAvatar } from '@dicebear/core';
import { notionists } from '@dicebear/collection';
import { writeFileSync } from 'node:fs';

const common = { glassesProbability: 0, gestureProbability: 0, bodyIconProbability: 0, beardProbability: 0, eyes: ['variant01'], nose: ['variant05'], scale: 112, translateY: 4 };
const people = {
  'girl-1': { hair: ['variant41'], body: ['variant11'], lips: ['variant03'], brows: ['variant02'], backgroundColor: ['f6dfe4'] }, // Priya
  'girl-2': { hair: ['variant23'], body: ['variant12'], lips: ['variant05'], brows: ['variant02'], backgroundColor: ['dcece4'] }, // Sana
  'girl-3': { hair: ['variant48'], body: ['variant21'], lips: ['variant03'], brows: ['variant04'], backgroundColor: ['ece2f1'] }, // Sneha
  'girl-4': { hair: ['variant39'], body: ['variant05'], lips: ['variant13'], brows: ['variant02'], backgroundColor: ['e7e3f2'] }, // Neha (job)
  'boy-1': { hair: ['variant16'], body: ['variant13'], lips: ['variant03'], brows: ['variant01'], backgroundColor: ['dfe9e1'] }, // Rohan
  'boy-2': { hair: ['variant22'], body: ['variant20'], lips: ['variant05'], brows: ['variant01'], backgroundColor: ['e3e6f2'] }, // Rahul
  'boy-3': { hair: ['variant25'], body: ['variant14'], lips: ['variant03'], brows: ['variant03'], backgroundColor: ['f2e6d8'] }, // Ankit
  'boy-4': { hair: ['variant35'], body: ['variant19'], lips: ['variant13'], brows: ['variant01'], backgroundColor: ['dfe8f1'] }, // Amit (job)
};
for (const [name, opts] of Object.entries(people)) {
  const svg = createAvatar(notionists, { seed: name, ...common, ...opts }).toString();
  writeFileSync(`src/assets/samples/${name}.svg`, svg);
}
console.log('avatars written');
