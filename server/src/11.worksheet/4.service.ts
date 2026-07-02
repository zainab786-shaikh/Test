import { injectable } from "inversify";
import { Transaction } from "sequelize";
import fs from "fs";
import path from "path";
const { ZipArchive } = require("archiver") as any;
const PdfPrinter = require("pdfmake/js/Printer").default;

import TYPES from "../ioc/types";
import { container } from "../ioc/container";
import { IServiceWorksheet } from "./3.service.model";
import { IWorksheet, IWorksheetQuestion } from "./0.model";
import { IRepoWorksheet, IRepoWorksheetQuestion } from "./5.repo.model";
import { IRepoLessonSection } from "../7.lessonsection/5.repo.model";
import { IRepoLesson } from "../7.lesson/5.repo.model";
import { IRepoSubject } from "../6.subject/5.repo.model";
import { ServiceTenant } from "../common/service/tenant.service";
import { RequestContextProvider } from "../common/service/request-context.service";

@injectable()
export class WorksheetServiceImpl implements IServiceWorksheet {
  private repoWorksheet!: IRepoWorksheet;
  private repoWorksheetQuestion!: IRepoWorksheetQuestion;
  private repoLessonSection!: IRepoLessonSection;
  private repoLesson!: IRepoLesson;
  private repoSubject!: IRepoSubject;

  constructor() {
    this.repoWorksheet = container.get(TYPES.RepoWorksheet);
    this.repoWorksheetQuestion = container.get(TYPES.RepoWorksheetQuestion);
    this.repoLessonSection = container.get(TYPES.RepoLessonSection);
    this.repoLesson = container.get(TYPES.RepoLesson);
    this.repoSubject = container.get(TYPES.RepoSubject);
  }

  async getAvailableQuestionsCount(
    lessonId: number
  ): Promise<{
    MCQ: number;
    TRUE_FALSE: number;
    FILL_BLANK: number;
    SHORT_ANSWER: number;
  }> {
    const sections = await this.repoLessonSection.getByLessonId(lessonId);
    
    let mcq = 0;
    let trueFalse = 0;
    let fillBlank = 0;
    let shortAnswer = 0;

    if (sections) {
      for (const sec of sections) {
        if (sec.quiz) {
          try {
            const arr = JSON.parse(sec.quiz);
            if (Array.isArray(arr)) mcq += arr.length;
          } catch (e) {}
        }
        if (sec.truefalse) {
          try {
            const arr = JSON.parse(sec.truefalse);
            if (Array.isArray(arr)) trueFalse += arr.length;
          } catch (e) {}
        }
        if (sec.fillblanks) {
          try {
            const arr = JSON.parse(sec.fillblanks);
            if (Array.isArray(arr)) fillBlank += arr.length;
          } catch (e) {}
        }
        if (sec.shortquestion) {
          try {
            const arr = JSON.parse(sec.shortquestion);
            if (Array.isArray(arr)) shortAnswer += arr.length;
          } catch (e) {}
        }
      }
    }

    return {
      MCQ: mcq,
      TRUE_FALSE: trueFalse,
      FILL_BLANK: fillBlank,
      SHORT_ANSWER: shortAnswer,
    };
  }

  async getById(id: number): Promise<IWorksheet | null> {
    return this.repoWorksheet.getById(id);
  }

