import {
  PageEvent,
  SortEvent,
} from '../modules/shared/components/table/server-side/app-server-table.component';



export class ClientDetailResponse {
  constructor(
    public id: number,
    public businessName: string,
    public cnpj: string,
    public responsibleName: string,
    public responsibleCpf: string,
    public suframa: string,
    public fantasyName: string,
    public phone: string,
    public fax: string,
    public email: string,
  ) {}
}

export class CreateUpdateClientResponse {
  constructor(public id: number) {}
}

export class SearchClientRequest {
  constructor(
    public businessName: string,
    public cnpj: string,
    public uf: string,
    public municipality: string,
    public activeOnly: boolean
  ) {}
  public sort?: SortEvent;
  public page?: PageEvent;
}

export class ListClientResponse {
  constructor(
    public id: number,
    public businessName: string,
    public cnpj: string,
    public responsibleName: string,
    public responsibleCpf: string,
    public phone: string,
    public email: string
  ) {}
}

export class SaveAddress {
  public id?: number;

  constructor(
    public stateRegistration: string,
    public municipalRegistration: string,
    public cep: string,
    public address: string,
    public number: string,
    public complement: string,
    public neighborhood: string,
    public ufSpedCode: number,
    public municipalitySpedCode: string
  ) {}
}

export class SaveClient {
  constructor(
    public businessName: string,
    public cnpj: string,
    public responsibleName: string,
    public responsibleCpf: string,
    public suframa: string,
    public fantasyName: string,
    public phone: string,
    public fax: string,
    public email: string,
    public addresses: SaveAddress[],
    public unities: number[]
  ) {}
}
