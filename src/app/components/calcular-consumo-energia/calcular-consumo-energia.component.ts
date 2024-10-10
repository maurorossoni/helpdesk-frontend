import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../models/equipamento';

@Component({
    selector: 'app-calcular-consumo-energia',
    templateUrl: './calcular-consumo-energia.component.html',
    styleUrls: ['./calcular-consumo-energia.component.css']
})
export class CalcularConsumoEnergiaComponent implements OnInit {
    consumoTotal: number = 0; 
    custoTotal: number = 0; 
    equipamentos: Equipamento[] = []; 
    tempoUso: { [id: number]: number } = {}; 
    valorKwh: number = 0.59290; 
    selectAll: boolean = false; 
    showResults: boolean = false; 

    constructor(private equipamentoService: EquipamentoService, private router: Router) {}

    ngOnInit(): void {
        this.loadEquipamentos(); 
    }

    loadEquipamentos(): void {
        this.equipamentoService.findAll().subscribe((data: Equipamento[]) => {
            this.equipamentos = data;
        }, error => {
            console.error('Erro ao carregar equipamentos:', error);
        });
    }

    toggleSelectAll(event: Event): void {
        this.selectAll = (event.target as HTMLInputElement).checked;
        this.equipamentos.forEach(equipamento => {
            equipamento.selected = this.selectAll;
            if (!this.selectAll) {
                this.tempoUso[equipamento.id] = 0; 
            }
        });
    }

    toggleEquipamentoSelection(equipamento: Equipamento): void {
        equipamento.selected = !equipamento.selected;
        if (!equipamento.selected) {
            this.tempoUso[equipamento.id] = 0; 
        }
    }

    calcularConsumo(): void {
        this.consumoTotal = 0;
        for (const equipamento of this.equipamentos) {
            if (equipamento.selected) {
                const tempo = this.tempoUso[equipamento.id] || 0;
                this.consumoTotal += equipamento.potencia * tempo;
            }
        }
        this.custoTotal = this.consumoTotal * this.valorKwh;
        this.showResults = true;

        // Redireciona para a tela de fatura e passa também o dicionário de tempo de uso
        this.router.navigate(['/fatura'], {
            queryParams: {
                consumoTotal: this.consumoTotal,
                custoTotal: this.custoTotal,
                equipamentos: JSON.stringify(this.equipamentos.filter(e => e.selected)),
                tempoUso: JSON.stringify(this.tempoUso) // Passando o tempo de uso
            }
        });
    }

    resetarValores(): void {
        this.consumoTotal = 0;
        this.custoTotal = 0;
        this.tempoUso = {};
        this.selectAll = false; 
        this.equipamentos.forEach(equipamento => {
            equipamento.selected = false; 
        });
        this.showResults = false; 
        alert("Todos os valores foram resetados.");
    }
}