  async createWorksheet(
    teacherId: number,
    config: {
      title: string;
      lessonId: number;
      studentCount: number;
      totalMarks?: number;
      quantities: {
        MCQ: number;
        TRUE_FALSE: number;
        FILL_BLANK: number;
        SHORT_ANSWER: number;
      };
      allowReuse: boolean;
    }
  ): Promise<{ warning: any } | { worksheet: IWorksheet; zipPath: string }> {
    const counts = await this.getAvailableQuestionsCount(config.lessonId);

    // Verify pool sizes
    const warning: { available: any; required: any } = {
      available: {},
      required: {},
    };
    let hasWarning = false;

    const types = [
      { key: "MCQ", label: "MCQ" },
      { key: "TRUE_FALSE", label: "True / False" },
      { key: "FILL_BLANK", label: "Fill in the Blanks" },
      { key: "SHORT_ANSWER", label: "Short Answer" },
    ] as const;

    for (const t of types) {
      const requestedQty = config.quantities[t.key] || 0;
      if (requestedQty === 0) continue;

      const available = counts[t.key];
      const required = requestedQty * config.studentCount;

      // Hard error: requested quantity for ONE student exceeds total available in database
      if (requestedQty > available) {
        throw new Error(
          `Cannot request ${requestedQty} ${t.label} questions. Only ${available} exist in the database.`
        );
      }

      // Warning condition: not enough unique questions to distribute across all students without reuse
      if (required > available && !config.allowReuse) {
        warning.available[t.key] = available;
        warning.required[t.key] = required;
        hasWarning = true;
      }
    }

    if (hasWarning) {
      return { warning };
    }

    // Load actual question records grouped by type
    const sections = await this.repoLessonSection.getByLessonId(config.lessonId);
    if (!sections || sections.length === 0) {
      throw new Error("No lesson sections found for this lesson");
    }

    const mcqPool: any[] = [];
    const tfPool: any[] = [];
    const fbPool: any[] = [];
    const saPool: any[] = [];

    for (const sec of sections) {
      if (sec.quiz) {
        try {
          const arr = JSON.parse(sec.quiz);
          if (Array.isArray(arr)) {
            arr.forEach((q, idx) => {
              mcqPool.push({ ...q, sectionId: sec.Id, index: idx });
            });
          }
        } catch (e) {}
      }
      if (sec.truefalse) {
        try {
          const arr = JSON.parse(sec.truefalse);
          if (Array.isArray(arr)) {
            arr.forEach((q, idx) => {
              tfPool.push({ ...q, sectionId: sec.Id, index: idx });
            });
          }
        } catch (e) {}
      }
      if (sec.fillblanks) {
        try {
          const arr = JSON.parse(sec.fillblanks);
          if (Array.isArray(arr)) {
            arr.forEach((q, idx) => {
              fbPool.push({ ...q, sectionId: sec.Id, index: idx });
            });
          }
        } catch (e) {}
      }
      if (sec.shortquestion) {
        try {
          const arr = JSON.parse(sec.shortquestion);
          if (Array.isArray(arr)) {
            arr.forEach((q, idx) => {
              saPool.push({ ...q, sectionId: sec.Id, index: idx });
            });
          }
        } catch (e) {}
      }
    }

    // Distribute questions using the least-used selection algorithm
    const mcqSelections = selectQuestions(mcqPool, config.quantities.MCQ, config.studentCount, config.allowReuse);
    const tfSelections = selectQuestions(tfPool, config.quantities.TRUE_FALSE, config.studentCount, config.allowReuse);
    const fbSelections = selectQuestions(fbPool, config.quantities.FILL_BLANK, config.studentCount, config.allowReuse);
    const saSelections = selectQuestions(saPool, config.quantities.SHORT_ANSWER, config.studentCount, config.allowReuse);

    // Retrieve details for display
    const lesson = await this.repoLesson.getById(config.lessonId);
    const subject = lesson?.subject ? await this.repoSubject.getById(lesson.subject) : null;
    const lessonName = lesson?.name || "Unknown Lesson";
    const subjectName = subject?.name || "Unknown Subject";

    const contextProvider = container.get(RequestContextProvider);
    const tenantId = contextProvider.get()?.tenantId || "tenanta";
    const tenantService = container.get(ServiceTenant);

    // Run within database transaction to save Worksheet and WorksheetQuestions
    const transaction = await tenantService.executeTransaction(tenantId);
    let worksheet: IWorksheet | null = null;

    try {
      worksheet = await this.repoWorksheet.create(
        {
          teacher_id: teacherId,
          lesson_id: config.lessonId,
          title: config.title,
          student_count: config.studentCount,
        },
        transaction
      );

      if (!worksheet || !worksheet.Id) {
        throw new Error("Failed to save worksheet to history");
      }

      // Save references in WorksheetQuestion table
      for (let s = 0; s < config.studentCount; s++) {
        const studentNum = s + 1;
        
        for (const q of mcqSelections[s]) {
          await this.repoWorksheetQuestion.create({
            worksheet_id: worksheet.Id,
            student_number: studentNum,
            lessonsection_id: q.sectionId,
            question_type: "MCQ",
            question_index: q.index,
          }, transaction);
        }

        for (const q of tfSelections[s]) {
          await this.repoWorksheetQuestion.create({
            worksheet_id: worksheet.Id,
            student_number: studentNum,
            lessonsection_id: q.sectionId,
            question_type: "TRUE_FALSE",
            question_index: q.index,
          }, transaction);
        }

        for (const q of fbSelections[s]) {
          await this.repoWorksheetQuestion.create({
            worksheet_id: worksheet.Id,
            student_number: studentNum,
            lessonsection_id: q.sectionId,
            question_type: "FILL_BLANK",
            question_index: q.index,
          }, transaction);
        }

        for (const q of saSelections[s]) {
          await this.repoWorksheetQuestion.create({
            worksheet_id: worksheet.Id,
            student_number: studentNum,
            lessonsection_id: q.sectionId,
            question_type: "SHORT_ANSWER",
            question_index: q.index,
          }, transaction);
        }
      }

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }

    // Now, generate PDFs and ZIP
    const fonts = {
      Roboto: {
        normal: path.join(process.cwd(), "node_modules/pdfmake/fonts/Roboto/Roboto-Regular.ttf"),
        bold: path.join(process.cwd(), "node_modules/pdfmake/fonts/Roboto/Roboto-Medium.ttf"),
        italic: path.join(process.cwd(), "node_modules/pdfmake/fonts/Roboto/Roboto-Italic.ttf"),
        bolditalic: path.join(process.cwd(), "node_modules/pdfmake/fonts/Roboto/Roboto-MediumItalic.ttf"),
      },
    };
    const virtualfs = require("pdfmake/js/virtual-fs").default;
    const URLResolver = require("pdfmake/js/URLResolver").default;
    const urlResolver = new URLResolver(virtualfs);
    const printer = new PdfPrinter(fonts, virtualfs, urlResolver, undefined);

    const downloadsDir = path.join(process.cwd(), "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const zipPath = path.join(downloadsDir, `Worksheet_${worksheet.Id}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });

    archive.pipe(output);

    // Generate PDFs for students and append to ZIP
    const studentWorksheetsData: any[] = [];

    for (let s = 0; s < config.studentCount; s++) {
      const studentNum = s + 1;
      const studentNumStr = String(studentNum).padStart(3, "0");

      // Shuffle order of questions & MCQs
      const mcqs = shuffleArray(mcqSelections[s]).map(q => shuffleMcqOptions(q));
      const trueFalses = shuffleArray(tfSelections[s]);
      const fillBlanks = shuffleArray(fbSelections[s]);
      const shortAnswers = shuffleArray(saSelections[s]);

      studentWorksheetsData.push({
        MCQ: mcqs,
        TRUE_FALSE: trueFalses,
        FILL_BLANK: fillBlanks,
        SHORT_ANSWER: shortAnswers,
      });

      const docDefinition = generateDocDefinition(
        config.title,
        subjectName,
        lessonName,
        config.totalMarks,
        mcqs,
        trueFalses,
        fillBlanks,
        shortAnswers
      );

      const pdfDoc = await printer.createPdfKitDocument(docDefinition);
      archive.append(pdfDoc as any, { name: `Student_${studentNumStr}.pdf` });
      pdfDoc.end();
    }

    // Generate Answer Key and append to ZIP
    const answerKeyDocDef = generateAnswerKeyDocDefinition(
      config.title,
      subjectName,
      lessonName,
      studentWorksheetsData
    );
    const answerKeyPdf = await printer.createPdfKitDocument(answerKeyDocDef);
    archive.append(answerKeyPdf as any, { name: "Answer_Key.pdf" });
    answerKeyPdf.end();

    await archive.finalize();

    // Wait for the stream to finish writing to disk
    await new Promise<void>((resolve, reject) => {
      output.on("close", () => resolve());
      output.on("error", (err) => reject(err));
    });

    return { worksheet, zipPath };
  }
}

// ------------------- Helper Functions ------------------- //

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleMcqOptions(mcq: any) {
  const options = [...mcq.options];
  const correctOptionText = options[mcq.answer - 1];

  const shuffledOptions = shuffleArray(options);
  const newAnswerIndex = shuffledOptions.indexOf(correctOptionText) + 1;

  return {
    ...mcq,
    options: shuffledOptions,
    answer: newAnswerIndex,
  };
}

function selectQuestions(
  pool: any[],
  qty: number,
  studentCount: number,
  allowReuse: boolean
): any[][] {
  const studentQuestions: any[][] = [];

  if (qty === 0) {
    for (let s = 0; s < studentCount; s++) {
      studentQuestions.push([]);
    }
    return studentQuestions;
  }

  if (pool.length < qty) {
    throw new Error(`Insufficient questions in database pool to satisfy requested quantity.`);
  }

  const poolWithUsage = pool.map((q) => ({ question: q, usage: 0 }));

  for (let s = 0; s < studentCount; s++) {
    const shuffled = [...poolWithUsage];
    // Shuffle first
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Sort by usage count
    shuffled.sort((a, b) => a.usage - b.usage);

    // Pick first qty
    const selected = shuffled.slice(0, qty);
    selected.forEach((item) => {
      item.usage++;
    });

    studentQuestions.push(selected.map((item) => item.question));
  }

  return studentQuestions;
}

function generateDocDefinition(
  title: string,
  subjectName: string,
  lessonName: string,
  totalMarks: number | undefined,
  mcqs: any[],
  trueFalses: any[],
  fillBlanks: any[],
  shortAnswers: any[]
): any {
  const content: any[] = [
    { text: "Learnzy", style: "brandHeader" },
    { text: title, style: "worksheetTitle" },
    { text: `Subject: ${subjectName}`, style: "metaText" },
    { text: `Lesson: ${lessonName}`, style: "metaText" },
    { text: "\n" },
    {
      columns: [
        { text: "Student Name: __________________________", width: "*" },
        { text: "Roll Number: __________________________", width: "*" },
        { text: "Date: __________________________", width: "*" },
      ],
      columnGap: 10,
    },
    { text: "\n" },
    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
    { text: "\n" },
  ];

  let sectionLetterCode = 65; // 'A'

  if (mcqs.length > 0) {
    content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: Multiple Choice`, style: "sectionHeader" });
    mcqs.forEach((q, idx) => {
      content.push({ text: `${idx + 1}. ${q.question}`, style: "questionText" });
      q.options.forEach((opt: string, optIdx: number) => {
        const label = String.fromCharCode(97 + optIdx);
        content.push({ text: `(${label}) ${opt}`, style: "optionText" });
      });
    });
    content.push({ text: "\n" });
  }

  if (trueFalses.length > 0) {
    content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: True / False`, style: "sectionHeader" });
    trueFalses.forEach((q, idx) => {
      content.push({ text: `${idx + 1}. ${q.question}   [ True / False ]`, style: "questionText" });
    });
    content.push({ text: "\n" });
  }

  if (fillBlanks.length > 0) {
    content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: Fill in the Blanks`, style: "sectionHeader" });
    fillBlanks.forEach((q, idx) => {
      // Ensure the blank is standard
      let displayQuestion = q.question;
      if (!displayQuestion.includes("____")) {
        displayQuestion = displayQuestion.replace(/____+/g, "____");
      }
      content.push({ text: `${idx + 1}. ${displayQuestion}`, style: "questionText" });
    });
    content.push({ text: "\n" });
  }

  if (shortAnswers.length > 0) {
    content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: Short Answer`, style: "sectionHeader" });
    shortAnswers.forEach((q, idx) => {
      content.push({ text: `${idx + 1}. ${q.question}`, style: "questionText" });
      content.push({ text: "\n\n\n\n", style: "questionText" }); // space to write
    });
    content.push({ text: "\n" });
  }

  content.push({ canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] });
  content.push({ text: "\n" });
  
  if (totalMarks !== undefined) {
    content.push({ text: `Total Marks: ${totalMarks}`, style: "totalMarks" });
  }
  
  content.push({ text: "Good Luck!", style: "goodLuck", alignment: "center" });

  return {
    content,
    styles: {
      brandHeader: { fontSize: 16, bold: true, alignment: "center", margin: [0, 0, 0, 5], color: "#4f46e5" },
      worksheetTitle: { fontSize: 20, bold: true, alignment: "center", margin: [0, 0, 0, 10] },
      metaText: { fontSize: 11, margin: [0, 2, 0, 2] },
      sectionHeader: { fontSize: 14, bold: true, margin: [0, 15, 0, 8], decoration: "underline", color: "#1e1b4b" },
      questionText: { fontSize: 11, margin: [0, 5, 0, 5] },
      optionText: { fontSize: 10, margin: [15, 2, 0, 2] },
      totalMarks: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
      goodLuck: { fontSize: 14, bold: true, margin: [0, 10, 0, 0], color: "#4f46e5" },
    },
  };
}

