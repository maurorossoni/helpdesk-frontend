import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Simula um carregamento de 2 segundos
    setTimeout(() => {
      document.querySelector('.loader')!.setAttribute('style', 'display: none;');
      document.querySelector('.card')!.setAttribute('style', 'display: block;');
    }, 2000);
  }
}
