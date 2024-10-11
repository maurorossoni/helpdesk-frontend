import { Component, OnInit } from '@angular/core';
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../models/equipamento';

@Component({
  selector: 'app-cadastro-equipamento',
  templateUrl: './cadastro-equipamento.component.html',
  styleUrls: ['./cadastro-equipamento.component.css']
})
export class CadastroEquipamentoComponent implements OnInit {

  equipamentos: Equipamento[] = []; // Lista de equipamentos
  equipamento: Equipamento = {
    id: null,
    nome: '',
    potencia: null,
    tipo: '' // Tipo é opcional
  };
  editando: boolean = false; // Controla se estamos editando um equipamento
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(private equipamentoService: EquipamentoService) { }

  ngOnInit(): void {
    this.listarEquipamentos();
  }

  // Listar equipamentos
  listarEquipamentos(): void {
    this.equipamentoService.findAll().subscribe({
      next: (res) => {
        this.equipamentos = res;
      },
      error: (err) => {
        this.mensagemErro = 'Erro ao listar equipamentos.';
        console.error(err);
      }
    });
  }

  // Cadastrar novo equipamento ou editar
  cadastrarEquipamento(): void {
    if (this.equipamento.nome && this.equipamento.potencia) { // "tipo" não é mais obrigatório
      if (this.editando) {
        // Atualizando o equipamento
        this.equipamentoService.update(this.equipamento).subscribe({
          next: (res) => {
            this.mensagemSucesso = 'Equipamento atualizado com sucesso!';
            this.mensagemErro = '';
            this.listarEquipamentos(); // Recarrega a lista de equipamentos
            this.limparFormulario();
          },
          error: (err) => {
            this.mensagemErro = 'Erro ao atualizar equipamento.';
            this.mensagemSucesso = '';
            console.error(err);
          }
        });
      } else {
        // Criando novo equipamento
        this.equipamentoService.create(this.equipamento).subscribe({
          next: (res) => {
            this.mensagemSucesso = 'Equipamento cadastrado com sucesso!';
            this.mensagemErro = '';
            this.listarEquipamentos();
            this.limparFormulario();
          },
          error: (err) => {
            this.mensagemErro = 'Erro ao cadastrar equipamento.';
            this.mensagemSucesso = '';
            console.error(err);
          }
        });
      }
    } else {
      this.mensagemErro = 'Preencha os campos obrigatórios: Nome e Potência!';
      this.mensagemSucesso = '';
    }
  }

  // Editar equipamento
  editarEquipamento(equip: Equipamento): void {
    this.equipamento = { ...equip }; // Clonar o equipamento para edição
    this.editando = true;
  }

  // Excluir equipamento
  excluirEquipamento(id: number): void {
    this.equipamentoService.delete(id).subscribe({
      next: (res) => {
        this.mensagemSucesso = 'Equipamento excluído com sucesso!';
        this.mensagemErro = '';
        this.listarEquipamentos();
      },
      error: (err) => {
        this.mensagemErro = 'Erro ao excluir equipamento.';
        console.error(err);
      }
    });
  }

  // Limpar o formulário após salvar ou cancelar edição
  limparFormulario(): void {
    this.equipamento = {
      id: null,
      nome: '',
      potencia: null,
      tipo: '' // Tipo ainda é opcional no formulário
    };
    this.editando = false;
  }
}
