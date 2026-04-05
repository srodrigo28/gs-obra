import { onlyDigits } from '@/utils/formatters';

export type CepAddress = {
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
};

export async function fetchAddressByCep(rawCep: string): Promise<CepAddress | null> {
  const cep = onlyDigits(rawCep);

  if (cep.length !== 8) {
    return null;
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();

  if (!response.ok || data.erro) {
    return null;
  }

  return {
    cep: data.cep,
    street: data.logradouro ?? '',
    district: data.bairro ?? '',
    city: data.localidade ?? '',
    state: data.uf ?? '',
  };
}
