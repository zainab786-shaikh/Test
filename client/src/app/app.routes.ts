import { Routes } from '@angular/router';
import { SchoolComponent } from './school/school.component';
import { StudentComponent } from './student/student.component';
import { StandardComponent } from './standard/standard.component';
import { SubjectComponent } from './subject/subject.component';
import { ContentComponent } from './content/content.component';
import { ProgressComponent } from './progress/progress.component';

export const routes: Routes = [
  { path: '', component: SchoolComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'standard/school/:schoolId', component: StandardComponent },
  { path: 'student/standard/:standardId', component: StudentComponent },
  { path: 'subject/standard/:standardId', component: SubjectComponent },
  { path: 'content/subject/:subjectId', component: ContentComponent },
  { path: 'progress/student/:studentId', component: ProgressComponent },
];
