"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AdminService_1 = require("./AdminService");
class ReportService {
    constructor() {
        this.adminService = new AdminService_1.AdminService();
    }
    addText(doc, text, x, y, options = {}) {
        doc.text(text, x, y, {
            ...options,
            lineBreak: true,
            continued: false
        });
    }
    async generateLibraryReport(res) {
        try {
            const doc = new pdfkit_1.default({
                size: 'A4',
                margin: 50,
                bufferPages: true
            });
            const filename = `library-report-${new Date().toISOString().split('T')[0]}.pdf`;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            doc.pipe(res);
            const stats = await this.adminService.getDashboardStats();
            const reportData = await this.adminService.generateReport();
            doc.rect(0, 0, 595.28, 100).fill('#DC2626');
            doc.fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .fontSize(28)
                .text('YEKA SUB CITY LIBRARY', 50, 30, { align: 'center' });
            doc.fillColor('#FFFFFF')
                .font('Helvetica')
                .fontSize(16)
                .text('Monthly Activity Report', 50, 65, { align: 'center' });
            doc.y = 120;
            doc.fillColor('#000000')
                .font('Helvetica')
                .fontSize(10)
                .text(`Generated: ${new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`, 50, 120, { align: 'right' });
            doc.moveDown(2);
            doc.fillColor('#000000')
                .font('Helvetica-Bold')
                .fontSize(18)
                .text('SUMMARY STATISTICS', 50);
            doc.moveDown(1);
            const statsData = [
                { label: 'Total Books', value: stats.books.total.toString(), color: '#3B82F6' },
                { label: 'Total Members', value: stats.users.total.toString(), color: '#10B981' },
                { label: 'Books Borrowed', value: stats.bookings.approved.toString(), color: '#F59E0B' },
                { label: 'Overdue Books', value: stats.bookings.overdue.toString(), color: '#EF4444' }
            ];
            let yPos = doc.y;
            statsData.forEach((stat, index) => {
                const xPos = 50 + (index % 2) * 250;
                const yOffset = Math.floor(index / 2) * 80;
                doc.rect(xPos, yPos + yOffset, 230, 70)
                    .strokeColor('#CCCCCC')
                    .lineWidth(1)
                    .stroke();
                doc.rect(xPos, yPos + yOffset, 5, 70)
                    .fillColor(stat.color)
                    .fill();
                doc.fillColor('#666666')
                    .font('Helvetica')
                    .fontSize(11)
                    .text(stat.label, xPos + 15, yPos + yOffset + 15, { width: 200 });
                doc.fillColor('#000000')
                    .font('Helvetica-Bold')
                    .fontSize(24)
                    .text(stat.value, xPos + 15, yPos + yOffset + 35, { width: 200 });
            });
            doc.y = yPos + 170;
            if (reportData.newBooks && reportData.newBooks.length > 0) {
                doc.addPage();
                doc.rect(0, 0, 595.28, 60).fill('#3B82F6');
                doc.fillColor('#FFFFFF')
                    .font('Helvetica-Bold')
                    .fontSize(20)
                    .text('NEW BOOKS THIS MONTH', 50, 20);
                doc.fillColor('#E0F2FE')
                    .font('Helvetica')
                    .fontSize(12)
                    .text(`${reportData.newBooks.length} books added`, 50, 42);
                doc.y = 80;
                reportData.newBooks.slice(0, 20).forEach((book, index) => {
                    if (doc.y > 720) {
                        doc.addPage();
                        doc.y = 50;
                    }
                    const bgColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
                    doc.rect(50, doc.y, 495, 45)
                        .fillColor(bgColor)
                        .fill()
                        .strokeColor('#E5E7EB')
                        .stroke();
                    doc.fillColor('#3B82F6')
                        .font('Helvetica-Bold')
                        .fontSize(10)
                        .text(`${index + 1}.`, 60, doc.y + 10);
                    doc.fillColor('#000000')
                        .font('Helvetica-Bold')
                        .fontSize(11)
                        .text(book.title, 80, doc.y + 10, { width: 450, ellipsis: true });
                    doc.fillColor('#666666')
                        .font('Helvetica')
                        .fontSize(9)
                        .text(`Author: ${book.author}`, 80, doc.y + 25, { width: 450 });
                    doc.y += 50;
                });
            }
            if (reportData.newMembers && reportData.newMembers.length > 0) {
                doc.addPage();
                doc.rect(0, 0, 595.28, 60).fill('#10B981');
                doc.fillColor('#FFFFFF')
                    .font('Helvetica-Bold')
                    .fontSize(20)
                    .text('NEW MEMBERS THIS MONTH', 50, 20);
                doc.fillColor('#D1FAE5')
                    .font('Helvetica')
                    .fontSize(12)
                    .text(`${reportData.newMembers.length} members joined`, 50, 42);
                doc.y = 80;
                reportData.newMembers.slice(0, 25).forEach((member, index) => {
                    if (doc.y > 720) {
                        doc.addPage();
                        doc.y = 50;
                    }
                    const bgColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
                    doc.rect(50, doc.y, 495, 35)
                        .fillColor(bgColor)
                        .fill()
                        .strokeColor('#E5E7EB')
                        .stroke();
                    doc.fillColor('#10B981')
                        .font('Helvetica-Bold')
                        .fontSize(10)
                        .text(`${index + 1}.`, 60, doc.y + 8);
                    doc.fillColor('#000000')
                        .font('Helvetica-Bold')
                        .fontSize(10)
                        .text(member.name, 80, doc.y + 8, { width: 250 });
                    doc.fillColor('#666666')
                        .font('Helvetica')
                        .fontSize(8)
                        .text(member.email, 80, doc.y + 22, { width: 250 });
                    doc.fillColor('#999999')
                        .font('Helvetica')
                        .fontSize(8)
                        .text(`Joined: ${new Date(member.createdAt).toLocaleDateString()}`, 350, doc.y + 15);
                    doc.y += 40;
                });
            }
            if (reportData.popularBooks && reportData.popularBooks.length > 0) {
                doc.addPage();
                doc.rect(0, 0, 595.28, 60).fill('#F59E0B');
                doc.fillColor('#FFFFFF')
                    .font('Helvetica-Bold')
                    .fontSize(20)
                    .text('MOST POPULAR BOOKS', 50, 20);
                doc.y = 80;
                reportData.popularBooks.forEach((book, index) => {
                    if (doc.y > 700) {
                        doc.addPage();
                        doc.y = 50;
                    }
                    doc.rect(50, doc.y, 495, 60)
                        .fillColor('#FFFBEB')
                        .fill()
                        .strokeColor('#FDE68A')
                        .lineWidth(2)
                        .stroke();
                    const rankColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
                    const rankColor = index < 4 ? rankColors[index] : '#6B7280';
                    doc.circle(75, doc.y + 30, 18)
                        .fillColor(rankColor)
                        .fill();
                    doc.fillColor('#FFFFFF')
                        .font('Helvetica-Bold')
                        .fontSize(14)
                        .text((index + 1).toString(), 68, doc.y + 22);
                    doc.fillColor('#000000')
                        .font('Helvetica-Bold')
                        .fontSize(12)
                        .text(book.title, 105, doc.y + 12, { width: 420, ellipsis: true });
                    doc.fillColor('#666666')
                        .font('Helvetica')
                        .fontSize(10)
                        .text(`by ${book.author}`, 105, doc.y + 30, { width: 420 });
                    doc.fillColor('#92400E')
                        .font('Helvetica')
                        .fontSize(9)
                        .text(`Borrowed: ${book.borrowCount || 0} times`, 105, doc.y + 45);
                    doc.y += 70;
                });
            }
            doc.addPage();
            doc.rect(0, 0, 595.28, 60).fill('#8B5CF6');
            doc.fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .fontSize(20)
                .text('BOOKS BY CATEGORY', 50, 20);
            doc.y = 80;
            if (stats.categories && stats.categories.length > 0) {
                stats.categories.forEach((cat) => {
                    if (doc.y > 720) {
                        doc.addPage();
                        doc.y = 50;
                    }
                    const percentage = ((cat.totalBooks / stats.books.total) * 100).toFixed(1);
                    doc.rect(50, doc.y, 495, 50)
                        .fillColor('#FAFAFA')
                        .fill()
                        .strokeColor('#E5E7EB')
                        .stroke();
                    doc.fillColor('#000000')
                        .font('Helvetica-Bold')
                        .fontSize(12)
                        .text(cat.category, 60, doc.y + 10);
                    doc.fillColor('#666666')
                        .font('Helvetica')
                        .fontSize(10)
                        .text(`${cat.totalBooks} books (${percentage}%)`, 60, doc.y + 28);
                    const barWidth = 300;
                    const barX = 220;
                    const barY = doc.y + 20;
                    const fillWidth = (cat.totalBooks / stats.books.total) * barWidth;
                    doc.rect(barX, barY, barWidth, 15)
                        .fillColor('#E5E7EB')
                        .fill();
                    doc.rect(barX, barY, fillWidth, 15)
                        .fillColor('#8B5CF6')
                        .fill();
                    doc.y += 60;
                });
            }
            const range = doc.bufferedPageRange();
            for (let i = 0; i < range.count; i++) {
                doc.switchToPage(i);
                doc.rect(0, 792 - 40, 595.28, 40)
                    .fillColor('#F3F4F6')
                    .fill();
                doc.fillColor('#6B7280')
                    .font('Helvetica')
                    .fontSize(8)
                    .text('Yeka Sub City Library - Confidential Report', 50, 792 - 28, { align: 'center', width: 495 });
                doc.fillColor('#9CA3AF')
                    .fontSize(8)
                    .text(`Page ${i + 1} of ${range.count}`, 50, 792 - 15, { align: 'center', width: 495 });
            }
            doc.end();
        }
        catch (error) {
            console.error('PDF generation error:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to generate PDF report',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=ReportService.js.map