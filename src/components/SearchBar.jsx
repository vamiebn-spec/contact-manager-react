import React from 'react';
import { Search, ArrowUpDown, X } from 'lucide-react';

function SearchBar({ searchQuery, onSearchChange, sortOrder, onSortChange, totalCount }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      {/* Champ de recherche */}
      <div className="relative flex-1">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un contact par nom complet..."
          className="w-full pl-11 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Effacer la recherche"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200/70 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Contrôle de tri A-Z / Z-A */}
      <div className="flex items-center gap-2.5 justify-between sm:justify-end">
        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg">
          {totalCount} {totalCount > 1 ? 'contacts' : 'contact'}
        </span>

        <div className="relative flex items-center">
          <ArrowUpDown className="w-4 h-4 text-indigo-600 absolute left-3 pointer-events-none" />
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Ordre de tri"
            className="pl-9 pr-8 py-2.5 bg-indigo-50/70 hover:bg-indigo-50 text-indigo-700 font-medium text-sm border border-indigo-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer transition appearance-none"
          >
            <option value="asc">Nom : A → Z</option>
            <option value="desc">Nom : Z → A</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
