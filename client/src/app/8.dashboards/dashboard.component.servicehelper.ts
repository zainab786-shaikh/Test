import { filter } from 'rxjs';
import { ISchool } from '../1.school/school.model';
import { ISchoolStandard } from '../2.schoolstandard/schoolstandard.model';
import { IStudent } from '../3.student/student.model';
import { IProgress } from '../4.progress/progress.model';
import { IStandard } from '../5.standard/standard.model';
import { ISubject } from '../6.subject/subject.model';
import { ILesson } from '../7.lesson/lesson.model';
import { DashboardData } from './dashboard.component-data';

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

  //==========================================================| Overall Performance
  private getOverallPerformance(progressList: IProgress[]): number {
    const total = progressList.reduce(
      (sum, p) => sum + p.Quiz + p.FillBlanks + p.TrueFalse,
      0
    );
    return total / (this.progress.length * 3);
  }

  // School => Overall
  getPerSchoolOverallPerformance(schoolId: number): number {
    let filteredProgress = this.progress.filter(
      (eachProgress) => eachProgress.school == schoolId
    );
    return this.getOverallPerformance(filteredProgress);
  }

  // Standard => Overall
  getPerStandardOverallPerformance(
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
  getPerStudentOverallPerformance(
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

  //==========================================================| Subject Performance
  // School => Subject
  // Standard => Subject
  // Student => Subject
  // Student => Subject => Lesson

  // School => Student
  // Standard => Student
  // Subject => Student
  private getSubjectPerformance(progressList: IProgress[]) {
    const subjectMap = new Map<number, { total: number; count: number }>();
    progressList.forEach((p) => {
      if (!subjectMap.has(p.subject!)) {
        subjectMap.set(p.subject!, { total: 0, count: 0 });
      }
      let subj = subjectMap.get(p.subject!)!;
      subj.total += p.Quiz + p.FillBlanks + p.TrueFalse;
      subj.count += 3;
    });

    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
      score: data.total / data.count,
    }));
  }

  getPerSchoolSubjectPerformance(schoolId: number) {
    let filteredProgress = this.progress.filter(
      (eachProgress) => eachProgress.school == schoolId
    );
    return this.getSubjectPerformance(filteredProgress);
  }

  getPerStandardSubjectPerformance(schoolId: number, standardId: number) {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.standard == standardId
    );
    return this.getSubjectPerformance(filteredProgress);
  }

  getPerStudentSubjectPerformance(
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
    return this.getSubjectPerformance(filteredProgress);
  }

  //==========================================================| Student Performance
  private getStudentPerformance(progressList: IProgress[]) {
    const studentMap = new Map<number, { total: number; count: number }>();
    progressList.forEach((p) => {
      if (!studentMap.has(p.student!)) {
        studentMap.set(p.student!, { total: 0, count: 0 });
      }
      let student = studentMap.get(p.student!)!;
      student.total += p.Quiz + p.FillBlanks + p.TrueFalse;
      student.count += 3;
    });

    return Array.from(studentMap.entries()).map(([student, data]) => ({
      student: this.students.find((s) => s.Id === student)?.name || 'Unknown',
      score: data.total / data.count,
    }));
  }

  getPerStandardStudentsPerformance(schoolId: number, standardId: number) {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId && eachProgress.standard == standardId
    );
    return this.getStudentPerformance(filteredProgress);
  }

  //==========================================================| Student Performance
  private getStandardPerformance(progressList: IProgress[]) {
    const standardMap = new Map<number, { total: number; count: number }>();
    progressList.forEach((p) => {
      if (!standardMap.has(p.standard!)) {
        standardMap.set(p.standard!, { total: 0, count: 0 });
      }
      let standard = standardMap.get(p.student!)!;
      standard.total += p.Quiz + p.FillBlanks + p.TrueFalse;
      standard.count += 3;
    });

    return Array.from(standardMap.entries()).map(([standard, data]) => ({
      standard:
        this.standards.find((s) => s.Id === standard)?.name || 'Unknown',
      score: data.total / data.count,
    }));
  }

  getPerSchoolStandardPerformance(schoolId: number) {
    let filteredProgress = this.progress.filter(
      (eachProgress) => eachProgress.school == schoolId
    );
    return this.getStandardPerformance(filteredProgress);
  }

  //==========================================================| Each Lesson Performance
  private getLessonPerformance(
    schoolId: number,
    standardId: number,
    studentId: number,
    subjectId: number
  ) {
    let filteredProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId &&
        eachProgress.standard == standardId &&
        eachProgress.student == studentId &&
        eachProgress.subject == subjectId
    );

    const lessonMap = new Map<number, { total: number; count: number }>();
    filteredProgress.forEach((p) => {
      if (!lessonMap.has(p.lesson!)) {
        lessonMap.set(p.lesson!, { total: 0, count: 0 });
      }
      let lesson = lessonMap.get(p.lesson!)!;
      lesson.total += p.Quiz + p.FillBlanks + p.TrueFalse;
      lesson.count += 3;
    });

    return Array.from(lessonMap.entries()).map(([lessonId, data]) => ({
      name: this.lessons.find((s) => s.Id === lessonId)?.Name || 'Unknown',
      score: data.total / data.count,
    }));
  }

  getPerSubjectLessonPerformance(
    schoolId: number,
    standardId: number,
    studentId: number
  ) {
    let filteredStudentProgress = this.progress.filter(
      (eachProgress) =>
        eachProgress.school == schoolId &&
        eachProgress.standard == standardId &&
        eachProgress.student == studentId
    );

    const subjectMap = new Map<
      number,
      { lessonList: { name: string; score: number }[] }
    >();
    filteredStudentProgress.forEach((p) => {
      if (!subjectMap.has(p.subject!)) {
        subjectMap.set(p.subject!, {
          lessonList: this.getLessonPerformance(
            schoolId,
            standardId,
            studentId,
            p.subject!
          ),
        });
      }
    });

    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
      lessonList: data.lessonList,
    }));
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
