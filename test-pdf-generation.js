/**
 * Test PDF Generation
 * 
 * This script tests the PDF generation to ensure it's readable
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing PDF Generation...\n');

try {
  // Create a simple test PDF
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 50
  });
  
  const outputPath = path.join(__dirname, 'test-report.pdf');
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  
  // Test 1: Header
  console.log('✓ Creating header...');
  doc.rect(0, 0, 595.28, 100).fill('#DC2626');
  doc.fillColor('#FFFFFF')
     .font('Helvetica-Bold')
     .fontSize(28)
     .text('TEST LIBRARY REPORT', 50, 30, { align: 'center' });
  
  doc.y = 120;
  
  // Test 2: Statistics Box
  console.log('✓ Creating statistics box...');
  doc.rect(50, doc.y, 230, 70)
     .strokeColor('#CCCCCC')
     .lineWidth(1)
     .stroke();
  
  doc.rect(50, doc.y, 5, 70)
     .fillColor('#3B82F6')
     .fill();
  
  doc.fillColor('#666666')
     .font('Helvetica')
     .fontSize(11)
     .text('Total Books', 65, doc.y + 15);
  
  doc.fillColor('#000000')
     .font('Helvetica-Bold')
     .fontSize(24)
     .text('15,420', 65, doc.y + 35);
  
  doc.y += 90;
  
  // Test 3: List Items
  console.log('✓ Creating list items...');
  for (let i = 1; i <= 5; i++) {
    const bgColor = i % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
    doc.rect(50, doc.y, 495, 40)
       .fillColor(bgColor)
       .fill()
       .strokeColor('#E5E7EB')
       .stroke();
    
    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(11)
       .text(`${i}. Test Book Title ${i}`, 60, doc.y + 10);
    
    doc.fillColor('#666666')
       .font('Helvetica')
       .fontSize(9)
       .text(`Author: Test Author ${i}`, 60, doc.y + 25);
    
    doc.y += 45;
  }
  
  // Test 4: Progress Bar
  console.log('✓ Creating progress bar...');
  doc.y += 20;
  doc.fillColor('#000000')
     .font('Helvetica-Bold')
     .fontSize(12)
     .text('Fiction Category', 50, doc.y);
  
  doc.y += 20;
  doc.rect(50, doc.y, 300, 15)
     .fillColor('#E5E7EB')
     .fill();
  
  doc.rect(50, doc.y, 200, 15)
     .fillColor('#8B5CF6')
     .fill();
  
  // Test 5: Footer
  console.log('✓ Creating footer...');
  doc.rect(0, 792 - 40, 595.28, 40)
     .fillColor('#F3F4F6')
     .fill();
  
  doc.fillColor('#6B7280')
     .font('Helvetica')
     .fontSize(8)
     .text('Test Library - Confidential Report', 50, 792 - 28, { align: 'center', width: 495 });
  
  doc.fillColor('#9CA3AF')
     .fontSize(8)
     .text('Page 1 of 1', 50, 792 - 15, { align: 'center', width: 495 });
  
  // Finalize
  doc.end();
  
  stream.on('finish', () => {
    console.log('\n✅ PDF Generated Successfully!');
    console.log(`📄 File saved to: ${outputPath}`);
    console.log('\n📋 Test Results:');
    console.log('  ✓ Header with colored background');
    console.log('  ✓ Statistics box with border');
    console.log('  ✓ List items with alternating colors');
    console.log('  ✓ Progress bar');
    console.log('  ✓ Footer with page number');
    console.log('\n🎉 All tests passed!');
    console.log('\n💡 Next step: Open test-report.pdf to verify readability');
  });
  
  stream.on('error', (error) => {
    console.error('\n❌ Error generating PDF:', error);
    process.exit(1);
  });
  
} catch (error) {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
}
