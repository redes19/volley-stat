import './StatsSummary.css';

function StatsSummary({ players, numSets, stats, setScores, matchInfo, onBackToEntry, onExport, onExportPDF, onReset }) {

    // Calculate totals for a player across all sets
    const calculatePlayerTotals = (playerName) => {
        const totals = {
            service: { ace: 0, difficult: 0, passed: 0, missed: 0 },
            attack: { scored: 0, placed: 0, missed: 0 },
            pass: { good: 0, medium: 0, bad: 0 },
            reception: { setter: 0, threeMeter: 0, bad: 0 },
            defense: { good: 0, medium: 0, bad: 0 },
            faults: { direct: 0 }
        };

        for (let set = 1; set <= numSets; set++) {
            const setStats = stats[playerName]?.[set];
            if (setStats) {
                Object.keys(totals).forEach(category => {
                    Object.keys(totals[category]).forEach(key => {
                        totals[category][key] += setStats[category][key] || 0;
                    });
                });
            }
        }

        return totals;
    };

    // Calculate percentage
    const calcPercentage = (value, total) => {
        if (total === 0) return '0%';
        return `${Math.round((value / total) * 100)}%`;
    };

    // Get stats for a specific set and player
    const getSetStats = (playerName, set) => {
        return stats[playerName]?.[set] || {
            service: { ace: 0, difficult: 0, passed: 0, missed: 0 },
            attack: { scored: 0, placed: 0, missed: 0 },
            pass: { good: 0, medium: 0, bad: 0 },
            reception: { setter: 0, threeMeter: 0, bad: 0 },
            defense: { good: 0, medium: 0, bad: 0 },
            faults: { direct: 0 }
        };
    };

    // Calculate total faults for a player (direct faults + missed services + missed attacks)
    const getTotalFaults = (playerName) => {
        let total = 0;
        for (let set = 1; set <= numSets; set++) {
            const setStats = stats[playerName]?.[set];
            if (setStats) {
                total += setStats.faults?.direct || 0;
                total += setStats.service?.missed || 0;
                total += setStats.attack?.missed || 0;
            }
        }
        return total;
    };

    return (
        <div className="container">
            <div className="summary-container">
                {/* Header */}
                <div className="card summary-header">
                    <h2>📊 Résumé des statistiques</h2>
                    <div className="match-info">
                        <p><strong>Équipe:</strong> {matchInfo.team}</p>
                        <p><strong>Date:</strong> {matchInfo.date}</p>
                        <p><strong>Sets:</strong> {numSets}</p>
                    </div>
                </div>

                {/* Scores by Set */}
                <div className="scores-section">
                    <h3>Scores par set</h3>
                    <div className="card">
                        <div className="scores-grid">
                            {Array.from({ length: numSets }, (_, i) => i + 1).map(set => (
                                <div key={set} className="score-item">
                                    <span className="set-label">Set {set}</span>
                                    <span className="score-display">
                                        {setScores[set]?.team || 0} - {setScores[set]?.opponent || 0}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* By Set */}
                <div className="sets-section">
                    <h3>Statistiques par set</h3>
                    {Array.from({ length: numSets }, (_, i) => i + 1).map(set => (
                        <div key={set} className="card set-card">
                            <h4>Set {set} - Score: {setScores[set]?.team || 0} - {setScores[set]?.opponent || 0}</h4>
                            <div className="table-responsive">
                                <table className="stats-table">
                                    <thead>
                                        <tr>
                                            <th rowSpan="2">Joueur</th>
                                            <th rowSpan="2">Rôle</th>
                                            <th colSpan="4">Service</th>
                                            <th colSpan="3">Attaque</th>
                                            <th colSpan="3">Passe</th>
                                            <th colSpan="3">Réception</th>
                                            <th colSpan="3">Défense</th>
                                            <th rowSpan="2">Fautes</th>
                                        </tr>
                                        <tr>
                                            <th>Ace</th>
                                            <th>Diff.</th>
                                            <th>Pass.</th>
                                            <th>Raté</th>
                                            <th>Marq.</th>
                                            <th>Plac.</th>
                                            <th>Raté</th>
                                            <th>Bon</th>
                                            <th>Moy.</th>
                                            <th>Mauv.</th>
                                            <th>Pass.</th>
                                            <th>3m</th>
                                            <th>Mauv.</th>
                                            <th>Bon</th>
                                            <th>Moy.</th>
                                            <th>Mauv.</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.map(player => {
                                            const s = getSetStats(player.name, set);
                                            const roleLabel = player.role === 'r4' ? 'R4' :
                                                player.role === 'libero' ? 'Libéro' :
                                                    player.role === 'passeur' ? 'Passeur' :
                                                        player.role === 'central' ? 'Central' : 'Pointu';
                                            return (
                                                <tr key={player.name}>
                                                    <td className="player-name">{player.name}</td>
                                                    <td className="player-role">{roleLabel}</td>
                                                    <td>{s.service.ace}</td>
                                                    <td>{s.service.difficult}</td>
                                                    <td>{s.service.passed}</td>
                                                    <td>{s.service.missed}</td>
                                                    <td>{s.attack.scored}</td>
                                                    <td>{s.attack.placed}</td>
                                                    <td>{s.attack.missed}</td>
                                                    <td>{s.pass.good}</td>
                                                    <td>{s.pass.medium}</td>
                                                    <td>{s.pass.bad}</td>
                                                    <td>{s.reception.setter}</td>
                                                    <td>{s.reception.threeMeter}</td>
                                                    <td>{s.reception.bad}</td>
                                                    <td>{s.defense.good}</td>
                                                    <td>{s.defense.medium}</td>
                                                    <td>{s.defense.bad}</td>
                                                    <td className="faults-cell">{s.faults.direct}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="summary-section">
                    <h3>Résumé global</h3>
                    <div className="card">
                        <div className="table-responsive">
                            <table className="stats-table summary-table">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">Joueur</th>
                                        <th rowSpan="2">Rôle</th>
                                        <th colSpan="2">Service</th>
                                        <th colSpan="2">Attaque</th>
                                        <th colSpan="2">Passe</th>
                                        <th colSpan="2">Réception</th>
                                        <th colSpan="2">Défense</th>
                                        <th rowSpan="2">Fautes</th>
                                    </tr>
                                    <tr>
                                        <th>Total</th>
                                        <th>% Ace</th>
                                        <th>Total</th>
                                        <th>% Marq.</th>
                                        <th>Total</th>
                                        <th>% Bon</th>
                                        <th>Total</th>
                                        <th>% Pass.</th>
                                        <th>Total</th>
                                        <th>% Bon</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {players.map(player => {
                                        const totals = calculatePlayerTotals(player.name);
                                        const serviceTotal = totals.service.ace + totals.service.difficult +
                                            totals.service.passed + totals.service.missed;
                                        const attackTotal = totals.attack.scored + totals.attack.placed +
                                            totals.attack.missed;
                                        const passTotal = totals.pass.good + totals.pass.medium + totals.pass.bad;
                                        const receptionTotal = totals.reception.setter + totals.reception.threeMeter +
                                            totals.reception.bad;
                                        const defenseTotal = totals.defense.good + totals.defense.medium + totals.defense.bad;
                                        const roleLabel = player.role === 'r4' ? 'R4' :
                                            player.role === 'libero' ? 'Libéro' :
                                                player.role === 'passeur' ? 'Passeur' :
                                                    player.role === 'central' ? 'Central' : 'Pointu';

                                        return (
                                            <tr key={player.name}>
                                                <td className="player-name">{player.name}</td>
                                                <td className="player-role">{roleLabel}</td>
                                                <td>{serviceTotal}</td>
                                                <td className="percentage">{calcPercentage(totals.service.ace, serviceTotal)}</td>
                                                <td>{attackTotal}</td>
                                                <td className="percentage">{calcPercentage(totals.attack.scored, attackTotal)}</td>
                                                <td>{passTotal}</td>
                                                <td className="percentage">{calcPercentage(totals.pass.good, passTotal)}</td>
                                                <td>{receptionTotal}</td>
                                                <td className="percentage">{calcPercentage(totals.reception.setter, receptionTotal)}</td>
                                                <td>{defenseTotal}</td>
                                                <td className="percentage">{calcPercentage(totals.defense.good, defenseTotal)}</td>
                                                <td className="faults-cell">{getTotalFaults(player.name)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="actions-grid">
                    <button className="btn-secondary btn-large" onClick={onBackToEntry}>
                        ← Retour à la saisie
                    </button>
                    <button className="btn-accent btn-large" onClick={onExport}>
                        📥 Exporter Excel
                    </button>
                    <button className="btn-accent btn-large" onClick={onExportPDF}>
                        📄 Exporter PDF
                    </button>
                    <button className="btn-secondary btn-large" onClick={onReset}>
                        🔄 Nouveau match
                    </button>
                </div>
            </div>
        </div>
    );
}

export default StatsSummary;
