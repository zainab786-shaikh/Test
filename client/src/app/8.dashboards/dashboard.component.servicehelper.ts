import { filter } from 'rxjs';
import { ISchool } from '../1.school/school.model';
import { ISchoolStandard } from '../2.schoolstandard/schoolstandard.model';
import { IStudent } from '../3.student/student.model';
import { IProgress } from '../4.progress/progress.model';
import { IStandard } from '../5.standard/standard.model';
import { ISubject } from '../6.subject/subject.model';
import { ILesson } from '../7.lesson/lesson.model';
import { DashboardData } from './dashboard.component-data';

export interface IChildNode {
  Id: number;
  name: string;
  score: number;
}
export interface IParentNode {
  Id: number;
  name: string;
  score: number;
  expanded: boolean;
  childList: IChildNode[];
}

export class DashboardServiceHelper {
  dashboardData = new DashboardData();

  schools: ISchool[];
  schoolStandards: ISchoolStandard[];
  students: IStudent[];
  standards: IStandard[];
  subjects: ISubject[];
  lessons: ILesson[];
  progress: IProgress[];

  //====================================| Dummy Data
  constructor() {
    this.schools = this.dashboardData.getSchool();
    this.schoolStandards = this.dashboardData.getSchoolStandard();
    this.students = this.dashboardData.getStudent();
    this.standards = this.dashboardData.getStandard();
    this.subjects = this.dashboardData.getSubject();
    this.lessons = this.dashboardData.getLesson();
    this.progress = this.dashboardData.getProgress();
  }

  // School => Standard => Student => Subject => Lesson
  private getPerfPerStandard(progressList: IProgress[]): IChildNode[] {
    const standardMap = new Map<number, { score: number; count: number }>();
    progressList.forEach((p) => {
      if (!standardMap.has(p.standard!)) {
        standardMap.set(p.standard!, { score: 0, count: 0 });
      }
      let std = standardMap.get(p.standard!)!;

      std.score += p.Quiz + p.FillBlanks + p.TrueFalse;
      std.count += 3;
    });

    return Array.from(standardMap.entries()).map(([standard, data]) => ({
      Id: standard,
      name: this.standards.find((s) => s.Id === standard)?.name || 'Unknown',
      score: data.score / data.count,
      expanded: false,
    }));
  }

