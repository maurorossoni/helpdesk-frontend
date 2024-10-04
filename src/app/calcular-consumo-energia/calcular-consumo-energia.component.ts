import { Component, OnInit } from '@angular/core';
import { EquipamentoService } from '../services/equipamento.service';
import { Equipamento } from '../models/equipamento';

@Component({
    selector: 'app-calcular-consumo-energia',
    templateUrl: './calcular-consumo-energia.component.html',
    styleUrls: ['./calcular-consumo-energia.component.css']
})
export class CalcularConsumoEnergiaComponent implements OnInit {
    consumoTotal: number = 0; // Resultado do consumo total em kWh
    custoTotal: number = 0; // Custo total em R$
    equipamentos: Equipamento[] = []; // Lista de equipamentos
    tempoUso: { [id: number]: number } = {}; // Dicionário para armazenar o tempo de uso de cada equipamento
    metaConsumo: number = 0; // Meta de consumo definida pelo usuário
    isLoading: boolean = true; // Estado de carregamento
    valorKwh: number = 0.59290; // Valor do kWh
    selectAll: boolean = false; // Estado para o checkbox "Selecionar Todos"
    showResults: boolean = false; // Adicione esta linha

    constructor(private equipamentoService: EquipamentoService) {}

    ngOnInit(): void {
        this.loadEquipamentos(); // Carregar os equipamentos ao iniciar o componente
    }

    loadEquipamentos(): void {
        this.isLoading = true;
        this.equipamentoService.findAll().subscribe((data: Equipamento[]) => {
            this.equipamentos = data;
            this.isLoading = false;
        }, error => {
            console.error('Erro ao carregar equipamentos:', error);
            this.isLoading = false;
        });
    }

    toggleSelectAll(event: Event): void {
        this.selectAll = (event.target as HTMLInputElement).checked;
        this.equipamentos.forEach(equipamento => {
            equipamento.selected = this.selectAll;
            if (!this.selectAll) {
                this.tempoUso[equipamento.id] = 0; // Resetar o tempo se "Selecionar Todos" for desmarcado
            }
        });
    }

    toggleEquipamentoSelection(equipamento: Equipamento): void {
        equipamento.selected = !equipamento.selected;
        if (!equipamento.selected) {
            this.tempoUso[equipamento.id] = 0; // Resetar o tempo se o equipamento for desmarcado
        }
    }

    temEquipamentoSelecionado(): boolean {
        return this.equipamentos.some(equipamento => equipamento.selected);
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
        this.showResults = true; // Define showResults como true quando o cálculo é feito
    }

    definirMetaConsumo(): void {
        const inputMetaConsumo = prompt("Defina a meta de consumo ideal em kWh:");
        const metaValor = parseFloat(inputMetaConsumo || '');

        if (!isNaN(metaValor) && metaValor > 0) {
            this.metaConsumo = metaValor;
            alert(`Meta de consumo definida para ${this.metaConsumo} kWh`);
            this.otimizarConsumo();
        } else {
            alert("Por favor, insira um valor válido para a meta de consumo.");
        }
    }

    otimizarConsumo(): void {
        if (this.metaConsumo && this.consumoTotal > this.metaConsumo) {
            let reducaoTotal = this.consumoTotal - this.metaConsumo;

            for (const equipamento of this.equipamentos) {
                if (!this.isEssencial(equipamento) && equipamento.selected) {
                    let tempoAtual = this.tempoUso[equipamento.id] || 0;
                    let reducao = Math.min(reducaoTotal / this.equipamentos.length, tempoAtual);
                    
                    this.tempoUso[equipamento.id] -= reducao;
                    reducaoTotal -= reducao;

                    if (reducaoTotal <= 0) break;
                }
            }
            this.calcularConsumo();
        }
    }

    isEssencial(equipamento: Equipamento): boolean {
        return equipamento.essencial || false; // Verifica se o equipamento é essencial
    }

    // Método para resetar os valores
    resetarValores(): void {
        this.consumoTotal = 0;
        this.custoTotal = 0;
        this.metaConsumo = 0;
        this.tempoUso = {};
        this.selectAll = false; // Resetar a seleção de todos
        this.equipamentos.forEach(equipamento => {
            equipamento.selected = false; // Desmarcar todos os equipamentos
        });
        this.showResults = false; // Resetar a exibição de resultados
        alert("Todos os valores foram resetados.");
    }
}
