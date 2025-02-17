import { ISchool } from '../1.school/school.model';
import { ISchoolStandard } from '../2.schoolstandard/schoolstandard.model';
import { IStudent } from '../3.student/student.model';
import { IProgress } from '../4.progress/progress.model';
import { IStandard } from '../5.standard/standard.model';
import { ISubject } from '../6.subject/subject.model';
import { ILesson } from '../7.lesson/lesson.model';

export class DashboardData {
  getSchool(): ISchool[] {
    return [{ Id: 1, name: 'ABC School', address: '123 Street' }];
  }

  getSchoolStandard(): ISchoolStandard[] {
    return [{ Id: 1, school: 1, standard: 1 }];
  }

  getStudent(): IStudent[] {
    return [
      {
        Id: 1,
        name: 'John Doe',
        adhaar: '123456789012',
        school: 1,
        standard: 1,
      },
    ];
  }

  getStandard(): IStandard[] {
    return [{ Id: 1, name: 'Standard 5' }];
  }

  getSubject(): ISubject[] {
    return [
      { Id: 1, name: 'Math', standard: 1 },
      { Id: 2, name: 'Science', standard: 1 },
      { Id: 3, name: 'History', standard: 1 },
      { Id: 4, name: 'Geography', standard: 1 },
      { Id: 5, name: 'Civic', standard: 1 },
    ];
  }

  getLesson(): ILesson[] {
    return [
      {
        Id: 1,
        Name: 'Algebra',
        Explanation: 'Algebra Explanation',
        Quiz: '80',
        FillBlanks: '75',
        TrueFalse: '85',
        subject: 1,
      },
      {
        Id: 2,
        Name: 'Geometry',
        Explanation: 'Geometry Explanation',
        Quiz: '80',
        FillBlanks: '75',
        TrueFalse: '85',
        subject: 1,
      },
      {
        Id: 3,
        Name: 'The Sun',
        Explanation: 'The Sun Explanation',
        Quiz: '80',
        FillBlanks: '75',
        TrueFalse: '85',
        subject: 2,
      },
      {
        Id: 4,
        Name: 'The Moon',
        Explanation: 'The Moon Explanation',
        Quiz: '80',
        FillBlanks: '75',
        TrueFalse: '85',
        subject: 2,
      },
      {
        Id: 5,
        Name: 'The Earth',
        Explanation: 'The Earth Explanation',
        Quiz: '80',
        FillBlanks: '75',
        TrueFalse: '85',
        subject: 2,
      },
    ];
  }

  getProgress(): IProgress[] {
    return [
      {
        Id: 1,
        Quiz: 80,
        FillBlanks: 75,
        TrueFalse: 85,
        school: 1,
        standard: 1,
        student: 1,
        subject: 1,
        lesson: 1,
      },
      {
        Id: 2,
        Quiz: 80,
        FillBlanks: 75,
        TrueFalse: 85,
        school: 1,
        standard: 1,
        student: 1,
        subject: 1,
        lesson: 2,
      },
      {
        Id: 3,
        Quiz: 80,
        FillBlanks: 75,
        TrueFalse: 85,
        school: 1,
        standard: 1,
        student: 1,
        subject: 2,
        lesson: 3,
      },
      {
        Id: 4,
        Quiz: 80,
        FillBlanks: 75,
        TrueFalse: 85,
        school: 1,
        standard: 1,
        student: 1,
        subject: 2,
        lesson: 4,
      },
    ];
  }
}
