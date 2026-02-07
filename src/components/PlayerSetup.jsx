import { useState } from 'react';
import './PlayerSetup.css';

function PlayerSetup({ onComplete }) {
    const [players, setPlayers] = useState([{ name: '', role: 'r4' }]);
    const [numSets, setNumSets] = useState(3);
    const [matchDate, setMatchDate] = useState('');
    const [teamName, setTeamName] = useState('');

    const roles = [
        { value: 'passeur', label: 'Passeur' },
        { value: 'libero', label: 'Libéro' },
        { value: 'r4', label: 'Réceptionneur-Attaquant (R4)' },
        { value: 'central', label: 'Central' },
        { value: 'pointu', label: 'Pointu' }
    ];

    const addPlayer = () => {
        setPlayers([...players, { name: '', role: 'r4' }]);
    };

    const removePlayer = (index) => {
        if (players.length > 1) {
            setPlayers(players.filter((_, i) => i !== index));
        }
    };

    const updatePlayer = (index, field, value) => {
        const updated = [...players];
        updated[index][field] = value;
        setPlayers(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validPlayers = players.filter(p => p.name.trim() !== '');

        if (validPlayers.length === 0) {
            alert('Veuillez ajouter au moins un joueur');
            return;
        }

        if (numSets < 1 || numSets > 10) {
            alert('Le nombre de sets doit être entre 1 et 10');
            return;
        }

        onComplete(validPlayers, numSets, {
            date: matchDate || new Date().toLocaleDateString('fr-FR'),
            team: teamName || 'Mon équipe'
        });
    };

    return (
        <div className="container">
            <div className="card setup-card">
                <h2>Configuration du match</h2>
                <p className="text-secondary mb-lg">
                    Configurez les joueurs et les paramètres du match
                </p>

                <form onSubmit={handleSubmit}>
                    {/* Match Info */}
                    <div className="form-section">
                        <h3>Informations du match</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="teamName">Nom de l'équipe</label>
                                <input
                                    id="teamName"
                                    type="text"
                                    placeholder="Mon équipe"
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="matchDate">Date du match</label>
                                <input
                                    id="matchDate"
                                    type="date"
                                    value={matchDate}
                                    onChange={(e) => setMatchDate(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Players */}
                    <div className="form-section">
                        <h3>Joueurs</h3>
                        <div className="players-list">
                            {players.map((player, index) => (
                                <div key={index} className="player-input-row">
                                    <input
                                        type="text"
                                        placeholder={`Nom du joueur ${index + 1}`}
                                        value={player.name}
                                        onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                                        className="player-name-input"
                                    />
                                    <select
                                        value={player.role}
                                        onChange={(e) => updatePlayer(index, 'role', e.target.value)}
                                        className="player-role-select"
                                    >
                                        {roles.map(role => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                    {players.length > 1 && (
                                        <button
                                            type="button"
                                            className="btn-secondary btn-small"
                                            onClick={() => removePlayer(index)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="btn-secondary mt-md"
                            onClick={addPlayer}
                        >
                            + Ajouter un joueur
                        </button>
                    </div>

                    {/* Sets */}
                    <div className="form-section">
                        <h3>Nombre de sets</h3>
                        <div className="form-group">
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={numSets}
                                onChange={(e) => setNumSets(parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-accent btn-large mt-xl">
                        Commencer la saisie →
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PlayerSetup;
