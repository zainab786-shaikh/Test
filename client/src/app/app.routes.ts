import { Routes } from '@angular/router';
import { LoginDetailComponent } from './0.logindetail/logindetail.component';
import { SchoolComponent } from './1.school/school.component';
import { SchoolStandardComponent } from './2.schoolstandard/schoolstandard.component';
import { StudentComponent } from './3.student/student.component';
import { ProgressComponent } from './4.progress/progress.component';
import { StandardComponent } from './5.standard/standard.component';
import { SubjectComponent } from './6.subject/subject.component';
import { LessonComponent } from './7.lesson/lesson.component';
import { StudentDashboardComponent } from './8.dashboards/3.student-dashboard/student-dashboard.component';
import { StandardDashboardComponent } from './8.dashboards/2.standard-dashboard/standard-dashboard.component';
import { SchoolDashboardComponent } from './8.dashboards/1.school-dashboard/school-dashboard.component';
import { LoginComponent } from './0.login/login.component';
import { QuizComponent } from './9.evaluation/3.quiz/quiz.component';
import { FillBlankComponent } from './9.evaluation/4.fillblank/fillblank.component';
import { TrueFalseComponent } from './9.evaluation/5.truefalse/truefalse.component';
import { EvaluationComponent } from './9.evaluation/1.evaluation/evaluation.component';

export const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: 'school', component: SchoolDashboardComponent },
  { path: 'standard', component: StandardDashboardComponent },
  { path: 'student', component: StudentDashboardComponent },

  //   { path: 'login-details', component: LoginDetailComponent },
  //   { path: 'school', component: SchoolComponent },
  //   {
  //     path: 'schoolstandard/school/:schoolId',
  //     component: SchoolStandardComponent,
  //   },
  //   {
  //     path: 'student/school/:schoolId/standard/:standardId',
  //     component: StudentComponent,
  //   },
  //   {
  //     path: 'progress/school/:schoolId/standard/:standardId/student/:studentId',
  //     component: ProgressComponent,
  //   },
  //   { path: 'standard', component: StandardComponent },
  //   { path: 'subject/standard/:standardId', component: SubjectComponent },
  //   { path: 'lesson/subject/:subjectId', component: LessonComponent },
];
