import { ChecklistItem, Category, Level } from './types';

export const ALL_ITEMS: ChecklistItem[] = [
  // Morning (2 items * 15 pts = 30)
  { id: 1, text: '朝日を浴びて深呼吸する', points: 15, category: Category.Morning },
  { id: 2, text: '感謝の気持ちを3つ書き出す', points: 15, category: Category.Morning },
  { id: 3, text: '白湯を一杯飲む', points: 15, category: Category.Morning },
  { id: 4, text: '軽いストレッチをする', points: 15, category: Category.Morning },

  // Daytime (4 items * 20 pts = 80)
  { id: 11, text: '10分間の瞑想をする', points: 20, category: Category.Daytime },
  { id: 12, text: '自然に触れる（植物、空など）', points: 20, category: Category.Daytime },
  { id: 13, text: '誰かに親切にする', points: 20, category: Category.Daytime },
  { id: 14, text: '健康的なランチを食べる', points: 20, category: Category.Daytime },
  { id: 15, text: 'クリエイティブな活動をする（5分以上）', points: 20, category: Category.Daytime },
  { id: 16, text: '意識的に水分補給をする', points: 20, category: Category.Daytime },
  { id: 17, text: 'ポジティブなアファメーションを唱える', points: 20, category: Category.Daytime },
  { id: 18, text: '学んだことを一つ記録する', points: 20, category: Category.Daytime },

  // Evening (2 items * 25 pts = 50)
  { id: 21, text: '今日一日を振り返り、良かったことを見つける', points: 25, category: Category.Evening },
  { id: 22, text: 'デジタルデトックス（就寝1時間前）', points: 25, category: Category.Evening },
  { id: 23, text: 'リラックスできる音楽を聴く', points: 25, category: Category.Evening },
  { id: 24, text: '翌日の簡単な計画を立てる', points: 25, category: Category.Evening },

  // Bonus (1 item * 40 pts = 40)
  // Total = 30 + 80 + 50 + 40 = 200
  { id: 101, text: 'シンクロニシティに気づき、記録する', points: 40, category: Category.Bonus },

  // --- Themed Items ---
  // Theme: 勇気 (Courage)
  { id: 201, text: '普段は選ばない選択肢を試してみる', points: 20, category: Category.Daytime, theme: '勇気' },
  { id: 202, text: '小さな不安に一歩踏み出してみる', points: 20, category: Category.Daytime, theme: '勇気' },
  
  // Theme: 受容 (Acceptance)
  { id: 301, text: '自分の感情をジャッジせず観察する', points: 20, category: Category.Daytime, theme: '受容' },
  { id: 302, text: '今日の「うまくいかなかった事」を許す', points: 20, category: Category.Daytime, theme: '受容' },

  // Theme: 愛 (Love)
  { id: 401, text: '自分自身の良いところを一つ見つけて褒める', points: 20, category: Category.Daytime, theme: '愛' },
  { id: 402, text: '身近な人や物に感謝のエネルギーを送る', points: 20, category: Category.Daytime, theme: '愛' },

  // Theme: 喜び (Joy)
  { id: 501, text: '子供のようにはしゃいでみる瞬間を作る', points: 20, category: Category.Daytime, theme: '喜び' },
  { id: 502, text: '「楽しい」「嬉しい」と声に出して言う', points: 20, category: Category.Daytime, theme: '喜び' },
  
  // Theme: 平和 (Peace)
  { id: 601, text: '5分間、ただ静かに座り、心を落ち着ける', points: 20, category: Category.Daytime, theme: '平和' },
  { id: 602, text: '窓の外の景色を眺め、心を空にする', points: 20, category: Category.Daytime, theme: '平和' },
];

export const ITEM_POOL: Record<Category, ChecklistItem[]> = {
  [Category.Morning]: ALL_ITEMS.filter(item => item.category === Category.Morning),
  [Category.Daytime]: ALL_ITEMS.filter(item => item.category === Category.Daytime),
  [Category.Evening]: ALL_ITEMS.filter(item => item.category === Category.Evening),
  [Category.Bonus]: ALL_ITEMS.filter(item => item.category === Category.Bonus),
};

export const LEVELS: Level[] = [
    { points: 0, name: '旅の始まり', title: '旅の始まり', message: '「さあ、冒険の始まりです！一つ一つの行動が、あなたの未来を輝せる光の種になりますよ。」' },
    { points: 200, name: '勇気', title: 'レベル【勇気】', message: '「素晴らしい！あなたは『勇気』の丘に到達しました。もう恐れはありません。新しい世界の扉を開ける力が、あなたの中に満ちています！」' },
    { points: 350, name: '受容', title: 'レベル【受容】', message: '「すごい！自分を丸ごと受け入れる『受容』の森にいますね。ありのままのあなたで完璧。自己肯定感が高まり、現実が優しくなり始めます。」' },
    { points: 500, name: '愛', title: 'レベル【愛】', message: '「おめでとうございます！見返りを求めない『愛』の山に登頂です。あなたの存在が周りを照らす太陽のよう。感謝とご縁がどんどん引き寄せられます。」' },
    { points: 540, name: '喜び', title: 'レベル【喜び】', message: '「最高です！感謝と喜びが湧き出る『喜び』の泉に到着しました。あなたの波動は超強力な磁石！シンクロニシティが止まらなくなりますよ！」' },
    { points: 600, name: '平和', title: 'レベル【平和】', message: '「ついにここまで来ましたね！至福の境地、『平和』の頂です。どんな出来事も穏やかに受け入れられるあなたに、宇宙は最大限のサポートを送ってくれます。」' },
];