import { Routes } from '@angular/router';
import { SchoolComponent } from './1.school/school.component';
import { StudentComponent } from './3.student/student.component';
import { StandardComponent } from './5.standard/standard.component';
import { SubjectComponent } from './6.subject/subject.component';
import { ContentComponent } from './content/content.component';
import { ProgressComponent } from './4.progress/progress.component';

export const routes: Routes = [
  { path: '', component: SchoolComponent },
  { path: 'school', component: SchoolComponent },
  { path: 'standard/school/:schoolId', component: StandardComponent },
  { path: 'student/standard/:standardId', component: StudentComponent },
  { path: 'subject/standard/:standardId', component: SubjectComponent },
  { path: 'content/subject/:subjectId', component: ContentComponent },
  { path: 'progress/student/:studentId', component: ProgressComponent },
];
