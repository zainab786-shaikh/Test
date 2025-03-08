import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  filter,
  forkJoin,
  from,
  map,
  mergeMap,
  switchMap,
  toArray,
} from 'rxjs';
import { ISchool } from '../1.school/school.model';
import { ISchoolStandard } from '../2.schoolstandard/schoolstandard.model';
import { IStudent } from '../3.student/student.model';
import { IProgress } from '../4.progress/progress.model';
import { IStandard } from '../5.standard/standard.model';
import { ISubject } from '../6.subject/subject.model';
import { ILesson } from '../7.lesson/lesson.model';
import { SchoolService } from '../1.school/school.service';
import { SchoolStandardService } from '../2.schoolstandard/schoolstandard.service';
import { SubjectService } from '../6.subject/subject.service';
import { LessonService } from '../7.lesson/lesson.service';
import { StudentService } from '../3.student/student.service';
import { StandardService } from '../5.standard/standard.service';

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

@Injectable({
  providedIn: 'root',
})
export class DashboardServiceHelper {
  schools!: ISchool[];
  schoolStandard!: ISchoolStandard[];
  students!: IStudent[];
  standards!: IStandard[];
  subjects!: ISubject[];
  lessons!: ILesson[];

  //====================================| Dummy Data
  constructor(
    private schoolService: SchoolService,
    private schoolStandardService: SchoolStandardService,
    private standardService: StandardService,
    private subjectService: SubjectService,
    private lessonService: LessonService,
    private studentService: StudentService
  ) {}

  public initializeDashboardData(inSchoolId: number): Observable<void> {
    return this.schoolService.get(inSchoolId).pipe(
      switchMap((school) => {
        this.schools = [school];
        return this.schoolStandardService.getAll(inSchoolId);
      }),
      switchMap((schoolStandards) => {
        this.schoolStandard = schoolStandards;
        return forkJoin({
          standards: this.getStandards(schoolStandards),
          subjects: this.getSubjects(schoolStandards),
          students: this.getStudents(inSchoolId, schoolStandards),
        });
      }),
      switchMap(({ standards, subjects, students }) => {
        this.standards = standards;
        this.subjects = subjects;
        this.students = students;
        return this.getLessons(subjects);
      }),
      map((lessons) => {
        this.lessons = lessons;
      })
    );
  }

  private getStandards(schoolStandards: ISchoolStandard[]) {
    return from(schoolStandards).pipe(
      mergeMap((standard) => this.standardService.getAll()),
      toArray(),
      map((standardLists) => standardLists.flat())
    );
  }

  private getSubjects(schoolStandards: ISchoolStandard[]) {
    return from(schoolStandards).pipe(
      mergeMap((standard) => this.subjectService.getAll(standard.standard!)),
      toArray(),
      map((subjectLists) => subjectLists.flat())
    );
  }

  private getStudents(inSchoolId: number, schoolStandards: ISchoolStandard[]) {
    return from(schoolStandards).pipe(
      mergeMap((standard) =>
        this.studentService.getAll(inSchoolId, standard.standard!)
      ),
      toArray(),
      map((studentLists) => studentLists.flat())
    );
  }

  private getLessons(subjects: ISubject[]) {
    return from(subjects).pipe(
      mergeMap((subject) => this.lessonService.getAll(subject.Id!)),
      toArray(),
      map((lessonLists) => lessonLists.flat())
    );
  }

  //==========================================================| Overall Performance
  public getOverallPerformance(progressList: IProgress[]): number {
    const total = progressList.reduce(
      (sum, p) => sum + p.Quiz + p.FillBlanks + p.TrueFalse,
      0
    );
    return total / (progressList.length * 3);
  }

  //==========================================================| Performance Grouping
  // School => Standard => Student => Subject => Lesson
  public getPerfPerStandard(progressList: IProgress[]): IChildNode[] {
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

  public getPerfPerSubject(progressList: IProgress[]): IChildNode[] {
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

  public getPerfPerStudent(progressList: IProgress[]): IChildNode[] {
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

  public getPerfPerLesson(progressList: IProgress[]): IChildNode[] {
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

  public getPerfPerLessonCompleted(progressList: IProgress[]): IChildNode[] {
    let perfPerLesson = this.getPerfPerLesson(progressList);
    return perfPerLesson.filter((eachLesson) => eachLesson.score > 90);
  }

  public notStartedLessonData(progressList: IProgress[]): IChildNode[] {
    let perfPerLesson = this.getPerfPerLesson(progressList);
    return perfPerLesson.filter((eachLesson) => eachLesson.score < 90);
  }
  public nextLessonData(progressList: IProgress[]): IChildNode[] {
    let perfPerLesson = this.getPerfPerLesson(progressList);
    return perfPerLesson
      .filter((eachLesson) => eachLesson.score < 90)
      .sort()
      .slice(0, 1);
  }

  //==========================================================| Each Latest Assesment
  // getLatestAssessments(
  //   schoolId: number,
  //   standardId: number,
  //   studentId: number
  // ) {
  //   let filteredProgress = this.progress.filter(
  //     (eachProgress) =>
  //       eachProgress.school == schoolId &&
  //       eachProgress.standard == standardId &&
  //       eachProgress.student == studentId
  //   );

  //   const subjectMap = new Map<
  //     number,
  //     { lesson: number; qz: number; fb: number; tf: number }
  //   >();

  //   filteredProgress.forEach((p) => {
  //     if (!subjectMap.has(p.subject!)) {
  //       subjectMap.set(p.subject!, {
  //         lesson: p.lesson!,
  //         qz: p.Quiz,
  //         fb: p.FillBlanks,
  //         tf: p.TrueFalse,
  //       });
  //     }

  //     if (p.Quiz != 0 || p.FillBlanks != 0 || p.TrueFalse != 0) {
  //       let data = subjectMap.get(p.subject!)!;
  //       data.lesson = p.lesson!;
  //       data.qz = p.Quiz;
  //       data.fb = p.FillBlanks;
  //       data.tf = p.TrueFalse;
  //     }
  //   });

  //   return Array.from(subjectMap.entries()).map(([subject, data]) => ({
  //     subject: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
  //     lesson:
  //       this.lessons.find((l) => l.Id === data.lesson!)?.Name || 'Unknown',
  //     qz: data.qz,
  //     fb: data.fb,
  //     tf: data.tf,
  //   }));
  // }

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

  // generateActivityFeed() {
  //   const completed = this.progress.map(
  //     (p) =>
  //       `Completed ${
  //         this.lessons.find((l) => l.Id === p.lesson)?.Name || 'Unknown'
  //       } in ${
  //         this.subjects.find((s) => s.Id === p.subject)?.name || 'Unknown'
  //       } - Score: ${p.Quiz}%`
  //   );
  //   const nextLessons = this.lessons.filter(
  //     (l) => !this.progress.some((p) => p.lesson === l.Id)
  //   );
  //   const upcoming = nextLessons.map(
  //     (l) =>
  //       `Upcoming lesson: ${l.Name} in ${
  //         this.subjects.find((s) => s.Id === l.subject)?.name || 'Unknown'
  //       }`
  //   );
  //   return [...completed, ...upcoming];
  // }
}
