
import jsPDF from 'jspdf';
import logoBase64Data from './logo-base64.js';

const {
  insigniaRomanFont,
  logoBase64,
  emailIconBase64,
  websiteIconBase64,
  phoneIconBase64,
} = logoBase64Data || {};

const generatePDF = async (element, letterType, logoUrl, recipientName, employeeName, position, effectiveDate, preview = false) => {
  try {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
      orientation: 'portrait',
    });

    // Add the Insignia Roman font
    let fontLoaded = false;
    try {
      if (insigniaRomanFont && typeof insigniaRomanFont === 'string' && insigniaRomanFont.length > 0) {
        doc.addFileToVFS('InsigniaRoman.ttf', insigniaRomanFont);
        doc.addFont('InsigniaRoman.ttf', 'InsigniaRoman', 'normal');
        doc.setFont('InsigniaRoman', 'normal');
        fontLoaded = true;
      }
    } catch (error) {
      console.error('Error adding Insignia Roman font:', error);
      fontLoaded = false;
    }

    // Layout constants
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 60;
    const rightPadding = 20;
    const contentWidth = pageWidth - 2 * margin - rightPadding;
    const footerHeight = 80;
    const lineHeight = 14;
    const paragraphSpacing = 15;
    const iconSize = 8;

    // Load logo image
    let logoImage = logoBase64;
    if (!logoImage && logoUrl) {
      try {
        const response = await fetch(logoUrl);
        if (!response.ok) throw new Error(`Failed to fetch logo: ${response.statusText}`);
        const blob = await response.blob();
        logoImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(new Error('Error reading logo file'));
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    }

    // Add watermark function
    const addWatermark = () => {
      if (logoImage?.startsWith('data:image/png;base64,')) {
        try {
          doc.setGState(new doc.GState({ opacity: 0.1 }));
          doc.addImage(
            logoImage,
            'PNG',
            (pageWidth - 140) / 2,
            (pageHeight - 140) / 2,
            140,
            140,
            undefined,
            'FAST'
          );
          doc.setGState(new doc.GState({ opacity: 1 }));
        } catch (error) {
          console.error('Error adding watermark:', error);
        }
      }
    };

    // Add footer function
    const addFooter = (pageNumber, totalPages) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      const contactInfo = {
        email: 'admin@sukalpatechsolutions.com',
        website: 'https://sukalpatechsolutions.com',
        phone: '+91 78928-59968'
      };
      const address = 'Sukalpa Tech Solutions Pvt Ltd. | #71, Bauxite Road, Sarathi Nagar, Belagavi -591108';
      const pageInfo = `Page ${pageNumber} of ${totalPages}`;

      const footerY = pageHeight - footerHeight;
      const centerX = pageWidth / 2;
      const gapBetweenItems = 20;
      const iconTextGap = 5;
      const iconVerticalOffset = 2;

      const contactItems = [
        { icon: emailIconBase64, text: contactInfo.email },
        { icon: websiteIconBase64, text: contactInfo.website },
        { icon: phoneIconBase64, text: contactInfo.phone }
      ];

      let totalContactWidth = 0;
      const itemWidths = contactItems.map(item => {
        const textWidth = doc.getTextWidth(item.text);
        const itemWidth = (item.icon ? iconSize + iconTextGap : 0) + textWidth;
        totalContactWidth += itemWidth + (totalContactWidth > 0 ? gapBetweenItems : 0);
        return itemWidth;
      });

      let contactX = centerX - totalContactWidth / 2;
      const contactY = footerY;

      contactItems.forEach(({ icon, text }, index) => {
        try {
          if (icon) {
            const iconY = contactY - iconSize / 2 + iconVerticalOffset;
            const textY = iconY + iconSize / 2 + 2;
            doc.addImage(icon, 'PNG', contactX, iconY, iconSize, iconSize);
            doc.text(text, contactX + iconSize + iconTextGap, textY);
            contactX += itemWidths[index] + gapBetweenItems;
          } else {
            doc.text(text, contactX, contactY);
            contactX += itemWidths[index] + gapBetweenItems;
          }
        } catch (error) {
          console.error(`Error adding contact icon for ${text}:`, error);
          doc.text(text, contactX, contactY);
          contactX += itemWidths[index] + gapBetweenItems;
        }
      });

      const addressY = footerY + 15;
      doc.text(address, centerX, addressY, { align: 'center' });
      doc.text(pageInfo, centerX, addressY + 15, { align: 'center' });
    };

    // Add initial watermark
    addWatermark();

    // Add header logo
    if (logoImage?.startsWith('data:image/png;base64,')) {
      try {
        doc.addImage(logoImage, 'PNG', margin, margin + 5, 80, 60, undefined, 'FAST');
      } catch (error) {
        console.error('Error adding header logo:', error);
      }
    }

    // Add heading
    try {
      doc.setFont(fontLoaded ? 'InsigniaRoman' : 'helvetica', 'normal');
      doc.setFontSize(20);
      doc.setTextColor('#003366');
      doc.text('Sukalpa Tech Solutions Pvt Ltd.', pageWidth / 2, margin + 30, { align: 'center' });
    } catch (error) {
      doc.setFont('helvetica', 'normal');
      doc.text('Sukalpa Tech Solutions Pvt Ltd.', pageWidth / 2, margin + 30, { align: 'center' });
    }

    // Add company details
    doc.setFont(fontLoaded ? 'InsigniaRoman' : 'helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('GSTIN:29ABICS7525C1Z6|CIN: U72900KA2022PTC162513', pageWidth / 2, margin + 60, { align: 'center' });

    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, margin + 70, pageWidth - margin, margin + 70);

    // Get content from elements
    const address = element.querySelector('.letterhead-input-field[placeholder="Recipient Address"]')?.value || '[Recipient Address]';
    const date = element.querySelector('.letterhead-input-field[placeholder="Date"]')?.value || new Date().toISOString().split('T')[0];
    const subject = element.querySelector('.letterhead-input-field[placeholder="Subject"]')?.value || letterType;
    const contentElement = element.querySelector('.letterhead-content-area');
    const signature = element.querySelector('.letterhead-input-field[placeholder="Signature (Your Name, Designation)"]')?.value || 'Your Name, Designation';

    // Process HTML content
    let htmlContent = contentElement ? contentElement.innerHTML : 'No content provided.';
    htmlContent = htmlContent
      .replace('[Recipient Name]', recipientName || '[Recipient Name]')
      .replace(/\[Employee Name\]/g, employeeName || '[Employee Name]')
      .replace(/\[Position\]/g, position || '[Position]')
      .replace(/\[Date\]/g, effectiveDate || '[Date]');

    // Parse HTML content to extract paragraphs and inline formatting
    const parser = new DOMParser();
    const docHTML = parser.parseFromString(`<div>${htmlContent}</div>`, 'text/html');
    const contentNodes = docHTML.querySelector('div').childNodes;

    const paragraphs = [];
    let currentParagraph = '';

    // Function to process text with inline formatting
    const processTextNode = (text, styles = {}) => {
      if (text.trim()) {
        currentParagraph += text.trim();
      }
    };

    // Process each node in the content
    contentNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (['P', 'DIV', 'BR'].includes(node.tagName)) {
          if (currentParagraph.trim()) {
            paragraphs.push(currentParagraph.trim());
            currentParagraph = '';
          }
          if (node.tagName !== 'BR') {
            node.childNodes.forEach(child => {
              if (child.nodeType === Node.TEXT_NODE) {
                processTextNode(child.textContent);
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                const styles = {};
                if (child.tagName === 'STRONG' || child.tagName === 'B') styles.bold = true;
                if (child.tagName === 'I') styles.italic = true;
                if (child.tagName === 'U') styles.underline = true;
                processTextNode(child.textContent, styles);
              }
            });
            if (currentParagraph.trim()) {
              paragraphs.push(currentParagraph.trim());
              currentParagraph = '';
            }
          }
        } else if (['STRONG', 'B', 'I', 'U'].includes(node.tagName)) {
          const styles = {};
          if (node.tagName === 'STRONG' || node.tagName === 'B') styles.bold = true;
          if (node.tagName === 'I') styles.italic = true;
          if (node.tagName === 'U') styles.underline = true;
          processTextNode(node.textContent, styles);
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node.textContent);
      }
    });

    if (currentParagraph.trim()) {
      paragraphs.push(currentParagraph.trim());
    }

    // Current y-position
    let yPosition = margin + 90;

    // Function to check page overflow and return lines that fit
    const checkPageOverflow = (requiredHeight) => {
      const remainingSpace = pageHeight - yPosition - footerHeight;
      if (remainingSpace < requiredHeight) {
        return Math.max(0, Math.floor(remainingSpace / lineHeight));
      }
      return Math.floor(remainingSpace / lineHeight);
    };

    // Function to add a new page
    const addNewPage = () => {
      addFooter(doc.getNumberOfPages(), doc.getNumberOfPages() + 1);
      doc.addPage();
      addWatermark();
      yPosition = margin;
    };

    // Set black color for all content below the heading line
    doc.setTextColor(0, 0, 0);

    // Add date (right-aligned with label)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let linesFit = checkPageOverflow(lineHeight);
    if (linesFit < 1) {
      addNewPage();
    }
    const dateText = `Date: ${date}`;
    doc.text(dateText, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += lineHeight + paragraphSpacing;

    // Add recipient address
    // Add recipient address with label
doc.setFont('helvetica', 'normal');
doc.setFontSize(11);

// Get address and count words
const addressText = address || '[Recipient Address]';
const wordCount = addressText.trim().split(/\s+/).filter(word => word.length > 0).length;
const maxCharsPerLine = 30; // Conservative limit for Helvetica 11pt in ~475pt width

// Split long address into multiple lines
const splitLongAddress = (text, maxWidth, maxChars) => {
  const lines = [];
  let currentLine = '';
  let remainingText = text.trim();

  while (remainingText.length > 0) {
    // Try to take up to maxChars, but ensure we don't split mid-word unless necessary
    let chunk = remainingText.slice(0, maxChars);
    const nextSpace = remainingText.indexOf(' ', maxChars);
    const chunkWidth = doc.getTextWidth(chunk);

    if (chunkWidth <= maxWidth && nextSpace !== -1 && nextSpace <= maxChars) {
      // If chunk fits and ends before or at a space, include up to the space
      chunk = remainingText.slice(0, nextSpace);
      if (doc.getTextWidth(currentLine + (currentLine ? ' ' : '') + chunk) <= maxWidth) {
        currentLine += (currentLine ? ' ' : '') + chunk;
        remainingText = remainingText.slice(nextSpace + 1).trim();
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = chunk;
        remainingText = remainingText.slice(nextSpace + 1).trim();
      }
    } else if (chunkWidth <= maxWidth && nextSpace === -1) {
      // Last chunk or no spaces left
      if (currentLine) lines.push(currentLine);
      lines.push(chunk);
      remainingText = '';
    } else {
      // Chunk is too wide or no space found; force split
      if (currentLine) lines.push(currentLine);
      lines.push(chunk);
      remainingText = remainingText.slice(maxChars).trim();
      currentLine = '';
    }

    // If currentLine is too wide, push it and reset
    if (currentLine && doc.getTextWidth(currentLine) > maxWidth) {
      lines.push(currentLine);
      currentLine = '';
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines.filter(line => line.length > 0);
};

// Handle address rendering
if (wordCount > 4) {
  // Print "Address:" on its own line
  linesFit = checkPageOverflow(lineHeight);
  if (linesFit < 1) {
    addNewPage();
  }
  doc.text('Address:', margin, yPosition);
  yPosition += lineHeight;

  // Split and print address
  const addressLines = splitLongAddress(addressText, contentWidth, maxCharsPerLine);
  linesFit = checkPageOverflow(addressLines.length * lineHeight);
  if (linesFit < addressLines.length) {
    const linesToRender = addressLines.slice(0, linesFit);
    if (linesToRender.length > 0) {
      doc.text(linesToRender, margin, yPosition);
      yPosition += linesToRender.length * lineHeight;
    }
    addNewPage();
    const remainingLines = addressLines.slice(linesFit);
    if (remainingLines.length > 0) {
      doc.text(remainingLines, margin, yPosition);
      yPosition += remainingLines.length * lineHeight;
    }
  } else {
    doc.text(addressLines, margin, yPosition);
    yPosition += addressLines.length * lineHeight;
  }
} else {
  // Print "Address: <address>" together
  const addressWithLabel = `Address: ${addressText}`;
  const addressLines = splitLongAddress(addressWithLabel, contentWidth, maxCharsPerLine);
  linesFit = checkPageOverflow(addressLines.length * lineHeight);
  if (linesFit < addressLines.length) {
    const linesToRender = addressLines.slice(0, linesFit);
    if (linesToRender.length > 0) {
      doc.text(linesToRender, margin, yPosition);
      yPosition += linesToRender.length * lineHeight;
    }
    addNewPage();
    const remainingLines = addressLines.slice(linesFit);
    if (remainingLines.length > 0) {
      doc.text(remainingLines, margin, yPosition);
      yPosition += remainingLines.length * lineHeight;
    }
  } else {
    doc.text(addressLines, margin, yPosition);
    yPosition += addressLines.length * lineHeight;
  }
}
yPosition += paragraphSpacing;
    // Add subject (bold)
    doc.setFont('helvetica', 'bold');
    const subjectText = `Subject: ${subject}`;
    const subjectLines = doc.splitTextToSize(subjectText, contentWidth);
    linesFit = checkPageOverflow(subjectLines.length * lineHeight);
    if (linesFit < subjectLines.length) {
      const linesToRender = subjectLines.slice(0, linesFit);
      if (linesToRender.length > 0) {
        doc.text(linesToRender, margin, yPosition);
        yPosition += linesToRender.length * lineHeight;
      }
      addNewPage();
      const remainingLines = subjectLines.slice(linesFit);
      if (remainingLines.length > 0) {
        doc.text(remainingLines, margin, yPosition);
        yPosition += remainingLines.length * lineHeight;
      }
    } else {
      doc.text(subjectLines, margin, yPosition);
      yPosition += subjectLines.length * lineHeight;
    }
    yPosition += paragraphSpacing;

    // Add main content paragraphs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    // Process paragraphs with proper pagination
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i];
      let paragraphLines = doc.splitTextToSize(paragraph, contentWidth);
      let lineIndex = 0;

      while (lineIndex < paragraphLines.length) {
        linesFit = checkPageOverflow((paragraphLines.length - lineIndex) * lineHeight);
        const linesToRender = paragraphLines.slice(lineIndex, lineIndex + linesFit);

        if (linesToRender.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.text(linesToRender, margin, yPosition);
          yPosition += linesToRender.length * lineHeight;
          lineIndex += linesToRender.length;
        }

        if (lineIndex < paragraphLines.length) {
          addNewPage();
        } else if (i < paragraphs.length - 1) {
          yPosition += 10; // Add paragraph spacing
        }
      }
    }

    // Add signature section
    const signatureText = ['Yours sincerely,', ...doc.splitTextToSize(signature, contentWidth)];
    const signatureHeight = signatureText.length * lineHeight + 20;
    linesFit = checkPageOverflow(signatureHeight);
    if (linesFit < signatureText.length) {
      const linesToRender = signatureText.slice(0, linesFit);
      if (linesToRender.length > 0) {
        doc.text(linesToRender[0], margin, yPosition);
        if (linesToRender.length > 1) {
          doc.text(linesToRender.slice(1), margin, yPosition + 20);
        }
        yPosition += linesToRender.length * lineHeight + (linesToRender.length > 1 ? 20 : 0);
      }
      addNewPage();
      const remainingLines = signatureText.slice(linesFit);
      if (remainingLines.length > 0) {
        doc.text(remainingLines[0], margin, yPosition);
        if (remainingLines.length > 1) {
          doc.text(remainingLines.slice(1), margin, yPosition + 20);
        }
        yPosition += remainingLines.length * lineHeight + (remainingLines.length > 1 ? 20 : 0);
      }
    } else {
      doc.text('Yours sincerely,', margin, yPosition);
      doc.text(signatureText.slice(1), margin, yPosition + 20);
      yPosition += signatureHeight;
    }

    // Add final footer
    addFooter(doc.getNumberOfPages(), doc.getNumberOfPages());

    if (preview) {
      return doc.output('blob');
    } else {
      doc.save(`${letterType.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export default generatePDF;