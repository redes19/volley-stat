import { useState } from 'react';
import './StatEntry.css';

function StatEntry({ players, numSets, stats, setScores, onStatUpdate, onSetScoreUpdate, onViewSummary }) {
    const [currentSet, setCurrentSet] = useState(1);

    // Define logic to check if a category applies to a role
    const isCategoryApplicable = (role, category) => {
        if (category === 'service') return role !== 'libero'; // Libéro ne sert pas
        if (category === 'attack') return role !== 'passeur' && role !== 'libero'; // Passeur et Libéro n'attaquent pas
        if (category === 'reception') return role !== 'passeur' && role !== 'central'; // Passeur et Central ne réceptionnent pas
        if (category === 'defense') return role !== 'central'; // Central ne défend pas
        if (category === 'pass') return true; // Tout le monde peut passer
        if (category === 'faults') return true; // Tout le monde peut faire des fautes
        return true;
    };

    const getStatValue = (playerName, category, subcategory) => {
        return stats[playerName]?.[currentSet]?.[category]?.[subcategory] || 0;
    };

    const updateStat = (playerName, category, subcategory, delta) => {
        const currentValue = getStatValue(playerName, category, subcategory);
        const newValue = Math.max(0, currentValue + delta);
        onStatUpdate(playerName, currentSet, category, subcategory, newValue);
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

    const getRoleLabel = (role) => {
        const map = {
            'passeur': 'Passeur',
            'libero': 'Libéro',
            'r4': 'R4',
            'central': 'Central',
            'pointu': 'Pointu'
        };
        return map[role] || role;
    };

    return (
        <div className="container-fluid">
            <div className="stat-entry-container full-width">
                {/* Top Controls: Set selection and Score */}
                <div className="card controls-card mb-md">
                    <div className="controls-header">
                        <div className="set-selector">
                            <label>Set en cours :</label>
                            <select
                                value={currentSet}
                                onChange={(e) => setCurrentSet(parseInt(e.target.value))}
                                className="set-select"
                            >
                                {Array.from({ length: numSets }, (_, i) => i + 1).map(set => (
                                    <option key={set} value={set}>Set {set}</option>
                                ))}
                            </select>
                        </div>

                        <div className="score-display-compact">
                            <span className="score-label">Score :</span>
                            <input
                                type="number"
                                min="0"
                                value={setScores[currentSet]?.team || 0}
                                onChange={(e) => handleSetScoreChange('team', e.target.value)}
                                className="score-input"
                            />
                            <span className="score-divider">-</span>
                            <input
                                type="number"
                                min="0"
                                value={setScores[currentSet]?.opponent || 0}
                                onChange={(e) => handleSetScoreChange('opponent', e.target.value)}
                                className="score-input"
                            />
                        </div>

                        <button
                            className="btn-accent btn-summary"
                            onClick={onViewSummary}
                        >
                            Voir le résumé →
                        </button>
                    </div>
                </div>

                {/* Global Stats Table */}
                <div className="table-container">
                    <table className="entry-table">
                        <thead>
                            <tr>
                                <th className="sticky-col name-col">Joueur</th>
                                <th className="sticky-col role-col">Rôle</th>

                                <th colSpan="4" className="category-header service">Service 🏐</th>
                                <th colSpan="3" className="category-header attack">Attaque ⚡</th>
                                <th colSpan="3" className="category-header pass">Passe 🤝</th>
                                <th colSpan="3" className="category-header reception">Réception 🛡️</th>
                                <th colSpan="3" className="category-header defense">Défense 🔰</th>
                                <th className="category-header faults">Fautes ⚠️</th>
                            </tr>
                            <tr className="subheader-row">
                                <th className="sticky-col name-col"></th>
                                <th className="sticky-col role-col"></th>

                                {/* Service */}
                                <th title="Ace">Ace</th>
                                <th title="Mis en difficulté">Diff.</th>
                                <th title="Passé">Pass.</th>
                                <th title="Raté">Raté</th>

                                {/* Attaque */}
                                <th title="Marqué">Marq.</th>
                                <th title="Placé">Plac.</th>
                                <th title="Raté">Raté</th>

                                {/* Passe */}
                                <th title="Bonne">Bon.</th>
                                <th title="Moyen">Moy.</th>
                                <th title="Mauvaise">Mauv.</th>

                                {/* Réception */}
                                <th title="Zone passeur">Pass.</th>
                                <th title="3 mètres">3m</th>
                                <th title="Mauvais">Mauv.</th>

                                {/* Défense */}
                                <th title="Bonne">Bon.</th>
                                <th title="Moyen">Moy.</th>
                                <th title="Mauvaise">Mauv.</th>

                                {/* Fautes */}
                                <th title="Faute directe">Dir.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => {
                                return (
                                    <tr key={player.name}>
                                        <td className="sticky-col name-col player-name">{player.name}</td>
                                        <td className="sticky-col role-col player-role">{getRoleLabel(player.role)}</td>

                                        {/* Service */}
                                        <StatCell
                                            player={player}
                                            category="service" subcategory="ace"
                                            active={isCategoryApplicable(player.role, 'service')}
                                            value={getStatValue(player.name, 'service', 'ace')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="service" subcategory="difficult"
                                            active={isCategoryApplicable(player.role, 'service')}
                                            value={getStatValue(player.name, 'service', 'difficult')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="service" subcategory="passed"
                                            active={isCategoryApplicable(player.role, 'service')}
                                            value={getStatValue(player.name, 'service', 'passed')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="service" subcategory="missed"
                                            active={isCategoryApplicable(player.role, 'service')}
                                            value={getStatValue(player.name, 'service', 'missed')}
                                            isNegative
                                            onUpdate={updateStat}
                                        />

                                        {/* Attaque */}
                                        <StatCell
                                            player={player}
                                            category="attack" subcategory="scored"
                                            active={isCategoryApplicable(player.role, 'attack')}
                                            value={getStatValue(player.name, 'attack', 'scored')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="attack" subcategory="placed"
                                            active={isCategoryApplicable(player.role, 'attack')}
                                            value={getStatValue(player.name, 'attack', 'placed')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="attack" subcategory="missed"
                                            active={isCategoryApplicable(player.role, 'attack')}
                                            value={getStatValue(player.name, 'attack', 'missed')}
                                            isNegative
                                            onUpdate={updateStat}
                                        />

                                        {/* Passe */}
                                        <StatCell
                                            player={player}
                                            category="pass" subcategory="good"
                                            active={isCategoryApplicable(player.role, 'pass')}
                                            value={getStatValue(player.name, 'pass', 'good')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="pass" subcategory="medium"
                                            active={isCategoryApplicable(player.role, 'pass')}
                                            value={getStatValue(player.name, 'pass', 'medium')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="pass" subcategory="bad"
                                            active={isCategoryApplicable(player.role, 'pass')}
                                            value={getStatValue(player.name, 'pass', 'bad')}
                                            isNegative
                                            onUpdate={updateStat}
                                        />

                                        {/* Réception */}
                                        <StatCell
                                            player={player}
                                            category="reception" subcategory="setter"
                                            active={isCategoryApplicable(player.role, 'reception')}
                                            value={getStatValue(player.name, 'reception', 'setter')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="reception" subcategory="threeMeter"
                                            active={isCategoryApplicable(player.role, 'reception')}
                                            value={getStatValue(player.name, 'reception', 'threeMeter')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="reception" subcategory="bad"
                                            active={isCategoryApplicable(player.role, 'reception')}
                                            value={getStatValue(player.name, 'reception', 'bad')}
                                            isNegative
                                            onUpdate={updateStat}
                                        />

                                        {/* Défense */}
                                        <StatCell
                                            player={player}
                                            category="defense" subcategory="good"
                                            active={isCategoryApplicable(player.role, 'defense')}
                                            value={getStatValue(player.name, 'defense', 'good')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="defense" subcategory="medium"
                                            active={isCategoryApplicable(player.role, 'defense')}
                                            value={getStatValue(player.name, 'defense', 'medium')}
                                            onUpdate={updateStat}
                                        />
                                        <StatCell
                                            player={player}
                                            category="defense" subcategory="bad"
                                            active={isCategoryApplicable(player.role, 'defense')}
                                            value={getStatValue(player.name, 'defense', 'bad')}
                                            isNegative
                                            onUpdate={updateStat}
                                        />

                                        {/* Fautes */}
                                        <StatCell
                                            player={player}
                                            category="faults" subcategory="direct"
                                            active={true}
                                            value={getStatValue(player.name, 'faults', 'direct')}
                                            isNegative
                                            onUpdate={updateStat}
                                        />
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Component for a single stat cell
function StatCell({ player, category, subcategory, active, value, isNegative, onUpdate }) {
    if (!active) {
        return <td className="stat-cell disabled"></td>;
    }

    return (
        <td className={`stat-cell ${isNegative ? 'negative-stat' : ''}`}>
            <div className="stat-control-wrapper">
                <div className="stat-value-display">{value || ''}</div>
                <div className="stat-buttons">
                    <button
                        className="btn-mini btn-minus"
                        onClick={() => onUpdate(player.name, category, subcategory, -1)}
                        disabled={!value}
                    >
                        -
                    </button>
                    <button
                        className="btn-mini btn-plus"
                        onClick={() => onUpdate(player.name, category, subcategory, 1)}
                    >
                        +
                    </button>
                </div>
            </div>
        </td>
    );
}

export default StatEntry;
