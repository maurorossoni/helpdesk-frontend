import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-fatura',
    templateUrl: './fatura.component.html',
    styleUrls: ['./fatura.component.css']
})
export class FaturaComponent implements OnInit {
    consumoTotal: number = 0; // Total de consumo
    custoTotal: number = 0; // Custo total
    equipamentos: any[] = []; // Lista de equipamentos selecionados
    tempoUso: { [id: number]: number } = {}; // Dicionário para armazenar o tempo de uso
    valorKwh: number = 0.59290; // Valor do kWh
    metaConsumo: number = 0; // Meta de consumo definida pelo usuário

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        // Captura os parâmetros da query
        this.route.queryParams.subscribe(params => {
            this.consumoTotal = +params['consumoTotal'] || 0;
            this.custoTotal = +params['custoTotal'] || 0;
            this.equipamentos = JSON.parse(params['equipamentos']) || [];
            this.tempoUso = JSON.parse(params['tempoUso']) || {}; // Lendo o tempo de uso

            // Atribuir horas ao equipamento
            this.equipamentos.forEach(equipamento => {
                equipamento.horas = this.tempoUso[equipamento.id] || 0; // Usar tempo de uso correto
            });
        });
    }

    voltar(): void {
        window.history.back(); // Volta para a página anterior
    }

    // Métodos para calcular os valores arredondados
    calcularConsumoArredondado(potencia: number, horas: number): number {
        return Math.floor((potencia * (horas || 0)) / 1000); // Calcular em kWh
    }

    calcularCustoArredondado(potencia: number, horas: number, valorKwh: number = this.valorKwh): number {
        return Math.floor(this.calcularConsumoArredondado(potencia, horas) * valorKwh);
    }

    // Métodos para arredondar o consumo e custo totais
    arredondarConsumoTotal(): number {
        return Math.floor(this.consumoTotal);
    }

    arredondarCustoTotal(): number {
        return Math.floor(this.custoTotal);
    }

    // Método para definir a meta de consumo
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

    // Método para otimizar consumo
    otimizarComRedeNeural(): void {
        // Sua lógica de otimização aqui (simulando com um alert por enquanto)
        alert('Otimização concluída com base na meta de consumo definida.');
    }
}
