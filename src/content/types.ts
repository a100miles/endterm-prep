export type Kind = 'single' | 'multiple' | 'boolean' | 'blank' | 'short';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export interface Topic { id: string; title: string; slides: string; definition: string; explanation: string; example: string; takeaways: string[]; misconception: string; terms: string[]; exam: string; code?: string; table?: string[][]; note?: string; reference?: string }
export interface Module { id: number; title: string; short: string; description: string; slides: number; file: string; topics: Topic[] }
export interface Question { id: string; module: number; topic: string; difficulty: Difficulty; type: Kind; source: 'From Flashcards' | 'Lecture-Based'; reference: string; prompt: string; options?: string[]; answer: string[]; explanation: string; distractors?: string[]; originalAnswer?: string; correction?: string }
