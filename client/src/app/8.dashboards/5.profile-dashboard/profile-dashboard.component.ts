import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router'; // Import RouterModule
import { FormsModule } from '@angular/forms';
import { LoginDetailService } from '../../0.logindetail/logindetail.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { StandardService } from '../../5.standard/standard.service';
import { StudentService } from '../../3.1.student/student.service';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // ✅ Ensure RouterModule is imported
  templateUrl: './profile-dashboard.component.html',
  styleUrls: ['./profile-dashboard.component.css'],
})
export class ProfileDashboardComponent implements OnInit {
  isEditProfileOpen = false;
  schoolId!: number;
  standardId!: number;
  studentId!: number;
  menuItems: any[] = [];

  studentName = 'John Doe';
  adhaarNumber = '2222-2222-2222';
  standardName = '3rd';
  constructor(
    private logindetailService: LoginDetailService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private standardService: StandardService,
    private studentService: StudentService
  ) {
    this.route.params.subscribe((params) => {
      this.schoolId = +params['schoolId'];
      this.standardId = +params['standardId'];
      this.studentId = +params['studentId'];

      this.studentService.get(this.studentId).subscribe((data) => {
        this.studentName = data.name;
        this.adhaarNumber = data.adhaar;
      });
      this.standardService.get(this.standardId).subscribe((data) => {
        this.standardName = data.name;
      });
    });
  }

  ngOnInit(): void {
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
    this.cdr.detectChanges();
  }
  logout() {
    // Perform logout logic (e.g., clear session/token)
    localStorage.removeItem('authToken'); // Example: Clear authentication token

    // Navigate to the login page
    this.router.navigate(['/login']);
  }

}
