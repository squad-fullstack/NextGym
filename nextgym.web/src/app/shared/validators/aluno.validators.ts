import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class AlunoValidators {
  static nomeCompleto(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value?.trim() || '';
      if (!valor) return null;

      const regexApenasLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
      if (!regexApenasLetras.test(valor)) {
        return { apenasLetras: true };
      }

      const partes = valor.split(/\s+/);
      if (partes.length < 2 || partes[1].length < 2) {
        return { nomeIncompleto: true };
      }

      return null;
    };
  }

  static telefoneValido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value?.trim();
      if (!valor) return null;

      const regex = /^(\(?\d{2}\)?\s?)?(\d{4,5}-?\d{4})$/;
      return regex.test(valor) ? null : { telefoneInvalido: true };
    };
  }

  static formatoPeso(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value?.toString().trim();
      if (!valor) return null;

      const regex = /^\d{1,3}([.,]\d{1,2})?$/;
      return regex.test(valor) ? null : { formatoPesoInvalido: true };
    };
  }

  static formatoAltura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value?.toString().trim();
      if (!valor) return null;

      const regex = /^(0|1|2)([.,]\d{1,2})?$/;
      return regex.test(valor) ? null : { formatoAlturaInvalido: true };
    };
  }
}