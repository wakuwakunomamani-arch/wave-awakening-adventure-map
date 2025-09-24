export enum Category {
  Morning = '朝',
  Daytime = '日中',
  Evening = '夜',
  Bonus = 'ボーナス',
}

export interface ChecklistItem {
  id: number;
  text: string;
  points: number;
  category: Category;
  theme?: string;
}

export interface Level {
  points: number;
  name: string;
  title: string;
  message: string;
}

export type Screen = 'checklist' | 'dashboard' | 'journal';