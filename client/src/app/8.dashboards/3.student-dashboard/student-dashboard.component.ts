import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {
  DashboardServiceHelper,
  IChildNode,
} from '../dashboard.component.servicehelper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  IParentNode,
  UtilProgressBarComponent,
} from '../0.utils/1.progress-bar/progress-bar.component';
import { BarPlotter } from '../dashboard.component.servicePlotter';
import { ProgressService } from '../../4.progress/progress.service';
import { ActivatedRoute, Router } from '@angular/router';

PlotlyModule.plotlyjs = PlotlyJS;

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
  
  completedLessonData!: IParentNode[];
  nextLessonData!: IParentNode[];
  pendingLessonData!: IParentNode[];

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
          this.completedLessonData = this.perfPerSubject.map((eachSubject) => {
            let lessonList = data.filter(
              (eachProgress) => eachProgress.subject == eachSubject.Id
            );
            return {
              Id: eachSubject.Id,
              name: eachSubject.name,
              score: eachSubject.score,
              expanded: false,
              childList:
                this.serviceHelper.getPerfPerLessonCompleted(lessonList),
            };
          });

          this.pendingLessonData = this.perfPerSubject.map((eachSubject) => {
            let lessonList = data.filter(
              (eachProgress) => eachProgress.subject == eachSubject.Id
            );
            return {
              Id: eachSubject.Id,
              name: eachSubject.name,
              score: eachSubject.score,
              expanded: false,
              childList: this.serviceHelper.notStartedLessonData(lessonList),
            };
          });

          this.nextLessonData = this.perfPerSubject.map((eachSubject) => {
            let lessonList = data.filter(
              (eachProgress) => eachProgress.subject == eachSubject.Id
            );
            return {
              Id: eachSubject.Id,
              name: eachSubject.name,
              score: eachSubject.score,
              expanded: false,
              childList: this.serviceHelper.nextLessonData(lessonList),
            };
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
