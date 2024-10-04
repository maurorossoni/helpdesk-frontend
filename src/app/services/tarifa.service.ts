// services/tarifa.service.ts
import { Injectable } from '@angular/core';
import { Tarifa } from '../models/tarifa';

@Injectable({
  providedIn: 'root'
})
export class TarifaService {
  private tarifas: Tarifa[] = [
    { nome: 'Tarifa 1', valor: 0.50 },
    { nome: 'Tarifa 2', valor: 0.75 },
    { nome: 'Tarifa 3', valor: 1.00 }
  ];

  constructor() { }

  getTarifas(): Tarifa[] {
    return this.tarifas;
  }
}
