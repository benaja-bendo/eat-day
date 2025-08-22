import React, { useState } from 'react';
import { playClick, playSoundIfEnabled } from '../utils/sound';
import { bounceElement, createParticleEffect } from '../utils/animations';

interface Schedule {
  [date: string]: number[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function getMonthMatrix(current: Date): Date[][] {
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday first
  const totalDays = lastDay.getDate();
  const totalCells = Math.ceil((startWeekday + totalDays) / 7) * 7;
  const matrix: Date[][] = [];
  const iterator = new Date(year, month, 1 - startWeekday);
  for (let i = 0; i < totalCells; i++) {
    const weekIndex = Math.floor(i / 7);
    if (!matrix[weekIndex]) matrix[weekIndex] = [];
    matrix[weekIndex].push(new Date(iterator));
    iterator.setDate(iterator.getDate() + 1);
  }
  return matrix;
}

export const MealCalendar: React.FC = () => {
  const [mode, setMode] = useState<'month' | 'planning'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [schedule, setSchedule] = useState<Schedule>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const todayKey = new Date().toISOString().split('T')[0];

  const addRecipes = (dateKey: string) => {
    const ids = input
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter(Boolean);
    if (!ids.length) return;
    setSchedule((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), ...ids],
    }));
    setInput('');
    setSelectedDate(null);
  };

  const handleModeChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    next: 'month' | 'planning',
  ) => {
    playSoundIfEnabled(playClick);
    bounceElement(event.currentTarget);
    createParticleEffect(event.currentTarget);
    setMode(next);
  };

  const monthMatrix = getMonthMatrix(currentMonth);

  return (
    <div className="card-cartoon max-w-4xl mx-auto p-6 paper-texture">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-cartoon font-bold text-gray-800 flex items-center text-hand">
          <span className="text-4xl mr-2">📅</span> Calendrier
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={(e) => handleModeChange(e, 'month')}
            className={`px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon ${
              mode === 'month' ? 'bg-cartoon-purple text-white' : 'bg-white'
            }`}
          >
            Mode mois
          </button>
          <button
            onClick={(e) => handleModeChange(e, 'planning')}
            className={`px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon ${
              mode === 'planning' ? 'bg-cartoon-purple text-white' : 'bg-white'
            }`}
          >
            Mode planning
          </button>
        </div>
      </div>

      {/* Today's recipes */}
      <div className="mb-8">
        <h3 className="text-xl font-cartoon mb-2 text-hand">Plat du jour</h3>
        <div className="bg-cartoon-yellow bg-opacity-20 p-4 rounded-hand border-2 border-cartoon-yellow border-dashed">
          {schedule[todayKey] && schedule[todayKey].length > 0 ? (
            <ul className="list-disc list-inside font-cartoon text-hand">
              {schedule[todayKey].map((id) => (
                <li key={id}>Recette #{id}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 font-cartoon text-hand">Aucune recette pour aujourd'hui.</p>
          )}
          <div className="mt-4 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="IDs séparés par des virgules"
              className="flex-grow px-3 py-2 rounded-hand border-2 border-cartoon-yellow font-cartoon text-hand mr-2"
            />
            <button
              onClick={() => addRecipes(todayKey)}
              className="bg-cartoon-green text-white px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {mode === 'month' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
              }
              className="px-3 py-1 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon bg-white"
            >
              ◀
            </button>
            <span className="font-cartoon text-hand text-xl">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() =>
                setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
              }
              className="px-3 py-1 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon bg-white"
            >
              ▶
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center font-cartoon text-hand mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="font-bold">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthMatrix.flat().map((day) => {
              const key = day.toISOString().split('T')[0];
              const isCurrent = day.getMonth() === currentMonth.getMonth();
              const recipes = schedule[key]?.length || 0;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedDate(key);
                    setInput('');
                  }}
                  className={`h-20 rounded-hand border-2 flex flex-col items-center justify-center font-cartoon text-hand ${
                    isCurrent
                      ? 'bg-white border-cartoon-blue shadow-hand-drawn'
                      : 'bg-gray-100 border-gray-200 text-gray-400'
                  }`}
                >
                  <span>{day.getDate()}</span>
                  {recipes > 0 && (
                    <span className="text-xs mt-1">
                      {recipes} recette{recipes > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-6 p-4 bg-white rounded-hand border-2 border-cartoon-purple shadow-hand-drawn">
              <h4 className="font-cartoon text-hand text-lg mb-2">{formatDate(selectedDate)}</h4>
              {schedule[selectedDate] && schedule[selectedDate].length > 0 ? (
                <ul className="list-disc list-inside font-cartoon text-hand mb-4">
                  {schedule[selectedDate].map((id) => (
                    <li key={id}>Recette #{id}</li>
                  ))}
                </ul>
              ) : (
                <p className="font-cartoon text-hand mb-4">Aucune recette.</p>
              )}
              <div className="flex">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="IDs séparés par des virgules"
                  className="flex-grow px-3 py-2 rounded-hand border-2 border-cartoon-purple font-cartoon text-hand mr-2"
                />
                <button
                  onClick={() => addRecipes(selectedDate)}
                  className="bg-cartoon-green text-white px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon mr-2"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => setSelectedDate(null)}
                  className="bg-cartoon-red text-white px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === 'planning' && (
        <div>
          {Object.keys(schedule).length === 0 && (
            <p className="text-center font-cartoon text-hand text-gray-600">Aucun plat planifié.</p>
          )}
          {Object.entries(schedule)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, ids]) => (
              <div
                key={date}
                className="mb-4 p-4 bg-white rounded-hand border-2 border-cartoon-blue shadow-hand-drawn"
              >
                <h4 className="font-cartoon text-hand text-lg mb-2">{formatDate(date)}</h4>
                <ul className="list-disc list-inside font-cartoon text-hand">
                  {ids.map((id) => (
                    <li key={id}>Recette #{id}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MealCalendar;

