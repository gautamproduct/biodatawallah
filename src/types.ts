export type Lang = 'en' | 'hi' | 'mr';
export type Purpose = 'marriage' | 'job' | 'general';
export type Community = 'hindu' | 'jain' | 'muslim' | 'sikh' | 'christian' | 'other';
export type Gender = 'female' | 'male';

/** Text in all three languages. */
export type T3 = Record<Lang, string>;

export type FieldType = 'text' | 'date' | 'time' | 'select' | 'tel' | 'textarea';

export interface Field {
  id: string;
  /** Built-in key (label and options come from i18n), or null for a custom field. */
  key: string | null;
  /** User-edited label; overrides the built-in label. */
  label?: string;
  value: string;
  hidden: boolean;
}

export type SectionKind = 'fields' | 'text' | 'list';

export interface Section {
  id: string;
  key: string | null;
  title?: string;
  kind: SectionKind;
  fields: Field[];
  /** For 'text' and 'list' sections. */
  body: string;
  hidden: boolean;
}

export interface Doc {
  id: string;
  version: 1;
  purpose: Purpose;
  lang: Lang;
  community: Community;
  gender: Gender;
  topLine: string;
  heading: string;
  sections: Section[];
  photo: string | null;
  showPhoto: boolean;
  template: string;
  color: string | null;
  traits: string[];
  hobbies: string;
  writerVariant: number;
  /** Last auto-written text per section key; if the body still equals it, it keeps updating as details change. */
  auto?: Record<string, string>;
  updatedAt: number;
}
