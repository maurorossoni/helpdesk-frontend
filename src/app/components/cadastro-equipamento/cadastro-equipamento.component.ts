import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog
import { EquipamentoService } from '../../services/equipamento.service';
import { Equipamento } from '../../models/equipamento';
import { DialogConfirmacaoComponent } from '../dialog-confirmacao/dialog-confirmacao.component'; // Importar o diálogo de confirmação

@Component({
  selector: 'app-cadastro-equipamento',
  templateUrl: './cadastro-equipamento.component.html',
  styleUrls: ['./cadastro-equipamento.component.css']
})
export class CadastroEquipamentoComponent implements OnInit {

  equipamentos: Equipamento[] = [];
  equipamento: Equipamento = {
    id: null,
    nome: '',
    potencia: null,
    tipo: ''
  };
  editando: boolean = false;
  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(private equipamentoService: EquipamentoService, public dialog: MatDialog) { } // Injetar MatDialog

  ngOnInit(): void {
    this.listarEquipamentos();
  }

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

  cadastrarEquipamento(): void {
    if (this.equipamento.nome && this.equipamento.potencia) {
      if (this.editando) {
        this.equipamentoService.update(this.equipamento).subscribe({
          next: (res) => {
            this.mensagemSucesso = 'Equipamento atualizado com sucesso!';
            this.mensagemErro = '';
            this.listarEquipamentos();
            this.limparFormulario();
          },
          error: (err) => {
            this.mensagemErro = 'Erro ao atualizar equipamento.';
            this.mensagemSucesso = '';
            console.error(err);
          }
        });
      } else {
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

  editarEquipamento(equip: Equipamento): void {
    this.equipamento = { ...equip };
    this.editando = true;
  }

  excluirEquipamento(id: number): void {
    const dialogRef = this.dialog.open(DialogConfirmacaoComponent); // Abrir o diálogo de confirmação

    dialogRef.afterClosed().subscribe(result => {
      if (result) { // Se o usuário confirmou a exclusão
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
    });
  }

  limparFormulario(): void {
    this.equipamento = {
      id: null,
      nome: '',
      potencia: null,
      tipo: ''
    };
    this.editando = false;
  }
}
