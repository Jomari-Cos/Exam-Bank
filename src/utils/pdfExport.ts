import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Examination, ExamSet, Question } from '../types';

export interface PDFExportOptions {
  includePaper?: boolean;
  includeAnswerKey?: boolean;
  includeTOS?: boolean;
  includeOMR?: boolean;
  filename?: string;
  onProgress?: (status: string) => void;
}

/**
 * Capture an HTML DOM element and render it into jsPDF across multiple A4 pages with crisp rendering.
 */
export async function exportElementToPDF(
  element: HTMLElement,
  pdfDoc: jsPDF,
  addNewPageIfExisting = false
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2, // 2x resolution for high-definition print quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1024,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  const pdfWidth = pdfDoc.internal.pageSize.getWidth();
  const pdfHeight = pdfDoc.internal.pageSize.getHeight();

  // Margins in mm
  const margin = 10;
  const contentWidth = pdfWidth - margin * 2;
  const contentHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = contentHeight;
  let position = margin;
  let page = 0;

  while (heightLeft > 0) {
    if (addNewPageIfExisting || page > 0) {
      pdfDoc.addPage();
    }
    // Render sliced slice onto page
    pdfDoc.addImage(
      imgData,
      'JPEG',
      margin,
      position - page * (pdfHeight - margin * 2),
      contentWidth,
      contentHeight,
      undefined,
      'FAST'
    );

    heightLeft -= (pdfHeight - margin * 2);
    page++;
  }
}

/**
 * Generate a complete, formatted PDF combining the examination paper, master answer key,
 * and academic Table of Specifications (TOS).
 */
export async function generateExamPDF(
  paperElementId: string,
  answerKeyElementId: string | null,
  tosElementId: string | null,
  options: {
    exam: Examination;
    setCode: string;
    onProgress?: (msg: string) => void;
  }
): Promise<void> {
  const { exam, setCode, onProgress } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  try {
    // 1. Export Examination Paper
    if (paperElementId) {
      const paperEl = document.getElementById(paperElementId);
      if (paperEl) {
        onProgress?.(`Rendering Examination Paper Set ${setCode}...`);
        await exportElementToPDF(paperEl, doc, false);
      }
    }

    // 2. Export Master Answer Key (on new page)
    if (answerKeyElementId) {
      const keyEl = document.getElementById(answerKeyElementId);
      if (keyEl) {
        onProgress?.(`Rendering Master Answer Key Set ${setCode}...`);
        await exportElementToPDF(keyEl, doc, true);
      }
    }

    // 3. Export Table of Specifications (TOS)
    if (tosElementId) {
      const tosEl = document.getElementById(tosElementId);
      if (tosEl) {
        onProgress?.(`Rendering Table of Specifications (TOS)...`);
        await exportElementToPDF(tosEl, doc, true);
      }
    }

    // Clean filename
    const safeCourse = exam.courseCode.replace(/[^a-zA-Z0-9]/g, '_');
    const safeTerm = exam.assessmentType.replace(/[^a-zA-Z0-9]/g, '_');
    const safeFilename = `${safeCourse}_${safeTerm}_SET_${setCode}.pdf`;

    onProgress?.('Saving and downloading PDF...');
    doc.save(safeFilename);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}
