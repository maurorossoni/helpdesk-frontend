import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../models/equipamento';
import { ToastrService } from 'ngx-toastr'; // Importa o Toastr

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
    isLoading: boolean = false; 

    constructor(
      private equipamentoService: EquipamentoService, 
      private router: Router,
      private toastr: ToastrService // Injeta o serviço Toastr
    ) {}

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

    validarHoras(equipamento: Equipamento): void {
        if (this.tempoUso[equipamento.id] > 24) {
            this.tempoUso[equipamento.id] = 24; // Limitar a 24 horas
        }
        if (this.tempoUso[equipamento.id] < 0) {
            this.tempoUso[equipamento.id] = 0; // Limitar a no mínimo 0 horas
        }
    }

    calcularConsumo(): void {
        this.isLoading = true; 
        setTimeout(() => {
            this.consumoTotal = 0;
            let validado = false;
            for (const equipamento of this.equipamentos) {
                if (equipamento.selected) {
                    const tempo = this.tempoUso[equipamento.id] || 0;
                    if (tempo === 0) {
                        this.toastr.error('Insira o tempo de uso de todos os equipamentos selecionados', 'Erro!');
                        validado = true;
                        this.isLoading = false;
                        return;
                    }
                    this.consumoTotal += equipamento.potencia * tempo;
                }
            }
            if (!validado) {
                this.custoTotal = this.consumoTotal * this.valorKwh;
                this.showResults = true;
                this.isLoading = false; 

                this.toastr.success('Cálculo realizado com sucesso!', 'Sucesso!');

                // Redireciona para a tela de fatura e passa o dicionário de tempo de uso
                this.router.navigate(['/fatura'], {
                    queryParams: {
                        consumoTotal: this.consumoTotal,
                        custoTotal: this.custoTotal,
                        equipamentos: JSON.stringify(this.equipamentos.filter(e => e.selected)),
                        tempoUso: JSON.stringify(this.tempoUso) 
                    }
                });
            }
        }, 1500); // Simulação de tempo de carregamento
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
        this.toastr.info('Todos os valores foram resetados.', 'Reset!');
    }
}
