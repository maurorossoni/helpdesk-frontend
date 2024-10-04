import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config'; // Importando configuração da API
import { Equipamento } from '../models/equipamento'; // Importando o modelo de Equipamento

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {

  constructor(private http: HttpClient) { }

  // Método para encontrar um equipamento por ID
  findById(id: number): Observable<Equipamento> {
    return this.http.get<Equipamento>(`${API_CONFIG.baseUrl}/equipamentos/${id}`);
  }

  // Método para obter todos os equipamentos
  findAll(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(`${API_CONFIG.baseUrl}/equipamentos`);
  }

  // Método para criar um novo equipamento
  create(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(`${API_CONFIG.baseUrl}/equipamentos`, equipamento);
  }

  // Método para atualizar um equipamento existente
  update(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.put<Equipamento>(`${API_CONFIG.baseUrl}/equipamentos/${equipamento.id}`, equipamento);
  }

  // Método para excluir um equipamento
  delete(id: number): Observable<Equipamento> {
    return this.http.delete<Equipamento>(`${API_CONFIG.baseUrl}/equipamentos/${id}`);
  }
}
