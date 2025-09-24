import React, { useState, useMemo, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ALL_ITEMS, ITEM_POOL, LEVELS } from './constants';
import { Level, Screen, Category, ChecklistItem } from './types';
import ChecklistScreen from './components/ChecklistScreen';
import DashboardScreen from './components/DashboardScreen';
import JournalScreen from './components/JournalScreen';
import BottomNav from './components/BottomNav';
import LevelUpModal from './components/LevelUpModal';

// Shuffles an array in place and returns it
const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generates a unique list of items for the day, including a themed item
const generateDailyList = (pointsAtStartOfDay: number): number[] => {
  const currentLevel = [...LEVELS].reverse().find(l => pointsAtStartOfDay >= l.points) || LEVELS[0];
  const nextLevelIndex = LEVELS.findIndex(l => l.name === currentLevel.name) + 1;
  const nextLevel = LEVELS[nextLevelIndex];

  let themedItems: ChecklistItem[] = [];
  if (nextLevel) {
    const theme = nextLevel.name;
    const themedPool = ALL_ITEMS.filter(item => item.theme === theme);
    if (themedPool.length > 0) {
      themedItems = shuffleArray([...themedPool]).slice(0, 1); // Pick one themed item
    }
  }

  const themedItemIds = themedItems.map(item => item.id);
  
  const createPool = (category: Category) => ALL_ITEMS.filter(item => 
    item.category === category && !themedItemIds.includes(item.id)
  );

  const morningPool = createPool(Category.Morning);
  const daytimePool = createPool(Category.Daytime);
  const eveningPool = createPool(Category.Evening);
  
  // Adjust slice count if a themed item (which is usually a Daytime item) was picked
  const daytimeItemCount = themedItems.length > 0 ? 3 : 4;

  const morningItems = shuffleArray([...morningPool]).slice(0, 2);
  const daytimeItems = shuffleArray([...daytimePool]).slice(0, daytimeItemCount);
  const eveningItems = shuffleArray([...eveningPool]).slice(0, 2);
  const bonusItems = ITEM_POOL[Category.Bonus]; // Bonus is always the same

  const dailyItems = [...morningItems, ...daytimeItems, ...eveningItems, ...bonusItems, ...themedItems];
  return shuffleArray(dailyItems).map(item => item.id);
};

const getJSTDateString = (date: Date = new Date()): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
  return formatter.format(date);
};


export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('checklist');
  const [dailyChecks, setDailyChecks] = useLocalStorage<Record<string, number[]>>('dailyChecks', {});
  const [journalEntries, setJournalEntries] = useLocalStorage<Record<string, string>>('journalEntries', {});
  const [seenLevelUps, setSeenLevelUps] = useLocalStorage<Record<string, boolean>>('seenLevelUps', {});
  const [dailyLists, setDailyLists] = useLocalStorage<Record<string, number[]>>('dailyLists', {});

  const [showLevelUpModal, setShowLevelUpModal] = useState<Level | null>(null);
  const [lastTotalPoints, setLastTotalPoints] = useState(0);

  const today = getJSTDateString();

  // Generate a new list for today if it doesn't exist
  useEffect(() => {
    if (!dailyLists[today]) {
        const pointsBeforeToday = Object.entries(dailyChecks)
            .filter(([date]) => date < today)
            .flatMap(([, itemIds]) => itemIds)
            .reduce((total, itemId) => {
                const item = ALL_ITEMS.find(i => i.id === itemId);
                return total + (item ? item.points : 0);
            }, 0);

        const newDailyList = generateDailyList(pointsBeforeToday);
        setDailyLists(prev => ({...prev, [today]: newDailyList}));
    }
  }, [today, dailyLists, setDailyLists, dailyChecks]);

  const todaysItemIds = dailyLists[today] || [];
  const todaysItems = useMemo(() => {
    return todaysItemIds.map(id => ALL_ITEMS.find(item => item.id === id)).filter((item): item is ChecklistItem => !!item);
  }, [todaysItemIds]);

  const totalPoints = useMemo(() => {
    return Object.values(dailyChecks).flat().reduce((total, itemId) => {
      const item = ALL_ITEMS.find(i => i.id === itemId);
      return total + (item ? item.points : 0);
    }, 0);
  }, [dailyChecks]);

  const currentLevel = useMemo(() => {
    // Find the highest level the user has achieved
    return [...LEVELS].reverse().find(l => totalPoints >= l.points) || LEVELS[0];
  }, [totalPoints]);
  
  const streak = useMemo(() => {
    const dates = Object.keys(dailyChecks).filter(date => dailyChecks[date].length > 0).sort((a, b) => b.localeCompare(a));
    if (dates.length === 0) return 0;

    const todayStr = getJSTDateString(new Date());
    const yesterdayStr = getJSTDateString(new Date(Date.now() - 86400000));

    // Check if there is a record for today or yesterday
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
        return 0;
    }

    let currentStreak = 0;
    let expectedDate = new Date(dates[0] + 'T00:00:00'); // Treat as local date

    for (const dateStr of dates) {
        const expectedDateStr = getJSTDateString(expectedDate);
        if (dateStr === expectedDateStr) {
            currentStreak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }
    return currentStreak;
  }, [dailyChecks]);


  useEffect(() => {
    const previousLevel = [...LEVELS].reverse().find(l => lastTotalPoints >= l.points) || LEVELS[0];
    if (totalPoints > lastTotalPoints) {
      if (currentLevel.name !== previousLevel.name && !seenLevelUps[currentLevel.name]) {
        setShowLevelUpModal(currentLevel);
        setSeenLevelUps(prev => ({ ...prev, [currentLevel.name]: true }));
      }
    }
    setLastTotalPoints(totalPoints);
  }, [totalPoints, currentLevel.name, lastTotalPoints, seenLevelUps, setSeenLevelUps]);

  const todayChecks = dailyChecks[today] || [];
  const setTodayChecks = (itemIds: number[]) => {
    setDailyChecks(prev => ({ ...prev, [today]: itemIds }));
  };
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen totalPoints={totalPoints} currentLevel={currentLevel} dailyChecks={dailyChecks} />;
      case 'journal':
        return <JournalScreen journalEntries={journalEntries} setJournalEntries={setJournalEntries} />;
      case 'checklist':
      default:
        return <ChecklistScreen dailyItems={todaysItems} todayChecks={todayChecks} setTodayChecks={setTodayChecks} streak={streak} />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-100 via-rose-100 to-amber-100 min-h-screen text-gray-800">
      <div className="container mx-auto max-w-lg p-4 pb-24 relative">
        <header className="text-center my-4">
          <h1 className="font-display text-2xl text-purple-600">波動覚醒アドベンチャー</h1>
        </header>
        <main className="transition-all duration-300">
          {renderScreen()}
        </main>
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      </div>
      {showLevelUpModal && (
        <LevelUpModal level={showLevelUpModal} onClose={() => setShowLevelUpModal(null)} />
      )}
    </div>
  );
}