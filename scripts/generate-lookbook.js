const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public');
const outputPath = path.join(outputDir, 'lookbook.pdf');
const imagesDir = path.join(__dirname, '../public/LOOK_BOOK PDF');

async function generatePDF() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0,
    autoFirstPage: false
  });

  doc.pipe(fs.createWriteStream(outputPath));

  // Colors
  const bgMain = '#FDFBF7';
  const textDark = '#241B22';
  const textTeal = '#0E5C52';
  const textPink = '#B23A6B';
  const textGold = '#D4AF37';

  const PAGE_WIDTH = 595.28;
  const PAGE_HEIGHT = 841.89;

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

  if (images.length === 0) {
    console.log("No images found, exiting.");
    return;
  }

  // Helper to add a base page
  const addPage = (bgColor = bgMain) => {
    doc.addPage({ margin: 0 });
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(bgColor);
  };

  // --- COVER PAGE ---
  addPage('#0E5C52');
  
  // Try to use the first image as a cover background
  const coverImg = path.join(imagesDir, images.shift());
  try {
    doc.image(coverImg, 0, 0, {
      width: PAGE_WIDTH,
      height: PAGE_HEIGHT,
      align: 'center',
      valign: 'center'
    });
    // Add dark overlay
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill('black', 'non-zero');
    doc.fillOpacity(0.5);
    doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill('black');
    doc.fillOpacity(1);
  } catch(e) {
    console.log('Cover image error:', e);
  }

  // Cover Text
  doc.fillColor('#FDFBF7')
     .font('Times-Italic')
     .fontSize(48)
     .text('Olivia & Iyanu', 0, PAGE_HEIGHT / 2 - 60, { align: 'center' })
     .moveDown(0.5)
     .font('Times-Roman')
     .fontSize(16)
     .fillColor('#D4AF37')
     .text('WEDDING LOOKBOOK', { align: 'center', letterSpacing: 5 })
     .moveDown(2)
     .fontSize(12)
     .fillColor('#FDFBF7')
     .text('A CURATED GUIDE TO OUR WEDDING STYLE', { align: 'center', letterSpacing: 2 });


  // --- MAGAZINE LAYOUTS ---
  let imgIndex = 0;
  let pageNum = 1;
  const headers = [
    "STYLE INSPIRATION",
    "ASO-EBI GLAMOUR",
    "TRADITIONAL ELEGANCE",
    "GUEST LOOKBOOK",
    "THE PERFECT PALETTE",
    "WEDDING VIBES",
    "ELEVATED STYLE"
  ];

  while (imgIndex < images.length) {
    addPage();
    
    // Add a tasteful header
    const headerText = headers[pageNum % headers.length];
    doc.fillColor(textPink)
       .fontSize(10)
       .font('Times-Bold')
       .text(headerText, 0, 40, { align: 'center', letterSpacing: 3 });

    // We rotate between 3 layout styles to feel like a magazine
    const layoutStyle = pageNum % 3;

    if (layoutStyle === 1 && images.length - imgIndex >= 4) {
      // LAYOUT 1: Grid of 4
      const p = 40; // padding
      const gap = 20;
      const w = (PAGE_WIDTH - p*2 - gap) / 2;
      const h = (PAGE_HEIGHT - p*2 - 80 - gap) / 2; // leave 80px for header/footer

      const coords = [
        {x: p, y: 80},
        {x: p + w + gap, y: 80},
        {x: p, y: 80 + h + gap},
        {x: p + w + gap, y: 80 + h + gap},
      ];

      for (let i = 0; i < 4; i++) {
        const imgPath = path.join(imagesDir, images[imgIndex++]);
        try {
          doc.image(imgPath, coords[i].x, coords[i].y, { fit: [w, h], align: 'center', valign: 'center' });
        } catch(e) {}
      }
    } 
    else if (layoutStyle === 2 && images.length - imgIndex >= 3) {
      // LAYOUT 2: 1 Large Left, 2 Small Right
      const p = 40;
      const gap = 20;
      const w = (PAGE_WIDTH - p*2 - gap) / 2;
      const hFull = PAGE_HEIGHT - p*2 - 80;
      const hSmall = (hFull - gap) / 2;

      // Left Large
      try {
        doc.image(path.join(imagesDir, images[imgIndex++]), p, 80, { fit: [w, hFull], align: 'center', valign: 'center' });
      } catch(e) {}
      
      // Right Top
      try {
        doc.image(path.join(imagesDir, images[imgIndex++]), p + w + gap, 80, { fit: [w, hSmall], align: 'center', valign: 'center' });
      } catch(e) {}

      // Right Bottom
      try {
        doc.image(path.join(imagesDir, images[imgIndex++]), p + w + gap, 80 + hSmall + gap, { fit: [w, hSmall], align: 'center', valign: 'center' });
      } catch(e) {}
    } 
    else if (images.length - imgIndex >= 2) {
      // LAYOUT 0: 2 Vertical Images Side-by-Side
      const p = 50;
      const gap = 30;
      const w = (PAGE_WIDTH - p*2 - gap) / 2;
      const h = PAGE_HEIGHT - p*2 - 80;

      try {
        doc.image(path.join(imagesDir, images[imgIndex++]), p, 80, { fit: [w, h], align: 'center', valign: 'center' });
      } catch(e) {}
      
      try {
        doc.image(path.join(imagesDir, images[imgIndex++]), p + w + gap, 80, { fit: [w, h], align: 'center', valign: 'center' });
      } catch(e) {}
    }
    else {
      // Fallback: 1 Large Centered
      const p = 60;
      const w = PAGE_WIDTH - p*2;
      const h = PAGE_HEIGHT - p*2 - 80;
      try {
        doc.image(path.join(imagesDir, images[imgIndex++]), p, 80, { fit: [w, h], align: 'center', valign: 'center' });
      } catch(e) {}
    }

    // Add footer page number
    doc.fillColor('#A3929A')
       .fontSize(9)
       .text(`— ${pageNum} —`, 0, PAGE_HEIGHT - 30, { align: 'center' });

    pageNum++;
  }

  // --- BACK COVER ---
  addPage('#0E5C52');
  doc.fillColor('#FDFBF7')
     .font('Times-Italic')
     .fontSize(32)
     .text('We can\'t wait to see you', 0, PAGE_HEIGHT / 2 - 20, { align: 'center' })
     .moveDown(1)
     .fontSize(14)
     .font('Times-Roman')
     .text('#LetsDoLifeTogether', { align: 'center', letterSpacing: 2 });


  doc.end();
  console.log(`Magazine PDF generated successfully at ${outputPath}`);
}

generatePDF();
