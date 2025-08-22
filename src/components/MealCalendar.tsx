import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { playClick, playSoundIfEnabled } from '../utils/sound';
import { scaleUpElement } from '../utils/animations';
import { useMealCalendarQuery, useRecipesQuery } from '../features/recipes/hooks';
import { updateMealCalendar } from '../features/recipes/api';
import RecipeAutocomplete from './RecipeAutocomplete';
import type { Recipe } from '../features/recipes/types';

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
  const navigate = useNavigate();
  const { data, refetch } = useMealCalendarQuery();
  const [schedule, setSchedule] = useState<Schedule>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [menu, setMenu] = useState<{ x: number; y: number; date: string } | null>(null);
  
  const { data: allRecipes = [] } = useRecipesQuery();

  useEffect(() => {
    if (data?.schedule) {
      setSchedule(data.schedule);
    }
  }, [data]);

  const todayKey = new Date().toISOString().split('T')[0];

  const openAddDialog = (date?: string) => {
    setDialogDate(date || todayKey);
    setSelectedRecipes([]);
    setAddOpen(true);
  };

  const openViewDialog = (date: string) => {
    setDialogDate(date);
    setViewOpen(true);
  };

  const handleAdd = async () => {
    if (!selectedRecipes.length) return;
    const ids = selectedRecipes.map(recipe => recipe.id);
    const updated = {
      ...schedule,
      [dialogDate]: [...(schedule[dialogDate] || []), ...ids],
    };
    setSchedule(updated);
    await updateMealCalendar({ schedule: updated });
    refetch();
    setAddOpen(false);
    setSelectedRecipes([]);
  };

  // Fonction pour obtenir le nom d'une recette par son ID
  const getRecipeName = (id: number): string => {
    const recipe = allRecipes.find(r => r.id === id);
    return recipe ? recipe.name : `Recette #${id}`;
  };

  const monthMatrix = getMonthMatrix(currentMonth);

  const handleContextMenu = (e: React.MouseEvent, date: string) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, date });
  };

  return (
    <div className="card-cartoon max-w-4xl mx-auto p-6 paper-texture">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-cartoon font-bold text-gray-800 flex items-center text-hand">
          <span className="text-4xl mr-2">📅</span> Calendrier
        </h2>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon bg-cartoon-purple text-white"
            disabled
          >
            Mois
          </button>
          <button
            onClick={(e) => {
              playSoundIfEnabled(playClick);
              scaleUpElement(e.currentTarget, 1.05, 150);
              openViewDialog(todayKey);
            }}
            className="px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon bg-white hover:scale-105 transition-transform duration-150"
          >
            Planning
          </button>
          <button
            onClick={(e) => {
              playSoundIfEnabled(playClick);
              scaleUpElement(e.currentTarget, 1.05, 150);
              openAddDialog();
            }}
            className="px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon bg-cartoon-green text-white hover:scale-105 transition-transform duration-150"
          >
            Ajouter
          </button>
        </div>
      </div>

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
                onClick={() => openViewDialog(key)}
                onContextMenu={(e) => handleContextMenu(e, key)}
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
      </div>

      {addOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-hand border-2 border-cartoon-purple shadow-hand-drawn w-full max-w-md">
            <h4 className="font-cartoon text-hand text-lg mb-4">Ajouter des recettes</h4>
            <input
              type="date"
              value={dialogDate}
              onChange={(e) => setDialogDate(e.target.value)}
              className="w-full mb-4 px-3 py-2 rounded-hand border-2 border-cartoon-purple font-cartoon text-hand"
            />
            <RecipeAutocomplete
              onSelect={setSelectedRecipes}
              selectedRecipes={selectedRecipes}
              placeholder="Rechercher et sélectionner des recettes..."
              multiple={true}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleAdd}
                className="bg-cartoon-green text-white px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setAddOpen(false)}
                className="bg-cartoon-red text-white px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {viewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-hand border-2 border-cartoon-purple shadow-hand-drawn w-full max-w-md">
            <h4 className="font-cartoon text-hand text-lg mb-4">{formatDate(dialogDate)}</h4>
            {schedule[dialogDate] && schedule[dialogDate].length > 0 ? (
              <ul className="space-y-2 font-cartoon text-hand mb-4">
                {schedule[dialogDate].map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => {
                        playSoundIfEnabled(playClick);
                        navigate(`/recipe/${id}`);
                      }}
                      className="text-left w-full p-2 rounded-hand border-2 border-cartoon-purple bg-paper-white hover:bg-cartoon-purple hover:text-white transition-all duration-200 hover:scale-105"
                    >
                      📖 {getRecipeName(id)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-cartoon text-hand mb-4">Aucune recette planifiée.</p>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setViewOpen(false)}
                className="bg-cartoon-red text-white px-4 py-2 rounded-hand border-2 border-white shadow-hand-drawn font-cartoon"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {menu && (
        <div className="fixed inset-0 z-50" onClick={() => setMenu(null)}>
          <div
            className="absolute bg-white border-2 border-cartoon-purple rounded-hand shadow-hand-drawn"
            style={{ top: menu.y, left: menu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                openAddDialog(menu.date);
                setMenu(null);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-cartoon-purple hover:text-white font-cartoon text-hand"
            >
              Ajouter
            </button>
            <button
              onClick={() => {
                openViewDialog(menu.date);
                setMenu(null);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-cartoon-purple hover:text-white font-cartoon text-hand"
            >
              Voir
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealCalendar;

