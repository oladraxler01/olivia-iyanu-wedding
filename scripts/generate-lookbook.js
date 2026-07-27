const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public');
const outputPath = path.join(outputDir, 'lookbook.pdf');
const imagesDir = path.join(__dirname, '../public/LOOK_BOOK PDF');

async function generatePDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
  });

  doc.pipe(fs.createWriteStream(outputPath));

  // --- COVER PAGE ---
  doc
    .fillColor('#0E5C52') // Emerald Green
    .fontSize(36)
    .font('Times-Italic')
    .text('Olivia & Iyanu', { align: 'center', underline: false }, 200)
    .moveDown(0.5)
    .fontSize(24)
    .fillColor('#241B22')
    .text('Wedding Dress Code Lookbook', { align: 'center' })
    .moveDown(2)
    .fontSize(14)
    .fillColor('#6B5A63')
    .text('Style Inspiration & Ideas', { align: 'center' });

  // Read images
  let images = [];
  try {
    images = fs.readdirSync(imagesDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });
  } catch (error) {
    console.error("Could not read images directory", error);
    images = [];
  }

  // --- IMAGE PAGES ---
  // We'll place 2 images per page
  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;
  const MARGIN = 50;
  
  const contentWidth = PAGE_WIDTH - (MARGIN * 2);
  const contentHeight = (PAGE_HEIGHT - (MARGIN * 3)) / 2;

  images.forEach((imgFile, index) => {
    const imgPath = path.join(imagesDir, imgFile);
    
    if (index % 2 === 0) {
      doc.addPage();
    }

    const isTop = index % 2 === 0;
    const yPos = isTop ? MARGIN : MARGIN * 2 + contentHeight;

    try {
      doc.image(imgPath, MARGIN, yPos, {
        fit: [contentWidth, contentHeight],
        align: 'center',
        valign: 'center'
      });
    } catch (e) {
      console.error(`Failed to add image: ${imgFile}`, e);
    }
  });

  // Finalize PDF file
  doc.end();
  console.log(`PDF generated successfully at ${outputPath}`);
}

generatePDF();
