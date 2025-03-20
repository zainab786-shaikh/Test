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
import { LessonSectionComponent } from './7.lessonsection/lessonsection.component';

import { SubjectDashboard2Component } from './8.dashboards/4.subject-dashboard2/subject-dashboard2.component';
import { ProfileDashboardComponent } from './8.dashboards/5.profile-dashboard/profile-dashboard.component';

import { LandingPageComponent } from './landingPage/landing-page/landing-page.component'; // Import Landing Page
export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // ✅ Landing Page as Default Route
  { path: 'login', component: LoginComponent }, // ✅ Add Login Page route
  { path: 'login-details', component: LoginDetailComponent },

  //====================================| Principal/Teachers routes
  { path: 'principal', redirectTo: 'school-dashboard', pathMatch: 'full' },
  { path: 'teacher', redirectTo: 'school-dashboard', pathMatch: 'full' },

  { path: 'school-dashboard', component: SchoolDashboardComponent },
  {
    path: 'standard-dashboard/school/:schoolId/standard/:standardId',
    component: StandardDashboardComponent,
  },

  //====================================| Admin routes
  { path: 'admin', redirectTo: 'school', pathMatch: 'full' },
  { path: 'school', component: SchoolComponent },
  {
    path: 'schoolstandard/school/:schoolId',
    component: SchoolStandardComponent,
  },
  { path: 'standard', component: StandardComponent },
  {
    path: 'student/school/:schoolId/standard/:standardId',
    component: StudentComponent,
  },
  { path: 'standard', component: StandardComponent },
  { path: 'subject/standard/:standardId', component: SubjectComponent },
  { path: 'lesson/subject/:subjectId', component: LessonComponent },
  {
    path: 'lessonsection/subject/:subjectId/lesson/:lessonId',
    component: LessonSectionComponent,
  },

  //====================================| Students routes
  {
    path: 'student/school/:schoolId/standard/:standardId/student/:studentId',
    redirectTo: 'student-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'student-dashboard/school/:schoolId/standard/:standardId/student/:studentId',
    component: StudentDashboardComponent,
  },
  {
    path: 'evaluation/school/:schoolId/standard/:standardId/student/:studentId/subject/:subjectId/lesson/:lessonId/lessonsection/:lessonsectionId',
    component: EvaluationComponent,
  },
  {
    path: 'progress/school/:schoolId/standard/:standardId/student/:studentId',
    component: ProgressComponent,
  },
  // ✅ NEW ROUTE for Subject Dashboard 2
  {
    path: 'subject-dashboard2/school/:schoolId/standard/:standardId/student/:studentId',
    component: SubjectDashboard2Component,
  },
  // ✅ NEW ROUTE for Profile Dashboard
  {
    path: 'profile-dashboard/school/:schoolId/standard/:standardId/student/:studentId',
    component: ProfileDashboardComponent,
  },
];