  private getPerfPerSubject(progressList: IProgress[]): IChildNode[] {
    const subjectMap = new Map<number, { score: number; count: number }>();
    progressList.forEach((p) => {
      if (!subjectMap.has(p.subject!)) {
        subjectMap.set(p.subject!, { score: 0, count: 0 });
      }
      let subj = subjectMap.get(p.subject!)!;

      subj.score += p.Quiz + p.FillBlanks + p.TrueFalse;
      subj.count += 3;
    });

    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      Id: subject,
      name: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
      score: data.score / data.count,
      expanded: false,
    }));
  }

  private getPerfPerStudent(progressList: IProgress[]): IChildNode[] {
    const studentMap = new Map<number, { score: number; count: number }>();
    progressList.forEach((p) => {
      if (!studentMap.has(p.student!)) {
        studentMap.set(p.student!, { score: 0, count: 0 });
      }
      let student = studentMap.get(p.student!)!;
      student.score += p.Quiz + p.FillBlanks + p.TrueFalse;
      student.count += 3;
    });

    return Array.from(studentMap.entries()).map(([student, data]) => ({
      Id: student,
      name: this.students.find((s) => s.Id === student)?.name || 'Unknown',
      score: data.score / data.count,
      expanded: false,
    }));
  }

  private getPerfPerLesson(progressList: IProgress[]): IChildNode[] {
    const lessonMap = new Map<number, { score: number; count: number }>();
    progressList.forEach((p) => {
      if (!lessonMap.has(p.lesson!)) {
        lessonMap.set(p.lesson!, { score: 0, count: 0 });
      }
      let lesson = lessonMap.get(p.lesson!)!;
      lesson.score += p.Quiz + p.FillBlanks + p.TrueFalse;
      lesson.count += 3;
    });

    return Array.from(lessonMap.entries()).map(([lessonId, data]) => {
      return {
        Id: lessonId || 0,
        name: this.lessons.find((s) => s.Id === lessonId)?.Name || 'Unknown',
        score: data.score / data.count,
      };
    });
  }

  //==========================================================| Overall Performance
  private getOverallPerformance(progressList: IProgress[]): number {
    const total = progressList.reduce(
      (sum, p) => sum + p.Quiz + p.FillBlanks + p.TrueFalse,
      0
    );
    return total / (this.progress.length * 3);
  }

  // School => Overall
  getOverallPerfForSchool(schoolId: number): number {
    let filteredProgress = this.progress.filter(
      (eachProgress) => eachProgress.school == schoolId
    );
    return this.getOverallPerformance(filteredProgress);
  }

  // Standard => Overall
  getOverallPerfForSchoolPerStandard(
    schoolId: number,
    standardId: number
  ): number {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.standard == standardId
    );
    return this.getOverallPerformance(filteredProgress);
  }

  // Standard => Overall
  getOverallPerfForSchoolStandardPerStudent(
    schoolId: number,
    standardId: number,
    studentId: number
  ): number {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId &&
        eachProgress.standard == standardId &&
        eachProgress.student == studentId
    );
    return this.getOverallPerformance(filteredProgress);
  }

  //==========================================================| Each Latest Assesment
  getLatestAssessments(
    schoolId: number,
    standardId: number,
    studentId: number
  ) {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId &&
        eachProgress.standard == standardId &&
        eachProgress.student == studentId
    );

    const subjectMap = new Map<
      number,
      { lesson: number; qz: number; fb: number; tf: number }
    >();

    filteredProgress.forEach((p) => {
      if (!subjectMap.has(p.subject!)) {
        subjectMap.set(p.subject!, {
          lesson: p.lesson!,
          qz: p.Quiz,
          fb: p.FillBlanks,
          tf: p.TrueFalse,
        });
      }

      if (p.Quiz != 0 || p.FillBlanks != 0 || p.TrueFalse != 0) {
        let data = subjectMap.get(p.subject!)!;
        data.lesson = p.lesson!;
        data.qz = p.Quiz;
        data.fb = p.FillBlanks;
        data.tf = p.TrueFalse;
      }
    });

    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
      lesson:
        this.lessons.find((l) => l.Id === data.lesson!)?.Name || 'Unknown',
      qz: data.qz,
      fb: data.fb,
      tf: data.tf,
    }));
  }

  //====================================| school =>  standard / subject
  getPerfForSchoolPerStandard(schoolId: number): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) => eachProgress.school == schoolId
    );
    return this.getPerfPerStandard(filteredProgress);
  }

  getPerfForSchoolPerSubject(schoolId: number): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) => eachProgress.school == schoolId
    );
    return this.getPerfPerSubject(filteredProgress);
  }

  //====================================| standard => subject / student
  getPerfForStandardPerSubject(
    schoolId: number,
    standardId: number
  ): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.standard == standardId
    );
    return this.getPerfPerSubject(filteredProgress);
  }

  getPerfForStandardPerStudent(
    schoolId: number,
    standardId: number
  ): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.standard == standardId
    );
    return this.getPerfPerStudent(filteredProgress);
  }

  //====================================| subject => standard / student
  getPerfForSubjectPerStandard(
    schoolId: number,
    subjectId: number
  ): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.subject == subjectId
    );
    return this.getPerfPerStandard(filteredProgress);
  }

  getPerfForSubjectPerStudent(
    schoolId: number,
    subjectId: number
  ): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.subject == subjectId
    );
    return this.getPerfPerStudent(filteredProgress);
  }

  //====================================| student => subject
  getPerfForStudentPerSubject(
    schoolId: number,
    standardId: number,
    studentId: number
  ): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId &&
        eachProgress.standard == standardId &&
        eachProgress.student == studentId
    );
    return this.getPerfPerSubject(filteredProgress);
  }

  //====================================| subject => lesson
  getPerfForStudentPerSubjectLesson(
    schoolId: number,
    standardId: number,
    studentId: number,
    subjectId: number
  ): IChildNode[] {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId &&
        eachProgress.standard == standardId &&
        eachProgress.student == studentId &&
        eachProgress.subject == subjectId
    );
    return this.getPerfPerLesson(filteredProgress);
  }

  // getComparisonData() {
  //   return this.subjectScores.map((s) => ({
  //     subject: s.subject,
  //     studentScore: s.score,
  //     classAvg: s.score - 5, // Assuming class average is 5% lower for now
  //   }));
  // }

  // generateGoals() {
  //   return this.comparisonData
  //     .filter((data) => data.studentScore < data.classAvg)
  //     .map(
  //       (data) =>
  //         `Improve in ${data.subject}. Your score: ${data.studentScore}%, Class Average: ${data.classAvg}%. Focus on weak areas.`
  //     );
  // }

  generateActivityFeed() {
    const completed = this.progress.map(
      (p) =>
        `Completed ${
          this.lessons.find((l) => l.Id === p.lesson)?.Name || 'Unknown'
        } in ${
          this.subjects.find((s) => s.Id === p.subject)?.name || 'Unknown'
        } - Score: ${p.Quiz}%`
    );
    const nextLessons = this.lessons.filter(
      (l) => !this.progress.some((p) => p.lesson === l.Id)
    );
    const upcoming = nextLessons.map(
      (l) =>
        `Upcoming lesson: ${l.Name} in ${
          this.subjects.find((s) => s.Id === l.subject)?.name || 'Unknown'
        }`
    );
    return [...completed, ...upcoming];
  }
}
