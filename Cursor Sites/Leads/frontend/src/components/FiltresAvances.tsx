import React, { useState, useEffect } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import { OffrePret } from '../types/comparateurs';

interface FiltresAvancesProps {
  offres: OffrePret[];
  onFilter: (filteredOffres: OffrePret[]) => void;
}

interface FilterState {
  tauxMin: number;
  tauxMax: number;
  mensualiteMax: number;
  fraisDossierMax: number;
  delaiTraitementMax: number;
  assuranceObligatoire: boolean | null;
  scoreMin: number;
  banquesSelectionnees: string[];
}

export default function FiltresAvances({ offres, onFilter }: FiltresAvancesProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tauxMin: 0,
    tauxMax: 10,
    mensualiteMax: 10000,
    fraisDossierMax: 5000,
    delaiTraitementMax: 60,
    assuranceObligatoire: null,
    scoreMin: 0,
    banquesSelectionnees: [],
  });

  // Get unique banks from offers
  const banquesUniques = Array.from(new Set(offres.map(o => o.nomBanque)));

  // Calculate max values for sliders
  const tauxMax = Math.max(...offres.map(o => o.tauxEffectif), 5);
  const mensualiteMax = Math.max(...offres.map(o => {
    const montantEmprunte = 200000; // Approximate
    const tauxMensuel = o.tauxEffectif / 100 / 12;
    const dureeMois = 240;
    return montantEmprunte * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -dureeMois)));
  }), 2000);
  const fraisMax = Math.max(...offres.map(o => (o.fraisDossier || 0) + (o.fraisGarantie || 0)), 3000);
  const delaiMax = Math.max(...offres.map(o => o.delaiTraitement || 30), 45);
  const scoreMax = Math.max(...offres.map(o => o.score || 100), 100);

  const applyFilters = () => {
    let filtered = [...offres];

    // Filter by rate
    filtered = filtered.filter(o => 
      o.tauxEffectif >= filters.tauxMin && o.tauxEffectif <= filters.tauxMax
    );

    // Filter by monthly payment (approximate calculation)
    filtered = filtered.filter(o => {
      const montantEmprunte = 200000; // Approximate
      const tauxMensuel = o.tauxEffectif / 100 / 12;
      const dureeMois = 240;
      const mensualite = montantEmprunte * (tauxMensuel / (1 - Math.pow(1 + tauxMensuel, -dureeMois)));
      return mensualite <= filters.mensualiteMax;
    });

    // Filter by fees
    filtered = filtered.filter(o => {
      const fraisTotaux = (o.fraisDossier || 0) + (o.fraisGarantie || 0);
      return fraisTotaux <= filters.fraisDossierMax;
    });

    // Filter by processing time
    filtered = filtered.filter(o => 
      (o.delaiTraitement || 30) <= filters.delaiTraitementMax
    );

    // Filter by mandatory insurance
    if (filters.assuranceObligatoire !== null) {
      filtered = filtered.filter(o => o.assuranceObli === filters.assuranceObligatoire);
    }

    // Filter by score
    filtered = filtered.filter(o => (o.score || 0) >= filters.scoreMin);

    // Filter by banks
    if (filters.banquesSelectionnees.length > 0) {
      filtered = filtered.filter(o => 
        filters.banquesSelectionnees.includes(o.nomBanque)
      );
    }

    onFilter(filtered);
  };

  const resetFilters = () => {
    const resetState: FilterState = {
      tauxMin: 0,
      tauxMax: tauxMax,
      mensualiteMax: mensualiteMax,
      fraisDossierMax: fraisMax,
      delaiTraitementMax: delaiMax,
      assuranceObligatoire: null,
      scoreMin: 0,
      banquesSelectionnees: [],
    };
    setFilters(resetState);
    onFilter(offres);
  };

  const toggleBanque = (banque: string) => {
    setFilters(prev => ({
      ...prev,
      banquesSelectionnees: prev.banquesSelectionnees.includes(banque)
        ? prev.banquesSelectionnees.filter(b => b !== banque)
        : [...prev.banquesSelectionnees, banque]
    }));
  };

  // Auto-apply filters when they change
  React.useEffect(() => {
    applyFilters();
  }, [filters, offres]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200">
      {/* Header */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">Filtres avancés</span>
          <span className="text-sm text-gray-500">
            ({offres.length} offre{offres.length > 1 ? 's' : ''})
          </span>
        </div>
        {showFilters ? (
          <X className="w-5 h-5 text-gray-500" />
        ) : (
          <Filter className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-t border-gray-200 p-4 space-y-6">
          {/* Rate Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taux TAEG : {filters.tauxMin.toFixed(2)}% - {filters.tauxMax.toFixed(2)}%
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                value={filters.tauxMin}
                onChange={(e) => setFilters({ ...filters, tauxMin: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                min="0"
                max={filters.tauxMax}
                step="0.1"
              />
              <input
                type="number"
                value={filters.tauxMax}
                onChange={(e) => setFilters({ ...filters, tauxMax: parseFloat(e.target.value) || tauxMax })}
                className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm"
                min={filters.tauxMin}
                max="10"
                step="0.1"
              />
            </div>
            <input
              type="range"
              min="0"
              max={tauxMax}
              step="0.1"
              value={filters.tauxMax}
              onChange={(e) => setFilters({ ...filters, tauxMax: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Monthly Payment Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensualité maximum : {filters.mensualiteMax.toFixed(0)}€
            </label>
            <input
              type="range"
              min="500"
              max={mensualiteMax}
              step="50"
              value={filters.mensualiteMax}
              onChange={(e) => setFilters({ ...filters, mensualiteMax: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Fees Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais maximum : {filters.fraisDossierMax.toFixed(0)}€
            </label>
            <input
              type="range"
              min="0"
              max={fraisMax}
              step="100"
              value={filters.fraisDossierMax}
              onChange={(e) => setFilters({ ...filters, fraisDossierMax: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Processing Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Délai de traitement max : {filters.delaiTraitementMax} jours
            </label>
            <input
              type="range"
              min="5"
              max={delaiMax}
              step="5"
              value={filters.delaiTraitementMax}
              onChange={(e) => setFilters({ ...filters, delaiTraitementMax: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Mandatory Insurance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assurance obligatoire
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assurance"
                  checked={filters.assuranceObligatoire === null}
                  onChange={() => setFilters({ ...filters, assuranceObligatoire: null })}
                  className="mr-2"
                />
                <span className="text-sm">Tous</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assurance"
                  checked={filters.assuranceObligatoire === true}
                  onChange={() => setFilters({ ...filters, assuranceObligatoire: true })}
                  className="mr-2"
                />
                <span className="text-sm">Oui</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="assurance"
                  checked={filters.assuranceObligatoire === false}
                  onChange={() => setFilters({ ...filters, assuranceObligatoire: false })}
                  className="mr-2"
                />
                <span className="text-sm">Non</span>
              </label>
            </div>
          </div>

          {/* Quality Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score de qualité min : {filters.scoreMin.toFixed(0)}/100
            </label>
            <input
              type="range"
              min="0"
              max={scoreMax}
              step="5"
              value={filters.scoreMin}
              onChange={(e) => setFilters({ ...filters, scoreMin: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Banks Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banques ({filters.banquesSelectionnees.length} sélectionnée{filters.banquesSelectionnees.length > 1 ? 's' : ''})
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2">
              {banquesUniques.map(banque => (
                <label key={banque} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.banquesSelectionnees.includes(banque)}
                    onChange={() => toggleBanque(banque)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">{banque}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              Appliquer les filtres
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
