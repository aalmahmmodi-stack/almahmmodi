import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface StudentRecord {
  id: number;
  sequentialNumber: number;
  name: string;
  dateOfBirth: string;
  qualification: string;
  graduationYear: number;
  university: string;
  notes?: string;
  deficiencies?: string;
  status: string;
  nationalNumber: string;
  isDuplicate: number;
}

export function exportToExcel(students: StudentRecord[]): Buffer {
  const worksheet = XLSX.utils.json_to_sheet(
    students.map(s => ({
      'الرقم التسلسلي': s.sequentialNumber,
      'الاسم': s.name,
      'تاريخ الميلاد': s.dateOfBirth,
      'المؤهل العلمي': s.qualification,
      'سنة التخرج': s.graduationYear,
      'الجامعة': s.university,
      'ملاحظات': s.notes || '',
      'النواقص': s.deficiencies || '',
      'الحالة': s.status,
      'الرقم الوطني': s.nationalNumber,
      'مكرر': s.isDuplicate === 1 ? 'نعم' : 'لا',
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'الطلاب');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
}

export function exportToPDF(students: StudentRecord[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Register Arabic font
      doc.font('Helvetica');

      // Title
      doc.fontSize(20).text('نظام إدارة بيانات الطلاب', { align: 'center' });
      doc.fontSize(12).text(`تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}`, {
        align: 'center',
      });
      doc.moveDown();

      // Summary
      const uniqueCount = students.filter(s => s.isDuplicate === 0).length;
      const duplicateCount = students.filter(s => s.isDuplicate === 1).length;

      doc.fontSize(11).text(`إجمالي الطلاب: ${students.length}`, { align: 'right' });
      doc.text(`الطلاب الفريدين: ${uniqueCount}`, { align: 'right' });
      doc.text(`الطلاب المكررين: ${duplicateCount}`, { align: 'right' });
      doc.moveDown();

      // Table header
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 120;
      const col3 = 200;
      const col4 = 280;
      const col5 = 360;
      const col6 = 440;
      const col7 = 520;

      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('الرقم', col1, tableTop);
      doc.text('الاسم', col2, tableTop);
      doc.text('الرقم الوطني', col3, tableTop);
      doc.text('الجامعة', col4, tableTop);
      doc.text('سنة التخرج', col5, tableTop);
      doc.text('الحالة', col6, tableTop);
      doc.text('مكرر', col7, tableTop);

      doc.fontSize(9).font('Helvetica');
      let y = tableTop + 20;
      const pageHeight = doc.page.height;
      const bottomMargin = 50;

      for (const student of students) {
        if (y > pageHeight - bottomMargin) {
          doc.addPage();
          y = 50;
        }

        doc.text(String(student.sequentialNumber), col1, y);
        doc.text(student.name.substring(0, 20), col2, y);
        doc.text(student.nationalNumber, col3, y);
        doc.text(student.university.substring(0, 15), col4, y);
        doc.text(String(student.graduationYear), col5, y);
        doc.text(student.status, col6, y);
        doc.text(student.isDuplicate === 1 ? 'نعم' : 'لا', col7, y);

        y += 15;
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
