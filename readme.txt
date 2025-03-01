<mat-card class="overall-performance-card">
    <h2>Overall Performance</h2>
    <plotly-plot
    [data]="overallPerformanceData"
    [layout]="overallPerformanceLayout"
    ></plotly-plot>
</mat-card>

<mat-card class="subject-performance-card">
    <h2>Progress by Subject</h2>
    <plotly-plot
    [data]="subjectWisePiePerformanceData"
    [layout]="subjectWisePiePerformanceLayout"
    ></plotly-plot>
</mat-card>

------------------------------------------------------------
this.overallPerformanceData = [
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

    this.overallPerformanceLayout = {
      title: 'Overall Performance',
      xaxis: { range: [0, 100], title: 'Percentage' },
      yaxis: { range: [0, 1] },
      showlegend: false,
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };

    this.subjectWisePiePerformanceData = [
      {
        type: 'pie',
        labels: this.subjectWisePerformance.map((s) => s.subject),
        values: this.subjectWisePerformance.map((s) => s.score),
        hole: 0.4,
      },
    ];

    this.subjectWisePiePerformanceLayout = {
      title: 'Progress by Subject',
      height: 130,
      margin: { l: 30, r: 30, t: 30, b: 30 },
    };

    this.subjectWiseBarPerformanceData = [
      {
        type: 'bar',
        x: this.subjectWisePerformance.map((s) => s.score), // X-axis represents the value (horizontal bar)
        y: this.subjectWisePerformance.map((s) => s.subject),
        orientation: 'h', // Ensures it's a horizontal bar chart
      },
    ];

    --------------------------------------------------------------
    .dashboard-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
}
.overall-performance {
  display: flex;
  width: 100%;
}
.overall-performance-card {
  width: 70%;
}
.subject-performance-card {
  width: 30%;
}
.overall-subject {
  display: flex;
  width: 100%;
}

.dashboard-card {
  flex: 1 1 calc(20.333% - 20px); /* Example of a 3-column layout for other cards */
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
}

.mat-elevation-z8 {
  border-radius: 8px;
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  background: #f4f4f4;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}