function generateAnswerKeyDocDefinition(
  title: string,
  subjectName: string,
  lessonName: string,
  studentWorksheetsData: any[]
): any {
  const content: any[] = [
    { text: "Learnzy", style: "brandHeader" },
    { text: `${title} - Answer Key`, style: "worksheetTitle" },
    { text: `Subject: ${subjectName}`, style: "metaText" },
    { text: `Lesson: ${lessonName}`, style: "metaText" },
    { text: "\n" },
    { canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }] },
    { text: "\n" },
  ];

  studentWorksheetsData.forEach((sw, sIdx) => {
    const studentNumStr = String(sIdx + 1).padStart(3, "0");
    content.push({ text: `Student_${studentNumStr} Answer Key`, style: "studentKeyHeader" });

    let sectionLetterCode = 65;

    if (sw.MCQ && sw.MCQ.length > 0) {
      content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: Multiple Choice`, style: "sectionKeyHeader" });
      sw.MCQ.forEach((q: any, idx: number) => {
        const label = String.fromCharCode(96 + q.answer);
        const optText = q.options[q.answer - 1];
        content.push({ text: `${idx + 1}. (${label}) ${optText}`, style: "answerText" });
      });
    }

    if (sw.TRUE_FALSE && sw.TRUE_FALSE.length > 0) {
      content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: True / False`, style: "sectionKeyHeader" });
      sw.TRUE_FALSE.forEach((q: any, idx: number) => {
        content.push({ text: `${idx + 1}. ${q.answer ? "True" : "False"}`, style: "answerText" });
      });
    }

    if (sw.FILL_BLANK && sw.FILL_BLANK.length > 0) {
      content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: Fill in the Blanks`, style: "sectionKeyHeader" });
      sw.FILL_BLANK.forEach((q: any, idx: number) => {
        const correctText = q.options && q.options[q.answer - 1] ? q.options[q.answer - 1] : q.answer;
        content.push({ text: `${idx + 1}. ${correctText}`, style: "answerText" });
      });
    }

    if (sw.SHORT_ANSWER && sw.SHORT_ANSWER.length > 0) {
      content.push({ text: `Section ${String.fromCharCode(sectionLetterCode++)}: Short Answer`, style: "sectionKeyHeader" });
      sw.SHORT_ANSWER.forEach((q: any, idx: number) => {
        content.push({ text: `${idx + 1}. ${q.answer}`, style: "answerText" });
      });
    }

    content.push({ text: "\n" });
    content.push({ canvas: [{ type: "line", x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, dash: { length: 5 } }] });
    content.push({ text: "\n" });
  });

  return {
    content,
    styles: {
      brandHeader: { fontSize: 16, bold: true, alignment: "center", margin: [0, 0, 0, 5], color: "#4f46e5" },
      worksheetTitle: { fontSize: 20, bold: true, alignment: "center", margin: [0, 0, 0, 10] },
      metaText: { fontSize: 11, margin: [0, 2, 0, 2] },
      studentKeyHeader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5], color: "#4f46e5" },
      sectionKeyHeader: { fontSize: 11, bold: true, margin: [0, 5, 0, 2], decoration: "underline" },
      answerText: { fontSize: 10, margin: [10, 1, 0, 1] },
    },
  };
}
