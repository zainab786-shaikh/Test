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
import { RouterModule } from '@angular/router'; // Add this import

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
    RouterModule,
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
  menuItems: any[] = []; // Initialize as an empty array

  // Add these properties below
  totalLessons: number = 0;
  completedLessons: number = 0;
  totalSubjects: number = 0;
  coveredSubjects: number = 0;
  overallProgress: number = 0;

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
    // Initialize menuItems after IDs are set
    this.menuItems = [
      {
        path: [
          '/student-dashboard',
          'school',
          this.schoolId,
          'standard',
          this.standardId,
          'student',
          this.studentId,
        ],
        label: 'Dashboard',
        icon: 'fa-house',
        svgPath:
          'M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z',
        viewBox: '0 0 576 512',
      },
      {
        path: [
          '/subject-dashboard2',
          'school',
          this.schoolId,
          'standard',
          this.standardId,
          'student',
          this.studentId,
        ],
        label: 'Subjects',
        icon: 'fa-book',
        svgPath:
          'M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z',
        viewBox: '0 0 448 512',
      },
      {
        path: [
          '/profile-dashboard',
          'school',
          this.schoolId,
          'standard',
          this.standardId,
          'student',
          this.studentId,
        ],
        label: 'Profile',
        icon: 'fa-user',
        svgPath:
          'M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z',
        viewBox: '0 0 448 512',
      },
      {
        path: ['/login'],
        label: 'Logout',
        icon: 'fa-right-from-bracket',
        svgPath:
          'M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z',
        viewBox: '0 0 512 512',
      },
    ];

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

          this.completedLessonSectionData = this.filterSubjectData(
            this.subjectData,
            (lessonSection) => lessonSection.score === 100
          );

          this.pendingLessonSectionData = this.filterSubjectData(
            this.subjectData,
            (lessonSection) => lessonSection.score < 100
          );

          let copiedSubjectData: IChildNode[] = JSON.parse(
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

          // 🔹 ADD NEW LOGIC FOR PROGRESS TRACKING HERE
          // Calculate total lessons and completed lessons
          this.totalLessons = data.length; // Assuming data contains all lessons
          this.completedLessons = data.filter(
            (lesson) => lesson.score === 100
          ).length;

          // Calculate total subjects and covered subjects
          this.totalSubjects = this.perfPerSubject.length;
          this.coveredSubjects = this.perfPerSubject.filter((subject) =>
            subject.childList?.some((lesson) => lesson.score === 100)
          ).length;

          // Calculate overall progress percentage
          this.overallProgress =
            this.totalLessons > 0
              ? Math.round((this.completedLessons / this.totalLessons) * 100)
              : 0;
        });
    });
  }

  private filterSubjectData(
    subjectData: IChildNode[],
    comparisonFn: (lessonSection: IChildNode) => boolean
  ) {
    let copiedSubjectData: IChildNode[] = JSON.parse(
      JSON.stringify(subjectData)
    );

    let filteredSubjectData = copiedSubjectData
      // First, filter to only include subjects with at least one lesson section that passes the comparison
      .filter((subject) =>
        subject.childList?.some((lesson) =>
          lesson.childList?.some((lessonSection) => comparisonFn(lessonSection))
        )
      )
      // Then map those subjects to include only the qualifying lessons and lesson sections
      .map((subject) => {
        // Create a new subject object with filtered lessons
        return {
          ...subject,
          childList: subject.childList
            ?.filter((lesson: IChildNode) =>
              lesson.childList?.some((lessonSection: IChildNode) =>
                comparisonFn(lessonSection)
              )
            )
            // For each qualifying lesson, filter to only include sections that pass the comparison
            .map((lesson: IChildNode) => {
              return {
                ...lesson,
                childList: lesson.childList?.filter((lessonSection) =>
                  comparisonFn(lessonSection)
                ),
              };
            }),
        };
      });

    return filteredSubjectData;
  }

  clickByLessonSection(event: {
    parentId: number;
    childId: number;
    grandChildId: number;
  }) {
    console.log(
      'Subject Id: ' +
        event.parentId +
        ' Lesson Id: ' +
        event.childId +
        'Lesson Section Id: ',
      event.grandChildId
    );
    let subjectId = event.parentId;
    let lessonId = event.childId;
    let lessonSectionId = event.grandChildId;
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
      'lessonsection',
      lessonSectionId,
    ]);
  }
}
