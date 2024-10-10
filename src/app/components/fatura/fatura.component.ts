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
    metaDefinida: boolean = false; // Controle para exibir o botão "Otimizar Consumo"

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

    // Métodos para calcular o consumo diário e mensal
    calcularConsumoDiario(potencia: number, horas: number): number {
        return (potencia * (horas || 0)) / 1000; // Consumo diário em kWh
    }

    calcularConsumoMensal(potencia: number, horas: number): number {
        const consumoDiario = this.calcularConsumoDiario(potencia, horas);
        return consumoDiario * 30; // Multiplicando por 30 para obter o consumo mensal
    }

    calcularCustoMensal(potencia: number, horas: number, valorKwh: number = this.valorKwh): number {
        const consumoMensal = this.calcularConsumoMensal(potencia, horas);
        return consumoMensal * valorKwh; // Custo mensal
    }

    arredondarConsumoTotalMensal(): string {
        let totalConsumoMensal = 0;
        this.equipamentos.forEach(equipamento => {
            totalConsumoMensal += this.calcularConsumoMensal(equipamento.potencia, this.tempoUso[equipamento.id]);
        });
        return totalConsumoMensal.toFixed(2); // Duas casas decimais
    }

    arredondarCustoTotalMensal(): string {
        let totalCustoMensal = 0;
        this.equipamentos.forEach(equipamento => {
            totalCustoMensal += this.calcularCustoMensal(equipamento.potencia, this.tempoUso[equipamento.id]);
        });
        return `R$ ${totalCustoMensal.toFixed(2)}`; // Duas casas decimais com R$
    }

    // Método para definir a meta de consumo
    definirMetaConsumo(): void {
        const inputMetaConsumo = prompt("Defina a meta de consumo ideal em kWh (mensal):");
        const metaValor = parseFloat(inputMetaConsumo || '');

        if (!isNaN(metaValor) && metaValor > 0) {
            this.metaConsumo = metaValor;
            this.metaDefinida = true; // Meta foi definida, habilitar o botão de otimização
            alert(`Meta de consumo definida para ${this.metaConsumo} kWh.`);
        } else {
            alert("Por favor, insira um valor válido para a meta de consumo.");
        }
    }

    // Método para otimizar o consumo
    otimizarComRedeNeural(): void {
        let totalConsumoMensal = parseFloat(this.arredondarConsumoTotalMensal());

        if (totalConsumoMensal > this.metaConsumo) {
            // Otimizar: Reduzir tempo de uso de aparelhos não essenciais
            let margem = totalConsumoMensal - this.metaConsumo;
            
            this.equipamentos.forEach(equipamento => {
                if (!equipamento.essencial && margem > 0) {
                    const horasAtuais = this.tempoUso[equipamento.id] || 0;
                    const consumoDiarioAtual = this.calcularConsumoDiario(equipamento.potencia, horasAtuais);
                    const consumoMensalAtual = consumoDiarioAtual * 30;

                    // Reduzir proporcionalmente o uso do equipamento
                    if (consumoMensalAtual > margem) {
                        const horasReduzidas = horasAtuais - (margem / equipamento.potencia * 1000);
                        this.tempoUso[equipamento.id] = Math.max(0, horasReduzidas); // Não pode ser negativo
                        margem -= consumoMensalAtual;
                    }
                }
            });

            alert('O consumo foi otimizado para atender à meta definida.');
        } else {
            alert('O consumo já está dentro da meta.');
        }
    }
}
