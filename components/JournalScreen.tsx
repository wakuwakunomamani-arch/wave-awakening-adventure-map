import React, { useState, useMemo } from 'react';

interface JournalScreenProps {
  journalEntries: Record<string, string>;
  setJournalEntries: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const getJSTDateString = (date: Date): string => {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Tokyo',
  });
  return formatter.format(date);
};

export default function JournalScreen({ journalEntries, setJournalEntries }: JournalScreenProps) {
  const todayStr = getJSTDateString(new Date());
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [currentMonth, setCurrentMonth] = useState(new Date(todayStr + 'T00:00:00'));

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentMonth]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(getJSTDateString(date));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournalEntries(prev => ({
      ...prev,
      [selectedDate]: e.target.value,
    }));
  };
  
  const changeMonth = (delta: number) => {
    setCurrentMonth(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(newDate.getMonth() + delta, 1); // Set to day 1 to avoid month skipping issues
        return newDate;
    });
  }

  const selectedDateObj = useMemo(() => {
    // Parse date string as local time by appending T00:00:00
    return new Date(selectedDate + 'T00:00:00');
  }, [selectedDate]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white/70 p-4 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-rose-200 text-rose-700 rounded-lg hover:bg-rose-300">&lt;</button>
            <h3 className="font-display text-lg text-gray-700">
                {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
            </h3>
            <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-rose-200 text-rose-700 rounded-lg hover:bg-rose-300">&gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {Array(firstDayOfMonth).fill(null).map((_, i) => <div key={`empty-${i}`}></div>)}
            {daysInMonth.map(day => {
                const dateStr = getJSTDateString(day);
                const isSelected = dateStr === selectedDate;
                const hasEntry = !!journalEntries[dateStr];
                const isToday = dateStr === todayStr;
                
                return (
                    <button
                        key={dateStr}
                        onClick={() => handleDateClick(day)}
                        className={`p-2 rounded-full aspect-square text-sm transition-colors relative ${
                            isSelected ? 'bg-rose-400 text-white' : isToday ? 'bg-rose-200' : 'hover:bg-rose-100'
                        }`}
                    >
                        {day.getDate()}
                        {hasEntry && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>}
                    </button>
                )
            })}
        </div>
      </div>

      <div className="bg-white/70 p-6 rounded-2xl shadow-lg">
        <label htmlFor="journal-entry" className="block font-semibold text-gray-700 mb-2">
            {selectedDateObj.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })} の日記
        </label>
        <p className="text-sm text-gray-500 mb-3">シンクロニシティや感謝した出来事を書き留めましょう。</p>
        <textarea
          id="journal-entry"
          rows={6}
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition"
          value={journalEntries[selectedDate] || ''}
          onChange={handleTextChange}
          placeholder="今日はどんな素敵なことがありましたか？"
        />
      </div>
    </div>
  );
}