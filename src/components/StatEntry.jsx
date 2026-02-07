import { useState } from 'react';
import './StatEntry.css';

function StatEntry({ players, numSets, stats, setScores, onStatUpdate, onSetScoreUpdate, onViewSummary }) {
    const [currentSet, setCurrentSet] = useState(1);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

    const currentPlayer = players[currentPlayerIndex];

    // Define categories based on player role
    const getCategoriesForRole = (role) => {
        const baseCategories = {
            service: {
                label: 'Service',
                icon: '🏐',
                items: [
                    { key: 'ace', label: 'Ace' },
                    { key: 'difficult', label: 'Mis en difficulté' },
                    { key: 'passed', label: 'Passé' },
                    { key: 'missed', label: 'Raté' }
                ]
            },
            pass: {
                label: 'Passe',
                icon: '🤝',
                items: [
                    { key: 'good', label: 'Bonne' },
                    { key: 'medium', label: 'Moyen' },
                    { key: 'bad', label: 'Mauvaise' }
                ]
            },
            faults: {
                label: 'Fautes',
                icon: '⚠️',
                items: [
                    { key: 'direct', label: 'Faute directe' }
                ]
            }
        };

        // Role-specific categories
        if (role === 'passeur') {
            // Passeur: Service, Passe, Fautes (pas d'attaque ni réception)
            return {
                service: baseCategories.service,
                pass: baseCategories.pass,
                faults: baseCategories.faults
            };
        } else if (role === 'libero') {
            // Libéro: Réception, Défense, Passe, Fautes (pas de service ni attaque)
            return {
                reception: {
                    label: 'Réception',
                    icon: '🛡️',
                    items: [
                        { key: 'setter', label: 'Zone passeur' },
                        { key: 'threeMeter', label: '3 mètres' },
                        { key: 'bad', label: 'Mauvais' }
                    ]
                },
                defense: {
                    label: 'Défense',
                    icon: '🔰',
                    items: [
                        { key: 'good', label: 'Bonne' },
                        { key: 'medium', label: 'Moyen' },
                        { key: 'bad', label: 'Mauvaise' }
                    ]
                },
                pass: baseCategories.pass,
                faults: baseCategories.faults
            };
        } else if (role === 'central') {
            // Central: Service, Attaque, Passe, Fautes (pas de réception ni défense)
            return {
                service: baseCategories.service,
                attack: {
                    label: 'Attaque',
                    icon: '⚡',
                    items: [
                        { key: 'scored', label: 'Marqué' },
                        { key: 'placed', label: 'Placé' },
                        { key: 'missed', label: 'Raté' }
                    ]
                },
                pass: baseCategories.pass,
                faults: baseCategories.faults
            };
        } else {
            // R4, Pointu: Toutes les catégories
            return {
                service: baseCategories.service,
                attack: {
                    label: 'Attaque',
                    icon: '⚡',
                    items: [
                        { key: 'scored', label: 'Marqué' },
                        { key: 'placed', label: 'Placé' },
                        { key: 'missed', label: 'Raté' }
                    ]
                },
                pass: baseCategories.pass,
                reception: {
                    label: 'Réception',
                    icon: '🛡️',
                    items: [
                        { key: 'setter', label: 'Zone passeur' },
                        { key: 'threeMeter', label: '3 mètres' },
                        { key: 'bad', label: 'Mauvais' }
                    ]
                },
                defense: {
                    label: 'Défense',
                    icon: '🔰',
                    items: [
                        { key: 'good', label: 'Bonne' },
                        { key: 'medium', label: 'Moyen' },
                        { key: 'bad', label: 'Mauvaise' }
                    ]
                },
                faults: baseCategories.faults
            };
        }
    };

    const categories = getCategoriesForRole(currentPlayer.role);

    const getCurrentValue = (category, subcategory) => {
        return stats[currentPlayer.name]?.[currentSet]?.[category]?.[subcategory] || 0;
    };

    const updateStat = (category, subcategory, delta) => {
        const currentValue = getCurrentValue(category, subcategory);
        const newValue = Math.max(0, currentValue + delta);
        onStatUpdate(currentPlayer.name, currentSet, category, subcategory, newValue);
    };

    const handleSetScoreChange = (field, value) => {
        const currentScores = setScores[currentSet] || { team: 0, opponent: 0 };
        const newValue = parseInt(value) || 0;
        onSetScoreUpdate(
            currentSet,
            field === 'team' ? newValue : currentScores.team,
            field === 'opponent' ? newValue : currentScores.opponent
        );
    };

    return (
        <div className="container">
            <div className="stat-entry-container">
                {/* Controls */}
                <div className="card controls-card">
                    <div className="controls-grid">
                        <div className="control-group">
                            <label>Set</label>
                            <select
                                value={currentSet}
                                onChange={(e) => setCurrentSet(parseInt(e.target.value))}
                            >
                                {Array.from({ length: numSets }, (_, i) => i + 1).map(set => (
                                    <option key={set} value={set}>Set {set}</option>
                                ))}
                            </select>
                        </div>

                        <div className="control-group">
                            <label>Joueur</label>
                            <select
                                value={currentPlayerIndex}
                                onChange={(e) => setCurrentPlayerIndex(parseInt(e.target.value))}
                            >
                                {players.map((player, index) => (
                                    <option key={index} value={index}>
                                        {player.name} ({player.role === 'r4' ? 'R4' : player.role === 'libero' ? 'Libéro' : player.role === 'passeur' ? 'Passeur' : player.role === 'central' ? 'Central' : 'Pointu'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Set Score */}
                    <div className="set-score-section">
                        <h4>Score du Set {currentSet}</h4>
                        <div className="score-inputs">
                            <div className="score-input-group">
                                <label>Notre équipe</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={setScores[currentSet]?.team || 0}
                                    onChange={(e) => handleSetScoreChange('team', e.target.value)}
                                />
                            </div>
                            <span className="score-separator">-</span>
                            <div className="score-input-group">
                                <label>Adversaire</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={setScores[currentSet]?.opponent || 0}
                                    onChange={(e) => handleSetScoreChange('opponent', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    {Object.entries(categories).map(([categoryKey, category]) => (
                        <div key={categoryKey} className="card stat-category">
                            <h3>
                                <span className="category-icon">{category.icon}</span>
                                {category.label}
                            </h3>
                            <div className="stat-items">
                                {category.items.map(item => {
                                    const value = getCurrentValue(categoryKey, item.key);
                                    return (
                                        <div key={item.key} className="stat-item">
                                            <div className="stat-label">{item.label}</div>
                                            <div className="stat-controls">
                                                <button
                                                    className="btn-secondary btn-small"
                                                    onClick={() => updateStat(categoryKey, item.key, -1)}
                                                    disabled={value === 0}
                                                >
                                                    −
                                                </button>
                                                <span className="stat-value">{value}</span>
                                                <button
                                                    className="btn-secondary btn-small"
                                                    onClick={() => updateStat(categoryKey, item.key, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="actions">
                    <button
                        className="btn-accent btn-large"
                        onClick={onViewSummary}
                    >
                        Voir le résumé →
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StatEntry;
