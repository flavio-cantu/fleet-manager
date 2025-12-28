import { Component, OnInit, ViewChild } from '@angular/core';
import { ManagerModule } from '../../../manager.module';
import { TranslatorService } from '../../../../../services/translator.service';
import {
  ListClientResponse,
  SearchClientRequest,
} from '../../../../../models/example.model';
import {
  ActionsProperty,
  PageEvent,
  ServerTableComponent,
  SortEvent,
  TableProperty,
} from '../../../../shared/components/table/server-side/app-server-table.component';
import { Router } from '@angular/router';
import { ModalService } from '../../../../shared/components/modal/modal.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LoadModalComponent } from '../../../../shared/components/modal/loading/loagin.modal.component';
import { CsvExportService } from '../../../../../services/csv.service';
import { ExampleService } from '../../../services/example.service';

@Component({
  selector: 'page-list-example',
  standalone: true,
  imports: [ManagerModule],
  templateUrl: './list-example.page.html',
  styleUrls: ['./list-example.page.scss'],
})
export class ExampleListPage implements OnInit {
  qntRecords: number = 0;
  clients: ListClientResponse[] = [];
  tableLoading = true;
  listErrorMessage = '';
  deletedMessage: string | null = null;

  form: FormGroup;
  submitting = false;

  columns: TableProperty[] = [
    {
      name: 'EXAMPLE.LIST.BUSINESS_NAME',
      field: 'businessName',
      width: 200,
    },
    {
      name: 'EXAMPLE.LIST.CNPJ',
      field: 'cnpj',
    },
    {
      name: 'EXAMPLE.LIST.RESPONSABLE_NAME',
      field: 'responsibleName',
      width: 100,
    },
    {
      name: 'EXAMPLE.LIST.RESPONSABLE_CPF',
      field: 'responsibleCpf',
    },
    {
      name: 'EXAMPLE.LIST.PHONE',
      field: 'phone',
    },
    {
      name: 'EXAMPLE.LIST.EMAIL',
      field: 'email',
      width: 100,
    },
  ];

  actions: ActionsProperty[] = [
    {
      callback: (row: ListClientResponse) => {
        const title = this.translator.translate('EXAMPLE.DELETE.TITLE');
        let description = this.translator.translate(
          'EXAMPLE.DELETE.DESCRIPTION'
        );
        this.modalService.confirm(title, description).subscribe((result) => {
          if (result) {
            this.tableLoading = true;
            this.clientService.deleteClient(row.id).subscribe({
              next: (deleted) => {
                this.deletedMessage = this.translator.translate(
                  'EXAMPLE.DELETE.SUCCESS'
                );
                this.deletedMessage = this.deletedMessage!.replace(
                  '<NAME>',
                  row.businessName
                );
                if (deleted) {
                  this.deletedMessage = this.deletedMessage!.replace(
                    '<ACTION>',
                    this.translator.translate('EXAMPLE.DELETE.DELETED')
                  );
                } else {
                  this.deletedMessage = this.deletedMessage!.replace(
                    '<ACTION>',
                    this.translator.translate('EXAMPLE.DELETE.INACTIVATED')
                  );
                }

                this.search(true);
                this.update();

                setTimeout(() => {
                  this.deletedMessage = null;
                }, 10000);
              },
              error: (errorCode) => {
                this.listErrorMessage = this.translator.translate(errorCode);
                this.tableLoading = false;
              },
            });
          }
        });
      },
      icon: 'bi bi-trash3-fill',
      label: 'COMMON.DELETE',
    },
    {
      callback: (row: ListClientResponse) => {
        this.router.navigate(['/client', row.id]);
      },
      icon: 'bi bi-pencil-fill',
      label: 'COMMON.EDIT',
    },
  ];

  @ViewChild(ServerTableComponent) serverTable?: ServerTableComponent;

  sort?: SortEvent | null;
  page?: PageEvent | null;
  updateLoading?: MatDialogRef<LoadModalComponent, any>;

  constructor(
    private csvService: CsvExportService,
    private clientService: ExampleService,
    private translator: TranslatorService,
    private router: Router,
    private modalService: ModalService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      businessName: [''],
      cnpj: [''],
      municipality: [''],
      activeOnly: [true],
    });
  }

  ngOnInit(): void {
    this.tableLoading = true;
    this.search(true);
  }

  search(fromStart?: boolean) {
    this.listErrorMessage = '';
    this.tableLoading = true;
    const search = this.form.value as SearchClientRequest;
    this.clientService.countClients(search).subscribe({
      next: (qntRecords) => {
        this.qntRecords = qntRecords;
        if (!fromStart) {
          //No onInit, o update é chamado pelo evento de change page
          this.sort = { property: '', direction: '' };
          this.page = { pageIndex: 0, pageSize: this.page!.pageSize };
          this.serverTable!.setSortPage(this.sort, this.page);
          this.update();
        }
      },
      error: (errorCode) => {
        this.listErrorMessage = this.translator.translate(errorCode);
        this.tableLoading = false;
      },
      complete: () => {
        this.tableLoading = false;
      },
    });
  }

  //chamado pelo evento do componente server-table
  update() {
    const search = this.form.value as SearchClientRequest;
    search.sort = this.sort!;
    search.page = this.page!;
    this.clientService.getClients(search).subscribe({
      next: (clients) => {
        this.clients = clients;
        this.tableLoading = false;
        if (this.updateLoading) {
          this.updateLoading.close();
        }
      },
      error: (errorCode) => {
        if (this.updateLoading) {
          this.updateLoading.close();
        }
        this.listErrorMessage = this.translator.translate(errorCode);
        this.tableLoading = false;
      },
      complete: () => {
        this.tableLoading = false;
        if (this.updateLoading) {
          this.updateLoading.close();
        }
      },
    });
  }

  onCsvExport(headers: any) {
    const search = this.form.value as SearchClientRequest;
    search.sort = undefined;
    search.page = undefined;
    this.turnTableModalOn();
    this.clientService.getClients(search).subscribe({
      next: (clients) => {
        this.csvService.exportToCsv(clients, 'CONSULTA_CLIENTES', headers);
        this.updateLoading!.close();
      },
      error: (errorCode) => {
        this.listErrorMessage = this.translator.translate(errorCode);
        this.updateLoading!.close();
      },
      complete: () => {
        this.updateLoading!.close();
      },
    });
  }

  onSortChange(sort: any) {
    this.sort = sort;
    this.turnTableModalOn();
    this.update();
  }

  onPaginationChange(page: any) {
    this.page = page;
    this.turnTableModalOn();
    this.update();
  }

  private turnTableModalOn() {
    this.updateLoading = this.modalService.loading();
  }
}
