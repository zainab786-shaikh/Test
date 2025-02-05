import { Routes } from '@angular/router';
import { SchoolComponent } from './1.school/school.component';
import { SchoolStandardComponent } from './2.schoolstandard/schoolstandard.component';
import { StudentComponent } from './3.student/student.component';
import { ProgressComponent } from './4.progress/progress.component';
import { StandardComponent } from './5.standard/standard.component';
import { SubjectComponent } from './6.subject/subject.component';
import { LessonComponent } from './7.lesson/lesson.component';

export const routes: Routes = [
  { path: '', component: SchoolComponent },
  { path: 'school', component: SchoolComponent },
  {
    path: 'schoolstandard/school/:schoolId',
    component: SchoolStandardComponent,
  },
  {
    path: 'student/school/:schoolId/standard/:standardId',
    component: StudentComponent,
  },
  {
    path: 'progress/school/:schoolId/standard/:standardId/student/:studentId',
    component: ProgressComponent,
  },
  //{ path: 'standard', component: StandardComponent },
  //{ path: 'subject/standard/:standardId', component: SubjectComponent },
  //{ path: 'lesson/subject/:subjectId', component: LessonComponent },
];
