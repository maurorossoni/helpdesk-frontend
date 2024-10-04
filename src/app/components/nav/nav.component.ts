import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  showCalculadora = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService) { }

  ngOnInit(): void {
    this.router.navigate(['home']);
  }

  toggleCalculadora() {
    this.showCalculadora = !this.showCalculadora;
  }

  logout() {
    this.router.navigate(['login']);
    this.authService.logout();
    this.toast.info('Logout realizado com sucesso', 'Logout');
  }
}
