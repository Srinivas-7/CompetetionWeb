/**
 * Gajotsav 2026 Official Leaderboard PDF Generator
 * Renders high-quality PDF containing all 21 pandhal names and their real-time votes
 * (Location column excluded as requested)
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function downloadFullLeaderboardPDF(sortedPandhals = [], totalVotes = 0) {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // 1. Royal Maroon Header Banner
    doc.setFillColor(107, 20, 20); // Maroon #6B1414
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text("GAJOTSAV 2026 - OFFICIAL LEADERBOARD", 14, 15);

    doc.setFontSize(9);
    doc.setTextColor(223, 191, 122); // Shimmer Gold #DFBF7A
    doc.text("AUDITED PUBLIC VOTE TALLY • ALL 21 PARTICIPATING BAPPAS", 14, 22);

    // 2. Metadata Box
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    doc.text(`Generated on: ${dateStr} IST`, 14, 36);
    doc.text(`Total Verified Votes Counted: ${(totalVotes || 0).toLocaleString('en-IN')}`, 130, 36);

    // 3. Prepare table data (Rank, Pandhal Name, Votes, Share)
    const effectiveTotal = totalVotes > 0 ? totalVotes : 1;
    const tableBody = sortedPandhals.map((item, idx) => {
      const votes = item.votes || 0;
      const share = totalVotes > 0 ? `${((votes / effectiveTotal) * 100).toFixed(1)}%` : '0.0%';
      return [
        `#${idx + 1}`,
        `#${String(item.number || idx + 1).padStart(2, '0')} ${item.name}`,
        votes.toLocaleString('en-IN'),
        share
      ];
    });

    // 4. Draw Table using autoTable
    autoTable(doc, {
      startY: 42,
      head: [['Rank', 'Pandhal Name', 'Votes', 'Share']],
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [107, 20, 20],
        textColor: [255, 255, 255],
        fontSize: 9.5,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [40, 40, 40]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
        1: { cellWidth: 105 },
        2: { halign: 'right', cellWidth: 30, fontStyle: 'bold' },
        3: { halign: 'center', cellWidth: 25 }
      },
      alternateRowStyles: {
        fillColor: [251, 247, 240] // Warm Ivory
      },
      margin: { left: 14, right: 14 }
    });

    // 5. Footer Certification Note
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 12 : 275;
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("Official public record published for transparent devotees verification. Ganpati Bappa Morya!", 14, Math.min(finalY, 285));

    // 6. Trigger Download
    doc.save("Gajotsav_2026_Full_Leaderboard.pdf");
    return true;
  } catch (err) {
    console.error("PDF generation failed:", err);
    return false;
  }
}
