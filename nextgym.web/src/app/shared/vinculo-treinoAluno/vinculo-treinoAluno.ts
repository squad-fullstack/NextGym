import {Component,ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';

export interface AlunoOption {
  id: number | string;
  nome: string;
}

export interface PlanoTreinoOption {
  id: number | string;
  titulo: string;
}

export interface VinculoPayload {
  idAluno: number | string;
  idPlano: number | string;
  dataInicio: string;
  dataPrevisaoFim: string;
  observacoes: string;
}

@Component({
  selector: 'app-vinculo-treinoAluno',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vinculo-treinoAluno.html',
  styleUrls: ['./vinculo-treinoAluno.scss']
})
export class VinculoTreinoComponent implements OnInit {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() alunos: AlunoOption[] = [];
  @Input() planos: PlanoTreinoOption[] = [];
  @Input() isSubmitting = false;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<VinculoPayload>();

  @ViewChild('modalContent') modalContent!: ElementRef<HTMLDivElement>;
  @ViewChild('primeiroCampo') primeiroCampo!: ElementRef<HTMLSelectElement>;

  formVinculo!: FormGroup;

  hoje: string = '';

  ngOnInit(): void {
    const dataAtual = new Date();
    const tzOffset = dataAtual.getTimezoneOffset() * 60000;
    this.hoje = new Date(dataAtual.getTime() - tzOffset).toISOString().split('T')[0];

    this.iniciarFormulario();
  }

  private iniciarFormulario(): void {
    this.formVinculo = this.fb.group(
      {
        idAluno: ['', [Validators.required]],
        idPlano: ['', [Validators.required]],
        dataInicio: ['', [Validators.required]],
        previsaoTermino: ['', [Validators.required]],
        observacoes: ['', [Validators.maxLength(500)]]
      },
      { validators: this.validarPeriodoDatas }
    );
  }

  private validarPeriodoDatas(control: AbstractControl): ValidationErrors | null {
    const inicio = control.get('dataInicio')?.value;
    const termino = control.get('previsaoTermino')?.value;

    if (inicio && termino && new Date(termino) < new Date(inicio)) {
      return { dataInvalida: true };
    }
    return null;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    if (this.isOpen && !this.isSubmitting) {
      this.fechar();
    }
  }

  fechar(): void {
    this.formVinculo.reset({
      idAluno: '',
      idPlanoTreino: '',
      dataInicio: '',
      previsaoTermino: '',
      observacoes: ''
    });
    this.close.emit();
  }

  onSubmit(): void {
    if (this.formVinculo.invalid || this.isSubmitting) {
      this.formVinculo.markAllAsTouched();
      return;
    }

    const formVal = this.formVinculo.value;
    const payload: VinculoPayload = {
      idAluno: formVal.idAluno,
      idPlano: formVal.idPlano,
      dataInicio: formVal.dataInicio,
      dataPrevisaoFim: formVal.previsaoTermino,
      observacoes: (formVal.observacoes || '').trim()
    };

    this.submitForm.emit(payload);
  }
}