import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { AdminService } from './AdminService';

export class ReportService {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  private addText(doc: PDFKit.PDFDocument, text: string, x: number, y: number, options: any = {}) {
    // Helper method to ensure text is always readable
    doc.text(text, x, y, {
      ...options,
      lineBreak: true,
      continued: false
    });
  }

  async generateLibraryReport(res: Response): Promise<void> {
    try {
      // Create PDF with simple, reliable settings
      const doc = new PDFDocument({ 
        size: 'A4',
        margin: 50,
        bufferPages: true
      });
      
      // Set response headers
      const filename = `library-report-${new Date().toISOString().split('T')[0]}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      // Pipe to response
      doc.pipe(res);

      // Fetch data
      const stats = await this.adminService.getDashboardStats();
      const reportData = await this.adminService.generateReport();

      // ===== PAGE 1: HEADER AND SUMMARY =====
      
      // Red header background
      doc.rect(0, 0, 595.28, 100).fill('#DC2626');
      
      // Title - White text on red background
      doc.fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .fontSize(28)
         .text('YEKA SUB CITY LIBRARY', 50, 30, { align: 'center' });
      
      doc.fillColor('#FFFFFF')
         .font('Helvetica')
         .fontSize(16)
         .text('Monthly Activity Report', 50, 65, { align: 'center' });
      
      // Reset position after header
      doc.y = 120;
      
      // Report date
      doc.fillColor('#000000')
         .font('Helvetica')
         .fontSize(10)
         .text(`Generated: ${new Date().toLocaleDateString('en-US', { 
           year: 'numeric', 
           month: 'long', 
           day: 'numeric' 
         })}`, 50, 120, { align: 'right' });
      
      doc.moveDown(2);
      
      // Summary Statistics Section
      doc.fillColor('#000000')
         .font('Helvetica-Bold')
         .fontSize(18)
         .text('SUMMARY STATISTICS', 50);
      
      doc.moveDown(1);
      
      // Draw statistics boxes
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
        
        // Box border
        doc.rect(xPos, yPos + yOffset, 230, 70)
           .strokeColor('#CCCCCC')
           .lineWidth(1)
           .stroke();
        
        // Colored left border
        doc.rect(xPos, yPos + yOffset, 5, 70)
           .fillColor(stat.color)
           .fill();
        
        // Label
        doc.fillColor('#666666')
           .font('Helvetica')
           .fontSize(11)
           .text(stat.label, xPos + 15, yPos + yOffset + 15, { width: 200 });
        
        // Value
        doc.fillColor('#000000')
           .font('Helvetica-Bold')
           .fontSize(24)
           .text(stat.value, xPos + 15, yPos + yOffset + 35, { width: 200 });
      });
      
      doc.y = yPos + 170;
      
      // ===== PAGE 2: NEW BOOKS =====
      if (reportData.newBooks && reportData.newBooks.length > 0) {
        doc.addPage();
        
        // Section header
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
        
        // List books
        reportData.newBooks.slice(0, 20).forEach((book: any, index: number) => {
          if (doc.y > 720) {
            doc.addPage();
            doc.y = 50;
          }
          
          // Book entry background
          const bgColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
          doc.rect(50, doc.y, 495, 45)
             .fillColor(bgColor)
             .fill()
             .strokeColor('#E5E7EB')
             .stroke();
          
          // Book number
          doc.fillColor('#3B82F6')
             .font('Helvetica-Bold')
             .fontSize(10)
             .text(`${index + 1}.`, 60, doc.y + 10);
          
          // Book title
          doc.fillColor('#000000')
             .font('Helvetica-Bold')
             .fontSize(11)
             .text(book.title, 80, doc.y + 10, { width: 450, ellipsis: true });
          
          // Author
          doc.fillColor('#666666')
             .font('Helvetica')
             .fontSize(9)
             .text(`Author: ${book.author}`, 80, doc.y + 25, { width: 450 });
          
          doc.y += 50;
        });
      }
      
      // ===== PAGE 3: NEW MEMBERS =====
      if (reportData.newMembers && reportData.newMembers.length > 0) {
        doc.addPage();
        
        // Section header
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
        
        // List members
        reportData.newMembers.slice(0, 25).forEach((member: any, index: number) => {
          if (doc.y > 720) {
            doc.addPage();
            doc.y = 50;
          }
          
          // Member entry
          const bgColor = index % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
          doc.rect(50, doc.y, 495, 35)
             .fillColor(bgColor)
             .fill()
             .strokeColor('#E5E7EB')
             .stroke();
          
          // Member number
          doc.fillColor('#10B981')
             .font('Helvetica-Bold')
             .fontSize(10)
             .text(`${index + 1}.`, 60, doc.y + 8);
          
          // Member name
          doc.fillColor('#000000')
             .font('Helvetica-Bold')
             .fontSize(10)
             .text(member.name, 80, doc.y + 8, { width: 250 });
          
          // Email
          doc.fillColor('#666666')
             .font('Helvetica')
             .fontSize(8)
             .text(member.email, 80, doc.y + 22, { width: 250 });
          
          // Join date
          doc.fillColor('#999999')
             .font('Helvetica')
             .fontSize(8)
             .text(`Joined: ${new Date(member.createdAt).toLocaleDateString()}`, 350, doc.y + 15);
          
          doc.y += 40;
        });
      }
      
      // ===== PAGE 4: POPULAR BOOKS =====
      if (reportData.popularBooks && reportData.popularBooks.length > 0) {
        doc.addPage();
        
        // Section header
        doc.rect(0, 0, 595.28, 60).fill('#F59E0B');
        doc.fillColor('#FFFFFF')
           .font('Helvetica-Bold')
           .fontSize(20)
           .text('MOST POPULAR BOOKS', 50, 20);
        
        doc.y = 80;
        
        // List popular books
        reportData.popularBooks.forEach((book: any, index: number) => {
          if (doc.y > 700) {
            doc.addPage();
            doc.y = 50;
          }
          
          // Book card
          doc.rect(50, doc.y, 495, 60)
             .fillColor('#FFFBEB')
             .fill()
             .strokeColor('#FDE68A')
             .lineWidth(2)
             .stroke();
          
          // Rank badge
          const rankColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'];
          const rankColor = index < 4 ? rankColors[index] : '#6B7280';
          
          doc.circle(75, doc.y + 30, 18)
             .fillColor(rankColor)
             .fill();
          
          doc.fillColor('#FFFFFF')
             .font('Helvetica-Bold')
             .fontSize(14)
             .text((index + 1).toString(), 68, doc.y + 22);
          
          // Book details
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
      
      // ===== PAGE 5: CATEGORIES =====
      doc.addPage();
      
      // Section header
      doc.rect(0, 0, 595.28, 60).fill('#8B5CF6');
      doc.fillColor('#FFFFFF')
         .font('Helvetica-Bold')
         .fontSize(20)
         .text('BOOKS BY CATEGORY', 50, 20);
      
      doc.y = 80;
      
      if (stats.categories && stats.categories.length > 0) {
        stats.categories.forEach((cat: any) => {
          if (doc.y > 720) {
            doc.addPage();
            doc.y = 50;
          }
          
          const percentage = ((cat.totalBooks / stats.books.total) * 100).toFixed(1);
          
          // Category box
          doc.rect(50, doc.y, 495, 50)
             .fillColor('#FAFAFA')
             .fill()
             .strokeColor('#E5E7EB')
             .stroke();
          
          // Category name
          doc.fillColor('#000000')
             .font('Helvetica-Bold')
             .fontSize(12)
             .text(cat.category, 60, doc.y + 10);
          
          // Book count
          doc.fillColor('#666666')
             .font('Helvetica')
             .fontSize(10)
             .text(`${cat.totalBooks} books (${percentage}%)`, 60, doc.y + 28);
          
          // Progress bar
          const barWidth = 300;
          const barX = 220;
          const barY = doc.y + 20;
          const fillWidth = (cat.totalBooks / stats.books.total) * barWidth;
          
          // Bar background
          doc.rect(barX, barY, barWidth, 15)
             .fillColor('#E5E7EB')
             .fill();
          
          // Bar fill
          doc.rect(barX, barY, fillWidth, 15)
             .fillColor('#8B5CF6')
             .fill();
          
          doc.y += 60;
        });
      }
      
      // ===== ADD PAGE NUMBERS TO ALL PAGES =====
      const range = doc.bufferedPageRange();
      for (let i = 0; i < range.count; i++) {
        doc.switchToPage(i);
        
        // Footer background
        doc.rect(0, 792 - 40, 595.28, 40)
           .fillColor('#F3F4F6')
           .fill();
        
        // Footer text
        doc.fillColor('#6B7280')
           .font('Helvetica')
           .fontSize(8)
           .text(
             'Yeka Sub City Library - Confidential Report',
             50,
             792 - 28,
             { align: 'center', width: 495 }
           );
        
        // Page number
        doc.fillColor('#9CA3AF')
           .fontSize(8)
           .text(
             `Page ${i + 1} of ${range.count}`,
             50,
             792 - 15,
             { align: 'center', width: 495 }
           );
      }
      
      // Finalize PDF
      doc.end();
      
    } catch (error) {
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
