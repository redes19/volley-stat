import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToPDF(stats, players, numSets, matchInfo, setScores) {
    console.log('PDF Export V3 - Loaded');
    try {
        const doc = new jsPDF();

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

        // Helper to calculate totals
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
            if (total === 0) return '0%';
            return `${Math.round((value / total) * 100)}%`;
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

        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Statistiques de Match - Volleyball', 105, 15, { align: 'center' });

        // Match info
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Équipe: ${matchInfo.team}`, 14, 25);
        doc.text(`Date: ${matchInfo.date}`, 14, 31);

        // Scores
        let yPos = 40;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Scores par set', 14, yPos);

        yPos += 7;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        for (let set = 1; set <= numSets; set++) {
            const score = setScores[set] || { team: 0, opponent: 0 };
            doc.text(`Set ${set}: ${score.team} - ${score.opponent}`, 14, yPos);
            yPos += 6;
        }

        // Summary table
        yPos += 5;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Résumé global', 14, yPos);
        yPos += 5;

        const summaryHeaders = [
            'Joueur',
            'Rôle',
            'Serv.\nTotal',
            'Serv.\n% Ace',
            'Att.\nTotal',
            'Att.\n% Marq.',
            'Pass.\nTotal',
            'Pass.\n% Bon',
            'Récep.\nTotal',
            'Récep.\n% Pass.',
            'Déf.\nTotal',
            'Déf.\n% Bon',
            'Fautes\nTotales'
        ];

        const summaryData = players.map(player => {
            const totals = calculatePlayerTotals(player.name);
            const serviceTotal = totals.service.ace + totals.service.difficult +
                totals.service.passed + totals.service.missed;
            const attackTotal = totals.attack.scored + totals.attack.placed +
                totals.attack.missed;
            const passTotal = totals.pass.good + totals.pass.medium + totals.pass.bad;
            const receptionTotal = totals.reception.setter + totals.reception.threeMeter +
                totals.reception.bad;
            const defenseTotal = totals.defense.good + totals.defense.medium + totals.defense.bad;
            const totalFaults = calculateTotalFaults(player.name);

            return [
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
                totalFaults
            ];
        });

        autoTable(doc, {
            startY: yPos,
            head: [summaryHeaders],
            body: summaryData,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [73, 80, 87], fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 15 },
                12: { fillColor: [255, 235, 235], textColor: [220, 53, 69] }
            }
        });

        // Detailed stats by set
        let currentPage = 1;
        for (let set = 1; set <= numSets; set++) {
            if (currentPage > 1 || doc.lastAutoTable.finalY > 200) {
                doc.addPage();
                currentPage++;
            }

            const score = setScores[set] || { team: 0, opponent: 0 };
            yPos = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 60;

            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`Set ${set} - Score: ${score.team} - ${score.opponent}`, 14, yPos);
            yPos += 5;

            const setHeaders = [
                'Joueur',
                'Rôle',
                'Serv.\nAce',
                'Serv.\nDiff.',
                'Serv.\nRaté',
                'Att.\nMarq.',
                'Att.\nRaté',
                'Pass.\nBon',
                'Récep.\nPass.',
                'Déf.\nBon',
                'Fautes'
            ];

            const setData = players.map(player => {
                const s = stats[player.name]?.[set] || {
                    service: { ace: 0, difficult: 0, passed: 0, missed: 0 },
                    attack: { scored: 0, placed: 0, missed: 0 },
                    pass: { good: 0, medium: 0, bad: 0 },
                    reception: { setter: 0, threeMeter: 0, bad: 0 },
                    defense: { good: 0, medium: 0, bad: 0 },
                    faults: { direct: 0 }
                };

                const setFaults = (s.faults?.direct || 0) + (s.service?.missed || 0) + (s.attack?.missed || 0);

                return [
                    player.name,
                    getRoleLabel(player.role),
                    s.service.ace,
                    s.service.difficult,
                    s.service.missed,
                    s.attack.scored,
                    s.attack.missed,
                    s.pass.good,
                    s.reception.setter,
                    s.defense.good,
                    setFaults
                ];
            });

            autoTable(doc, {
                startY: yPos,
                head: [setHeaders],
                body: setData,
                theme: 'striped',
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [34, 139, 230], fontStyle: 'bold' },
                columnStyles: {
                    0: { cellWidth: 25 },
                    1: { cellWidth: 15 },
                    10: { fillColor: [255, 235, 235], textColor: [220, 53, 69] }
                }
            });
        }

        // Save PDF
        const date = matchInfo.date.replace(/\//g, '-');
        const filename = `Volley_Stats_${matchInfo.team}_${date}.pdf`;
        doc.save(filename);
        console.log('PDF exported successfully:', filename);
    } catch (error) {
        console.error('Error exporting PDF:', error);
        alert('Erreur lors de l\'export PDF: ' + error.message);
    }
}
