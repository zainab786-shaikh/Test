import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import {
  DashboardServiceHelper,
  IChildNode,
  IGrandChildNode,
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

  lessonSectionData!: {
    completed: IParentNode[];
    next: IParentNode[];
    pending: IParentNode[];
  };
  completedLessonSectionData!: IParentNode[];
  nextLessonSectionData!: IParentNode[];
  pendingLessonSectionData!: IParentNode[];

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
          this.completedLessonSectionData = this.perfPerSubject.map(
            (eachSubject) => {
              let lessonInSubjectProgressList = data.filter(
                (eachProgress) => eachProgress.subject == eachSubject.Id
              );

              return {
                Id: eachSubject.Id,
                name: eachSubject.name,
                score: eachSubject.score,
                expanded: false,
                childList: this.GetChildList(
                  data,
                  eachSubject,
                  lessonInSubjectProgressList,
                  tagChildList.completed
                ),
              };
            }
          );

          this.nextLessonSectionData = this.perfPerSubject.map(
            (eachSubject) => {
              let lessonList = data.filter(
                (eachProgress) => eachProgress.subject == eachSubject.Id
              );

              return {
                Id: eachSubject.Id,
                name: eachSubject.name,
                score: eachSubject.score,
                expanded: false,
                childList: this.GetChildList(
                  data,
                  eachSubject,
                  lessonList,
                  tagChildList.next
                ),
              };
            }
          );

          this.pendingLessonSectionData = this.perfPerSubject.map(
            (eachSubject) => {
              let lessonList = data.filter(
                (eachProgress) => eachProgress.subject == eachSubject.Id
              );

              return {
                Id: eachSubject.Id,
                name: eachSubject.name,
                score: eachSubject.score,
                expanded: false,
                childList: this.GetChildList(
                  data,
                  eachSubject,
                  lessonList,
                  tagChildList.pending
                ),
              };
            }
          );
        });
    });
  }

  private GetChildList(
    data: IProgress[],
    eachSubject: IChildNode,
    lessonInSubjectProgressList: IProgress[],
    state: tagChildList
  ): {
    Id: number;
    name: string;
    score: number;
    expanded: boolean;
    grandChildList?: IGrandChildNode[] | null;
  }[] {
    const lessonInSubjectList = this.serviceHelper.getPerfPerLesson(
      lessonInSubjectProgressList
    );
    return lessonInSubjectList.map((eachLesson) => {
      let lessonSectionProgressList = data.filter(
        (eachProgress) => eachProgress.lesson == eachLesson.Id
      );

      let retValue = null;
      if (state == tagChildList.completed) {
        retValue = this.serviceHelper.getPerfPerLessonSectionCompleted(
          lessonSectionProgressList
        );
      } else if (state == tagChildList.next) {
        retValue = this.serviceHelper.nextLessonSectionData(
          lessonSectionProgressList
        );
      } else if (state == tagChildList.pending) {
        retValue = this.serviceHelper.notStartedLessonSectionData(
          lessonSectionProgressList
        );
      }

      return {
        Id: eachLesson.Id,
        name: eachLesson.name,
        score: eachLesson.score,
        expanded: false,
        grandChildList: retValue,
      };
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
