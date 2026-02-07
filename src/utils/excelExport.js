import * as XLSX from 'xlsx';

export function exportToExcel(stats, players, numSets, matchInfo, setScores) {
    const workbook = XLSX.utils.book_new();

    // Helper function to calculate totals
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

    // Helper to calculate percentage
    const calcPercentage = (value, total) => {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    };

    // Helper to calculate total faults (direct + missed services + missed attacks)
    const calculateTotalFaults = (playerName) => {
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

    // Helper to get role label
    const getRoleLabel = (role) => {
        const roleMap = {
            'passeur': 'Passeur',
            'libero': 'Libéro',
            'r4': 'R4',
            'central': 'Central',
            'pointu': 'Pointu'
        };
        return roleMap[role] || role;
    };

    // Create a sheet for each set
    for (let set = 1; set <= numSets; set++) {
        const sheetData = [];

        // Header
        const score = setScores[set] || { team: 0, opponent: 0 };
        sheetData.push([`Set ${set} - ${matchInfo.team} - ${matchInfo.date}`]);
        sheetData.push([`Score: ${score.team} - ${score.opponent}`]);
        sheetData.push([]);

        // Column headers
        sheetData.push([
            'Joueur', 'Rôle',
            'Service Ace', 'Service Diff.', 'Service Passé', 'Service Raté',
            'Attaque Marqué', 'Attaque Placé', 'Attaque Raté',
            'Passe Bonne', 'Passe Moyen', 'Passe Mauvaise',
            'Récep. Passeur', 'Récep. 3m', 'Récep. Mauvais',
            'Déf. Bonne', 'Déf. Moyen', 'Déf. Mauvaise',
            'Fautes Directes'
        ]);

        // Data rows
        players.forEach(player => {
            const s = stats[player.name]?.[set] || {
                service: { ace: 0, difficult: 0, passed: 0, missed: 0 },
                attack: { scored: 0, placed: 0, missed: 0 },
                pass: { good: 0, medium: 0, bad: 0 },
                reception: { setter: 0, threeMeter: 0, bad: 0 },
                defense: { good: 0, medium: 0, bad: 0 },
                faults: { direct: 0 }
            };

            const setFaults = (s.faults?.direct || 0) + (s.service?.missed || 0) + (s.attack?.missed || 0);

            sheetData.push([
                player.name,
                getRoleLabel(player.role),
                s.service.ace, s.service.difficult, s.service.passed, s.service.missed,
                s.attack.scored, s.attack.placed, s.attack.missed,
                s.pass.good, s.pass.medium, s.pass.bad,
                s.reception.setter, s.reception.threeMeter, s.reception.bad,
                s.defense.good, s.defense.medium, s.defense.bad,
                setFaults
            ]);
        });

        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 15 }, // Player name
            { wch: 12 }, // Role
            ...Array(17).fill({ wch: 12 }) // Stats columns
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, `Set ${set}`);
    }

    // Create summary sheet
    const summaryData = [];

    summaryData.push([`Résumé - ${matchInfo.team} - ${matchInfo.date}`]);
    summaryData.push([]);

    // Scores section
    summaryData.push(['Scores par set']);
    const scoresRow = ['Set'];
    const scoresValues = ['Score'];
    for (let set = 1; set <= numSets; set++) {
        const score = setScores[set] || { team: 0, opponent: 0 };
        scoresRow.push(`Set ${set}`);
        scoresValues.push(`${score.team} - ${score.opponent}`);
    }
    summaryData.push(scoresRow);
    summaryData.push(scoresValues);
    summaryData.push([]);

    // Headers
    summaryData.push([
        'Joueur', 'Rôle',
        'Service Total', 'Service % Ace',
        'Attaque Total', 'Attaque % Marqué',
        'Passe Total', 'Passe % Bonne',
        'Réception Total', 'Réception % Passeur',
        'Défense Total', 'Défense % Bonne',
        'Total Fautes'
    ]);

    // Data rows
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);

        const serviceTotal = totals.service.ace + totals.service.difficult +
            totals.service.passed + totals.service.missed;
        const attackTotal = totals.attack.scored + totals.attack.placed +
            totals.attack.missed;
        const passTotal = totals.pass.good + totals.pass.medium + totals.pass.bad;
        const receptionTotal = totals.reception.setter + totals.reception.threeMeter +
            totals.reception.bad;
        const defenseTotal = totals.defense.good + totals.defense.medium + totals.defense.bad;

        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            serviceTotal,
            calcPercentage(totals.service.ace, serviceTotal),
            attackTotal,
            calcPercentage(totals.attack.scored, attackTotal),
            passTotal,
            calcPercentage(totals.pass.good, passTotal),
            receptionTotal,
            calcPercentage(totals.reception.setter, receptionTotal),
            defenseTotal,
            calcPercentage(totals.defense.good, defenseTotal),
            calculateTotalFaults(player.name)
        ]);
    });

    summaryData.push([]);
    summaryData.push(['Détails par catégorie']);
    summaryData.push([]);

    // Detailed breakdown
    summaryData.push(['Joueur', 'Rôle', 'Service Ace', 'Service Diff.', 'Service Passé', 'Service Raté']);
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);
        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            totals.service.ace,
            totals.service.difficult,
            totals.service.passed,
            totals.service.missed
        ]);
    });

    summaryData.push([]);
    summaryData.push(['Joueur', 'Rôle', 'Attaque Marqué', 'Attaque Placé', 'Attaque Raté']);
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);
        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            totals.attack.scored,
            totals.attack.placed,
            totals.attack.missed
        ]);
    });

    summaryData.push([]);
    summaryData.push(['Joueur', 'Rôle', 'Passe Bonne', 'Passe Moyen', 'Passe Mauvaise']);
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);
        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            totals.pass.good,
            totals.pass.medium,
            totals.pass.bad
        ]);
    });

    summaryData.push([]);
    summaryData.push(['Joueur', 'Rôle', 'Récep. Passeur', 'Récep. 3m', 'Récep. Mauvais']);
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);
        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            totals.reception.setter,
            totals.reception.threeMeter,
            totals.reception.bad
        ]);
    });

    summaryData.push([]);
    summaryData.push(['Joueur', 'Rôle', 'Déf. Bonne', 'Déf. Moyen', 'Déf. Mauvaise']);
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);
        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            totals.defense.good,
            totals.defense.medium,
            totals.defense.bad
        ]);
    });

    summaryData.push([]);
    summaryData.push(['Joueur', 'Rôle', 'Fautes Directes', 'Services Ratés', 'Attaques Ratées', 'Total Fautes']);
    players.forEach(player => {
        const totals = calculatePlayerTotals(player.name);
        summaryData.push([
            player.name,
            getRoleLabel(player.role),
            totals.faults.direct,
            totals.service.missed,
            totals.attack.missed,
            calculateTotalFaults(player.name)
        ]);
    });

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths
    summaryWorksheet['!cols'] = [
        { wch: 15 }, // Player name
        { wch: 12 }, // Role
        ...Array(11).fill({ wch: 15 }) // Stats columns
    ];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Résumé');

    // Generate filename
    const date = matchInfo.date.replace(/\//g, '-');
    const filename = `Volley_Stats_${matchInfo.team}_${date}.xlsx`;

    // Write and download
    XLSX.writeFile(workbook, filename);
}
