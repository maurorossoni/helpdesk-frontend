import { Component, OnInit } from '@angular/core';
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../models/equipamento';

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
            this.otimizarComRedeNeural(); // Chama a otimização após definir a meta
        } else {
            alert("Por favor, insira um valor válido para a meta de consumo.");
        }
    }

    otimizarComRedeNeural(): void {
        let potenciaTotalReduzivel = 0; 
        let potenciaTotalEssencial = 0; 
        let tempoIdeal: { [id: number]: number } = {}; 

        let tempoTotalDisponivel = this.metaConsumo / this.valorKwh;

        for (const equipamento of this.equipamentos) {
            if (this.isEssencial(equipamento)) {
                potenciaTotalEssencial += equipamento.potencia;
                tempoIdeal[equipamento.id] = this.tempoUso[equipamento.id] || 0; 
            } else {
                potenciaTotalReduzivel += equipamento.potencia;
            }
        }

        const tempoMinimoChuveiro = 1; 
        const totalChuveiros = this.equipamentos.filter(e => e.tipo === 'chuveiro').length;

        if (totalChuveiros > 0) {
            tempoTotalDisponivel -= totalChuveiros * tempoMinimoChuveiro;
        }

        for (const equipamento of this.equipamentos) {
            if (!this.isEssencial(equipamento)) {
                tempoIdeal[equipamento.id] = (equipamento.potencia / potenciaTotalReduzivel) * tempoTotalDisponivel;
            }
        }

        for (const equipamento of this.equipamentos) {
            if (equipamento.tipo === 'chuveiro' && tempoIdeal[equipamento.id] < tempoMinimoChuveiro) {
                tempoIdeal[equipamento.id] = tempoMinimoChuveiro;
            }
        }

        for (const equipamento of this.equipamentos) {
            if (this.isEssencial(equipamento)) {
                this.tempoUso[equipamento.id] = tempoIdeal[equipamento.id];
            } else {
                this.tempoUso[equipamento.id] = tempoIdeal[equipamento.id] || 0;
            }
        }

        alert('Otimização concluída com base na meta de consumo definida.');
        this.calcularConsumo(); 
    }

    isEssencial(equipamento: Equipamento): boolean {
        return equipamento.essencial || false; 
    }

    resetarValores(): void {
        this.consumoTotal = 0;
        this.custoTotal = 0;
        this.metaConsumo = 0;
        this.tempoUso = {};
        this.selectAll = false; 
        this.equipamentos.forEach(equipamento => {
            equipamento.selected = false; 
        });
        this.showResults = false; 
        alert("Todos os valores foram resetados.");
    }
}
