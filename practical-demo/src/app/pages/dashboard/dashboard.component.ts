import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private router: Router
  ) { }

  editProfile(): void {
    this.router.navigate(['/edit-profile/' + localStorage.getItem('U_ID')]);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['']);
  }

}
