import { useState } from 'react';
import './App.css';
import PlayerSetup from './components/PlayerSetup';
import StatEntry from './components/StatEntry';
import StatsSummary from './components/StatsSummary';
import { exportToExcel } from './utils/excelExport';
import { exportToPDF } from './utils/pdfExport';

function App() {
  const [step, setStep] = useState('setup'); // setup, entry, summary
  const [players, setPlayers] = useState([]); // Array of {name, role}
  const [numSets, setNumSets] = useState(3);
  const [matchInfo, setMatchInfo] = useState({ date: '', team: '' });
  const [stats, setStats] = useState({});
  const [setScores, setSetScores] = useState({}); // {1: {team: 25, opponent: 23}, ...}

  const handleSetupComplete = (playersData, sets, info) => {
    setPlayers(playersData);
    setNumSets(sets);
    setMatchInfo(info);

    // Initialize stats structure with role-based categories
    const initialStats = {};
    const initialScores = {};

    playersData.forEach(player => {
      initialStats[player.name] = {};
      for (let i = 1; i <= sets; i++) {
        initialStats[player.name][i] = {
          service: { ace: 0, difficult: 0, passed: 0, missed: 0 },
          attack: { scored: 0, placed: 0, missed: 0 },
          pass: { good: 0, medium: 0, bad: 0 },
          reception: { setter: 0, threeMeter: 0, bad: 0 },
          defense: { good: 0, medium: 0, bad: 0 },
          faults: { direct: 0 } // Fautes directes
        };
      }
    });

    // Initialize set scores
    for (let i = 1; i <= sets; i++) {
      initialScores[i] = { team: 0, opponent: 0 };
    }

    setStats(initialStats);
    setSetScores(initialScores);
    setStep('entry');
  };

  const handleStatUpdate = (player, set, category, subcategory, value) => {
    setStats(prev => ({
      ...prev,
      [player]: {
        ...prev[player],
        [set]: {
          ...prev[player][set],
          [category]: {
            ...prev[player][set][category],
            [subcategory]: value
          }
        }
      }
    }));
  };

  const handleSetScoreUpdate = (set, team, opponent) => {
    setSetScores(prev => ({
      ...prev,
      [set]: { team, opponent }
    }));
  };

  const handleViewSummary = () => {
    setStep('summary');
  };

  const handleBackToEntry = () => {
    setStep('entry');
  };

  const handleExport = () => {
    exportToExcel(stats, players, numSets, matchInfo, setScores);
  };

  const handleExportPDF = () => {
    exportToPDF(stats, players, numSets, matchInfo, setScores);
  };


  const handleReset = () => {
    setStep('setup');
    setPlayers([]);
    setNumSets(3);
    setMatchInfo({ date: '', team: '' });
    setStats({});
    setSetScores({});
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🏐 Volley Stats</h1>
          <p className="text-secondary">Statistiques de match de volleyball</p>
        </div>
      </header>

      <main className="app-main">
        {step === 'setup' && (
          <PlayerSetup onComplete={handleSetupComplete} />
        )}

        {step === 'entry' && (
          <StatEntry
            players={players}
            numSets={numSets}
            stats={stats}
            setScores={setScores}
            onStatUpdate={handleStatUpdate}
            onSetScoreUpdate={handleSetScoreUpdate}
            onViewSummary={handleViewSummary}
          />
        )}

        {step === 'summary' && (
          <StatsSummary
            players={players}
            numSets={numSets}
            stats={stats}
            setScores={setScores}
            matchInfo={matchInfo}
            onBackToEntry={handleBackToEntry}
            onExport={handleExport}
            onExportPDF={handleExportPDF}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="app-footer">
        <div className="container text-center text-secondary">
          <small>Application de statistiques de volleyball</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
