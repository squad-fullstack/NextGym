import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ProfissionalValidators {
  static nomeCompleto(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = (control.value as string)?.trim() || '';
      if (!valor) return null;

      const regexApenasLetras = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
      if (!regexApenasLetras.test(valor)) {
        return { apenasLetras: true };
      }

      const partes = valor.split(/\s+/).filter((p: string) => p.length > 0);
      if (partes.length < 2 || partes[1].length < 2) {
        return { nomeIncompleto: true };
      }

      return null;
    };
  }

  static senhaForte(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = (control.value as string) || '';
      if (!valor) return null;

      const temMinimo = valor.length >= 6;
      const temNumero = /[0-9]/.test(valor);
      const temEspecial = /[\W_]/.test(valor); 

      const senhaValida = temMinimo && temNumero && temEspecial;

      if (!senhaValida) {
        return {
          senhaFraca: {
            temMinimo,
            temNumero,
            temEspecial
          }
        };
      }

      return null;
    };
  }

  static registroOuCref(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value?.trim() || '';
      if (!valor) return null;

      const regexCref = /^\d{5,6}-?[A-Z]\/[A-Z]{2}$/i;
      const regexRa = /^[A-Z0-9]{4,15}$/i;

      if (regexCref.test(valor) || regexRa.test(valor)) {
        return null;
      }

      return { registroInvalido: true };
    };
  }
}