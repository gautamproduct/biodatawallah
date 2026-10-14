// Builds the sample portraits from DiceBear "Notionists" by Zoish (CC0 1.0 — free for commercial use, no attribution required).
// Run: node scripts/make-avatars.mjs  →  src/assets/samples/{girl,boy}-N.svg
import { createAvatar } from '@dicebear/core';
import { notionists } from '@dicebear/collection';
import { writeFileSync } from 'node:fs';

// Young, smiling, no beards or glasses; bright happy backgrounds.
const common = { glassesProbability: 0, gestureProbability: 0, bodyIconProbability: 0, beardProbability: 0, eyes: ['variant01'], nose: ['variant05'], scale: 112, translateY: 4 };
const people = {
  'girl-1': { hair: ['variant41'], body: ['variant11'], lips: ['variant03'], brows: ['variant02'], backgroundColor: ['ffc9d9'] }, // Priya
  'girl-2': { hair: ['variant23'], body: ['variant12'], lips: ['variant05'], brows: ['variant02'], backgroundColor: ['bdf0d4'] }, // Sana
  'girl-3': { hair: ['variant48'], body: ['variant21'], lips: ['variant03'], brows: ['variant02'], backgroundColor: ['dccfff'] }, // Sneha
  'girl-4': { hair: ['variant39'], body: ['variant05'], lips: ['variant05'], brows: ['variant02'], backgroundColor: ['ffd9b0'] }, // Neha (job)
  'boy-1': { hair: ['variant16'], body: ['variant13'], lips: ['variant03'], brows: ['variant01'], backgroundColor: ['c4e0ff'] }, // Rohan
  'boy-2': { hair: ['variant22'], body: ['variant20'], lips: ['variant05'], brows: ['variant01'], backgroundColor: ['b6efe6'] }, // Rahul
  'boy-3': { hair: ['variant15'], body: ['variant14'], lips: ['variant03'], brows: ['variant01'], backgroundColor: ['ffe99a'] }, // Ankit
  'boy-4': { hair: ['variant05'], body: ['variant19'], lips: ['variant05'], brows: ['variant01'], backgroundColor: ['ffc9d9'] }, // Amit (job)
};
for (const [name, opts] of Object.entries(people)) {
  writeFileSync(`src/assets/samples/${name}.svg`, createAvatar(notionists, { seed: name, ...common, ...opts }).toString());
}
console.log('avatars written');
