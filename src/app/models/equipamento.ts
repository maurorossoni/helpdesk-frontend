// src/app/models/equipamento.ts

export interface Equipamento {
  id: number; // ou string, dependendo do tipo do ID
  nome: string;
  potencia: number; // Potência em Watts
  tipo: string; // Por exemplo: "geladeira", "ar condicionado", etc.
  essencial?: boolean; // Propriedade para marcar se é um equipamento essencial
  selected?: boolean; // Adicionando a propriedade para controle de seleção
}
