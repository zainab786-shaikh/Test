import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { DashboardServiceHelper } from '../dashboard.component.servicehelper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  IChildNode,
  UtilProgressBarComponent,
} from '../0.utils/1.progress-bar/progress-bar.component';
import { BarPlotter } from '../dashboard.component.servicePlotter';
import { ProgressService } from '../../4.progress/progress.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgress } from '../../4.progress/progress.model';

PlotlyModule.plotlyjs = PlotlyJS;

enum tagChildList {
  completed,
  next,
  pending,
}
@Component({
  selector: 'app-student-dashboard',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    PlotlyModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
    UtilProgressBarComponent,
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  schoolId!: number;
  standardId!: number;
  studentId!: number;

  perfOverall!: number;
  perfOverallPlotter: BarPlotter = new BarPlotter([], [], 'Loading...'); // Initialize with default

  perfPerSubject!: IChildNode[];
  perfPerLesson!: IChildNode[];

  subjectData!: IChildNode[];
  completedLessonSectionData!: IChildNode[] | [];
  nextLessonSectionData!: IChildNode[] | [];
  pendingLessonSectionData!: IChildNode[] | [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private progressService: ProgressService,
    private serviceHelper: DashboardServiceHelper
  ) {
    this.route.params.subscribe((params) => {
      this.schoolId = +params['schoolId'];
      this.standardId = +params['standardId'];
      this.studentId = +params['studentId'];
    });
  }

  ngOnInit(): void {
    this.serviceHelper.initializeDashboardData(this.schoolId).subscribe(() => {
      this.progressService
        .getAllStudent(this.schoolId, this.standardId, this.studentId)
        .subscribe((data) => {
          this.perfOverall = this.serviceHelper.getOverallPerformance(data);
          this.perfOverallPlotter = new BarPlotter(
            [this.perfOverall],
            [0],
            'Overall Performance'
          );

          this.perfPerSubject = this.serviceHelper.getPerfPerSubject(data);
          this.subjectData = this.perfPerSubject.map((eachSubject) => {
            let lessonDataProgressList = data.filter(
              (eachProgress) => eachProgress.subject == eachSubject.Id
            );

            eachSubject.childList = this.serviceHelper.getPerfPerLesson(
              lessonDataProgressList
            );

            eachSubject.childList?.map((eachLesson) => {
              let lessonSectionDataProgressList = data.filter(
                (eachProgress) =>
                  eachProgress.subject == eachSubject.Id &&
                  eachProgress.lesson == eachLesson.Id
              );

              eachLesson.childList = this.serviceHelper.getPerfPerLessonSection(
                lessonSectionDataProgressList
              );
            });

            return eachSubject;
          });

          let copiedSubjectData: IChildNode[] = JSON.parse(
            JSON.stringify(this.subjectData)
          );
          this.completedLessonSectionData = copiedSubjectData.map(
            (eachSubject) => {
              let pendingLessonList = eachSubject.childList?.filter(
                (eachLesson) => eachLesson.score <= 100
              );
              if (pendingLessonList && pendingLessonList?.length > 0) {
                pendingLessonList.map((eachLesson) => {
                  let pendingLessonSectionList = eachLesson.childList?.filter(
                    (eachLessonSection) => eachLessonSection.score == 100
                  );
                  eachLesson.childList = pendingLessonSectionList;
                });
              }
              eachSubject.childList = pendingLessonList;

              return eachSubject;
            }
          );

          copiedSubjectData = JSON.parse(JSON.stringify(this.subjectData));
          this.pendingLessonSectionData = copiedSubjectData.map(
            (eachSubject) => {
              let pendingLessonList = eachSubject.childList?.filter(
                (eachLesson) => eachLesson.score < 100
              );
              if (pendingLessonList && pendingLessonList?.length > 0) {
                pendingLessonList.map((eachLesson) => {
                  let pendingLessonSectionList = eachLesson.childList?.filter(
                    (eachLessonSection) => eachLessonSection.score < 100
                  );
                  eachLesson.childList = pendingLessonSectionList;
                });
              }
              eachSubject.childList = pendingLessonList;

              return eachSubject;
            }
          );

          copiedSubjectData = JSON.parse(
            JSON.stringify(this.pendingLessonSectionData)
          );
          this.nextLessonSectionData = copiedSubjectData.map((eachSubject) => {
            let firstLesson = eachSubject.childList?.slice(0, 1);
            if (firstLesson && firstLesson?.length > 0) {
              let firstLessonSection = firstLesson[0].childList?.slice(0, 1);
              firstLesson[0].childList = firstLessonSection;
            }
            eachSubject.childList = firstLesson;

            return eachSubject;
          });
        });
    });
  }

  clickByLesson(event: { parentId: number; childId: number }) {
    console.log(
      'Subject Id: ' + event.parentId + ' Lesson Id: ' + event.childId
    );
    let subjectId = event.parentId;
    let lessonId = event.childId;
    //'evaluation/school/:schoolId/standard/:standardId/student/:studentId/subject/:subjectId/lesson/:lessonId',
    this.router.navigate([
      'evaluation',
      'school',
      this.schoolId,
      'standard',
      this.standardId,
      'student',
      this.studentId,
      'subject',
      subjectId,
      'lesson',
      lessonId,
    ]);
  }
}
