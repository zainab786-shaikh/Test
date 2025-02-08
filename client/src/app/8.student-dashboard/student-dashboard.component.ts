import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

import { ISchool } from '../1.school/school.model';
import { ISchoolStandard } from '../2.schoolstandard/schoolstandard.model';
import { IStudent } from '../3.student/student.model';
import { IStandard } from '../5.standard/standard.model';
import { ISubject } from '../6.subject/subject.model';
import { ILesson } from '../7.lesson/lesson.model';
import { IProgress } from '../4.progress/progress.model';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-student-dashboard',
  imports: [CommonModule, MatCardModule, MatTableModule, PlotlyModule],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.css',
})
export class StudentDashboardComponent {
  constructor() {}

  ngOnInit(): void {}

  //====================================| Dummy Data
  schools: ISchool[] = [{ Id: 1, name: 'ABC School', address: '123 Street' }];

  schoolStandards: ISchoolStandard[] = [{ Id: 1, school: 1, standard: 1 }];

  students: IStudent[] = [
    { Id: 1, name: 'John Doe', adhaar: '123456789012', school: 1, standard: 1 },
  ];

  standards: IStandard[] = [{ Id: 1, name: 'Standard 5' }];

  subjects: ISubject[] = [
    { Id: 1, name: 'Math', standard: 1 },
    { Id: 2, name: 'Science', standard: 1 },
    { Id: 3, name: 'History', standard: 1 },
    { Id: 4, name: 'Geography', standard: 1 },
    { Id: 5, name: 'Civic', standard: 1 },
  ];

  lessons: ILesson[] = [
    {
      Id: 1,
      Name: 'Algebra',
      Quiz: '80',
      FillBlanks: '75',
      TrueFalse: '85',
      subject: 1,
    },
    {
      Id: 2,
      Name: 'Geometry',
      Quiz: '80',
      FillBlanks: '75',
      TrueFalse: '85',
      subject: 1,
    },
    {
      Id: 3,
      Name: 'The Sun',
      Quiz: '80',
      FillBlanks: '75',
      TrueFalse: '85',
      subject: 2,
    },
    {
      Id: 4,
      Name: 'The Moon',
      Quiz: '80',
      FillBlanks: '75',
      TrueFalse: '85',
      subject: 2,
    },
    {
      Id: 5,
      Name: 'The Earth',
      Quiz: '80',
      FillBlanks: '75',
      TrueFalse: '85',
      subject: 2,
    },
  ];

  progress: IProgress[] = [
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

  //====================================| Calculations
  overallPerformance: number = this.calculateOverallPerformance();
  subjectScores = this.calculateSubjectScores();
  latestAssessments = this.getLatestAssessments();
  comparisonData = this.getComparisonData();
  goals = this.generateGoals();
  activityFeed = this.generateActivityFeed();

  private calculateOverallPerformance(): number {
    const total = this.progress.reduce(
      (sum, p) => sum + p.Quiz + p.FillBlanks + p.TrueFalse,
      0
    );
    return total / (this.progress.length * 3);
  }

  private calculateSubjectScores() {
    const subjectMap = new Map<number, { total: number; count: number }>();
    this.progress.forEach((p) => {
      if (!subjectMap.has(p.subject!)) {
        subjectMap.set(p.subject!, { total: 0, count: 0 });
      }
      let subj = subjectMap.get(p.subject!)!;
      subj.total += p.Quiz + p.FillBlanks + p.TrueFalse;
      subj.count += 3;
    });
    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
      score: data.total / data.count,
    }));
  }

  private getLatestAssessments() {
    const subjectMap = new Map<
      number,
      { lesson: number; qz: number; fb: number; tf: number }
    >();

    this.progress.forEach((p) => {
      if (!subjectMap.has(p.subject!)) {
        subjectMap.set(p.subject!, {
          lesson: p.lesson!,
          qz: p.Quiz,
          fb: p.FillBlanks,
          tf: p.TrueFalse,
        });
      }

      if (p.Quiz != 0 || p.FillBlanks != 0 || p.TrueFalse != 0) {
        let data = subjectMap.get(p.subject!)!;
        data.lesson = p.lesson!;
        data.qz = p.Quiz;
        data.fb = p.FillBlanks;
        data.tf = p.TrueFalse;
      }
    });
    return Array.from(subjectMap.entries()).map(([subject, data]) => ({
      subject: this.subjects.find((s) => s.Id === subject)?.name || 'Unknown',
      lesson:
        this.lessons.find((l) => l.Id === data.lesson!)?.Name || 'Unknown',
      qz: data.qz,
      fb: data.fb,
      tf: data.tf,
    }));
  }

  private getComparisonData() {
    return this.subjectScores.map((s) => ({
      subject: s.subject,
      studentScore: s.score,
      classAvg: s.score - 5, // Assuming class average is 5% lower for now
    }));
  }

  private generateGoals() {
    return this.comparisonData
      .filter((data) => data.studentScore < data.classAvg)
      .map(
        (data) =>
          `Improve in ${data.subject}. Your score: ${data.studentScore}%, Class Average: ${data.classAvg}%. Focus on weak areas.`
      );
  }

  private generateActivityFeed() {
    const completed = this.progress.map(
      (p) =>
        `Completed ${
          this.lessons.find((l) => l.Id === p.lesson)?.Name || 'Unknown'
        } in ${
          this.subjects.find((s) => s.Id === p.subject)?.name || 'Unknown'
        } - Score: ${p.Quiz}%`
    );
    const nextLessons = this.lessons.filter(
      (l) => !this.progress.some((p) => p.lesson === l.Id)
    );
    const upcoming = nextLessons.map(
      (l) =>
        `Upcoming lesson: ${l.Name} in ${
          this.subjects.find((s) => s.Id === l.subject)?.name || 'Unknown'
        }`
    );
    return [...completed, ...upcoming];
  }

  //====================================| Plot
  overallPerformanceData = [
    {
      type: 'bar',
      x: [this.overallPerformance], // X-axis represents the value (horizontal bar)
      y: [0],
      orientation: 'h', // Ensures it's a horizontal bar chart
      marker: {
        color:
          this.overallPerformance >= 75
            ? 'green'
            : this.overallPerformance >= 50
            ? 'yellow'
            : 'red',
      },
    },
  ];

  overallPerformanceLayout = {
    title: 'Overall Performance',
    xaxis: { range: [0, 100], title: 'Percentage' },
    yaxis: { range: [0, 1] },
    showlegend: false,
    height: 130,
    margin: { l: 30, r: 30, t: 30, b: 30 },
  };

  subjectPerformanceData = [
    {
      type: 'pie',
      labels: this.subjectScores.map((s) => s.subject),
      values: this.subjectScores.map((s) => s.score),
      hole: 0.4,
    },
  ];

  subjectPerformanceLayout = {
    title: 'Progress by Subject',
    height: 130,
    margin: { l: 30, r: 30, t: 30, b: 30 },
  };

  overallSubjectPerformanceData = [
    {
      type: 'bar',
      x: this.subjectScores.map((s) => s.score), // X-axis represents the value (horizontal bar)
      y: this.subjectScores.map((s) => s.subject),
      orientation: 'h', // Ensures it's a horizontal bar chart
    },
  ];

  overallSubjectPerformanceLayout = {
    title: 'Overall Performance',
    xaxis: { range: [0, 100], title: 'Percentage' },
    yaxis: { range: [0, 1] },
    showlegend: false,
    height: 130,
    margin: { l: 30, r: 30, t: 30, b: 30 },
  };
}
