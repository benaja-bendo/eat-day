import React from 'react';
import { usePlaylistQuery } from '../features/recipes/hooks';
import { playClick, playSoundIfEnabled } from '../utils/sound';
import { bounceElement, createParticleEffect } from '../utils/animations';

/**
 * Composant pour afficher la playlist quotidienne avec la recette du jour
 * et les recettes planifiées
 */
export const DailyPlaylist: React.FC = () => {
  const { data: playlist, isLoading, error, refetch } = usePlaylistQuery();

  /**
   * Actualise la playlist
   */
  const handleRefreshPlaylist = (event: React.MouseEvent<HTMLButtonElement>) => {
    playSoundIfEnabled(playClick);
    const button = event.currentTarget;
    bounceElement(button);
    createParticleEffect(button);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Chargement de la playlist...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erreur de chargement
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Impossible de charger la playlist. Veuillez réessayer.</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={handleRefreshPlaylist}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-500 mb-4">
            Aucune playlist disponible pour le moment.
          </p>
          <button
            onClick={handleRefreshPlaylist}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Charger la playlist
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-cartoon max-w-4xl mx-auto p-8 paper-texture">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-3xl font-cartoon font-bold text-gray-800 flex items-center justify-center md:justify-start text-hand">
            <span className="text-4xl mr-3 animate-bounce-gentle">📅</span>
            Playlist Quotidienne Magique
          </h2>
          <p className="text-gray-600 mt-2 font-cartoon text-hand">
            Vos recettes planifiées et la recette du jour
          </p>
        </div>
        <button
          onClick={handleRefreshPlaylist}
          className="bg-cartoon-purple text-white px-6 py-3 rounded-hand hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white font-cartoon flex items-center"
        >
          <span className="mr-2 text-xl">🔄</span>
          Actualiser
        </button>
      </div>

      <div className="space-y-8">
        {/* Recette du jour */}
        {playlist.todayRecipeId && (
          <div className="bg-cartoon-yellow bg-opacity-20 p-6 rounded-hand border-2 border-cartoon-yellow border-dashed">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mb-6">
              <span className="text-2xl font-cartoon font-bold text-orange-600 flex items-center text-hand">
                <span className="text-3xl mr-3 animate-pulse-soft">⭐</span>
                Recette du jour
              </span>
              <div className="ml-0 md:ml-4 mt-2 md:mt-0 px-4 py-2 bg-cartoon-orange text-white rounded-hand text-sm font-cartoon shadow-cartoon">
                Spécial aujourd'hui
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white border-2 border-cartoon-yellow rounded-hand p-6 shadow-cartoon hover:scale-105 transition-all duration-300">
                <span className="text-4xl mb-4 block animate-bounce-gentle">🍽️</span>
                <p className="text-xl font-cartoon text-gray-700 text-hand mb-2">Recette sélectionnée : #{playlist.todayRecipeId}</p>
                <p className="text-sm font-cartoon text-gray-500 text-hand">Recette sélectionnée pour aujourd'hui</p>
              </div>
            </div>
          </div>
        )}

        {/* Recettes planifiées */}
        {playlist.plannedIds && playlist.plannedIds.length > 0 && (
          <div className="bg-cartoon-blue bg-opacity-20 p-6 rounded-hand border-2 border-cartoon-blue border-dashed">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-start mb-6">
              <span className="text-2xl font-cartoon font-bold text-blue-600 flex items-center text-hand">
                <span className="text-3xl mr-3 animate-bounce-gentle">📋</span>
                Recettes planifiées
              </span>
              <div className="ml-0 md:ml-4 mt-2 md:mt-0 px-4 py-2 bg-cartoon-blue text-white rounded-hand text-sm font-cartoon shadow-cartoon">
                {playlist.plannedIds.length} recette{playlist.plannedIds.length > 1 ? 's' : ''}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlist.plannedIds.map((recipeId, index) => (
                <div key={recipeId} className="bg-white border-2 border-cartoon-blue rounded-hand p-6 shadow-cartoon hover:scale-105 transition-all duration-300 hover:animate-wiggle">
                  <div className="text-center">
                    <span className="text-3xl mb-3 block animate-float" style={{animationDelay: `${index * 0.2}s`}}>🍳</span>
                    <div className="mb-2">
                      <span className="text-lg font-cartoon font-bold text-gray-700 text-hand">
                        Recette #{index + 1}
                      </span>
                    </div>
                    <p className="text-gray-600 font-cartoon text-hand mb-1">ID: {recipeId}</p>
                    <p className="text-sm font-cartoon text-gray-500 text-hand">Planifiée pour plus tard</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si pas de recettes planifiées */}
        {(!playlist.plannedIds || playlist.plannedIds.length === 0) && !playlist.todayRecipeId && (
          <div className="text-center py-12 bg-gray-50 rounded-hand border-2 border-gray-200 border-dashed">
            <div className="text-6xl mb-6 animate-bounce-gentle">🍽️</div>
            <p className="text-xl font-cartoon text-gray-500 mb-4 text-hand">
              Aucune recette planifiée pour aujourd'hui.
            </p>
            <p className="text-lg font-cartoon text-gray-400 text-hand">
              Utilisez le mode aléatoire pour découvrir de nouvelles recettes !
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t-2 border-cartoon-yellow border-dashed">
        <div className="flex justify-center">
          <button
            onClick={handleRefreshPlaylist}
            className="bg-cartoon-green text-white px-8 py-3 rounded-hand hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 hover:animate-wiggle shadow-hand-drawn border-2 border-white font-cartoon flex items-center"
          >
            <span className="mr-3 text-xl">🔄</span>
            Actualiser la playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyPlaylist;