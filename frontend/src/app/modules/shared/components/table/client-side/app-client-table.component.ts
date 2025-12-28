import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { TranslatorService } from '../../../../../services/translator.service';
import { GridOptions, ColDef, themeQuartz, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { ClientActionsRendererComponent } from './client.action.component';
import { ModalService } from '../../modal/modal.service';
import { ToastService } from '../../../../../services/toast.service';
import { MaskUtil } from '../../../directive/mask.uti';
import { ClientInputRendererComponent } from './input/client.input.component';
import { ClientSelectRendererComponent } from './select/client.select.component';
import { ClientInputCheckRendererComponent } from './check/server.input.check.component';
import { CsvExportService } from '../../../../../services/csv.service';

@Component({
  selector: 'app-client-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MatPaginator, TranslateModule],
  providers: [],
  templateUrl: './app-client-table.component.html',
})
export class ClientTableComponent implements OnInit {
  public readonly pageSizeOptions = [20, 30, 50];
  public readonly themeQuartz = themeQuartz;

  @Input() id!: string;
  @Input() loading: boolean = false;
  @Input() errorMessage: string = '';
  @Input() columnsProperties: TableProperty[] = [];
  @Input() actions?: ActionsProperty[];
  @Input() actionsFirst: boolean = false;
  @Input() actionsWidth: number = 100;
  @Input() list: any[] = [];
  @Input() labelNoRecords: string = 'NO_RECORDS';

  pagedData: any[] = [];
  pageSize = this.pageSizeOptions[0];
  pageIndex = 0;

  transformedColumns!: ColDef[];
  private gridApi!: GridApi;

  gridOptions: GridOptions = {
    enableCellTextSelection: true,
    suppressAutoSize: false,
    suppressDragLeaveHidesColumns: true,
    autoSizeStrategy: { type: 'fitGridWidth', defaultMinWidth: 200 },
    onGridReady: (params) => {
      this.gridApi = params.api;
      this.updatePagedData();
    },
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private csvService: CsvExportService,
    private paginatorIntl: MatPaginatorIntl,
    private translator: TranslatorService,
    private modalService: ModalService,
    private toastService: ToastService
  ) {
    this.paginatorIntl.itemsPerPageLabel = translator.translate(
      'COMPONENT.TABLE.ITENS_PER_PAGE'
    );
    this.paginatorIntl.nextPageLabel = translator.translate(
      'COMPONENT.TABLE.NEXT_PAGE'
    );
    this.paginatorIntl.previousPageLabel = translator.translate(
      'COMPONENT.TABLE.PREV_PAGE'
    );
    this.paginatorIntl.firstPageLabel = translator.translate(
      'COMPONENT.TABLE.FIRST_PAGE'
    );
    this.paginatorIntl.lastPageLabel = translator.translate(
      'COMPONENT.TABLE.LAST_PAGE'
    );
  }

  ngOnInit(): void {
    this.transformedColumns = this.convertTableColumns();
    this.updatePagedData();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePagedData();
  }

  onSortChanged(event: any) {
    if (event.type === 'sortChanged') {
      const colId = event.columns[0].colId;
      const sort = event.columns[0].sort;
      this.list = [...this.list].sort((a, b) => {
        const valueA = a[colId];
        const valueB = b[colId];
        return (valueA < valueB ? -1 : 1) * (sort === 'asc' ? 1 : -1);
      });
    }
    this.updatePagedData();
  }
  //Método precisa ser público pra atualizar os dados da página
  public updatePagedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedData = this.list.slice(startIndex, endIndex);
  }

  exportXlsx() {
    const headers = this.columnsProperties.reduce(
      (acc, column) => ({
        ...acc,
        [column.field]: this.translator.translate(column.name),
      }),
      {} as Record<string, string>
    );
    this.csvService.exportToCsv(this.list, this.id, headers);
  }

  convertTableColumns(): ColDef[] {
    const storage = localStorage.getItem(this.id);
    const config: ColDef[] = storage ? JSON.parse(storage) : [];

    const columns: ColDef[] = this.columnsProperties.map((column, index) => {
      const savedConfig = config.find((col) => col.colId === column.name);

      if (column.inputType) {
        return this.inputCell(savedConfig, column);
      } else {
        return this.textCell(savedConfig, column);
      }
    });

    if (this.actions) columns.push(this.convertActionColumns());

    this.orderColumns(config, columns);

    return columns;
  }

  private textCell(
    savedConfig: ColDef<any, any> | undefined,
    column: TableProperty
  ): any {
    let { name, width, ...columnWithoutName } = column;
    return {
      ...columnWithoutName,
      headerName: this.translator.translate(name),
      sortable: true,
      minWidth: width,
      valueFormatter: (params: any) => MaskUtil.parseMask(params),
      ...savedConfig,
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
      },
    };
  }

  private inputCell(
    savedConfig: ColDef<any, any> | undefined,
    column: TableProperty
  ): any {
    const {
      name,
      width,
      inputType,
      placeholder,
      label,
      value,
      ...columnWithoutName
    } = column;
    let cellRenderer;
    if (inputType === 'input') {
      cellRenderer = ClientInputRendererComponent;
    } else if (inputType === 'select') {
      cellRenderer = ClientSelectRendererComponent;
    } else if (inputType === 'check') {
      cellRenderer = ClientInputCheckRendererComponent;
    } else {
      console.error('Input type not implemented!');
    }

    return {
      ...columnWithoutName,
      headerName: this.translator.translate(name),
      ...savedConfig,
      minWidth: width,
      width: width,
      maxWidth: width,
      sortable: false,
      filter: false,
      resizable: false,
      cellRenderer: cellRenderer,
      cellRendererParams: {
        placeholder: placeholder,
        label: label,
        value: value,
      },
      cellClass: 'input-cell',
      autoHeight: true,
      cellStyle: {
        alignItems: 'center',
      },
    };
  }

  private convertActionColumns(): any {
    return {
      headerName: 'Ações',
      field: 'actions',
      sortable: false,
      filter: false,
      resizable: false,
      autoHeight: true,
      suppressMovable: true,
      maxWidth: this.actionsWidth,
      width: this.actionsWidth,
      minWidth: this.actionsWidth,
      lockPosition: this.actionsFirst ? 'left' : 'right',
      pinned: this.actionsFirst ? 'left' : 'right',
      lockPinned: true, // Impide que a coluna seja movida para fora da área pinada
      lockVisible: true,
      cellRenderer: ClientActionsRendererComponent,
      cellRendererParams: {
        actions: this.actions,
      },
      headerClass: 'actions-header',
      cellClass: this.actionsFirst ? 'actions-cell-right' : 'actions-cell-left',
      cellStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    };
  }

  modalSettings() {
    const modal = this.modalService.withOptions({
      title: this.translator.translate('COMPONENT.TABLE.CONFIG.TITLE'),
      content: this.translator.translate('COMPONENT.TABLE.CONFIG.MESSAGE'),
      actions: [
        {
          text: this.translator.translate('COMPONENT.TABLE.CONFIG.SAVE'),
          css: 'btn-primary',
          handler: (dialogRef) => {
            const state = this.gridApi.getColumnState();
            localStorage.setItem(this.id, JSON.stringify(state));
            dialogRef.close();
            this.toastService.pushInfo('COMPONENT.TABLE.CONFIG.SAVE_SUCCESS');
          },
        },
        {
          text: this.translator.translate('COMPONENT.TABLE.CONFIG.CLEAR'),
          css: 'btn-outline-primary',
          handler: (dialogRef) => {
            localStorage.setItem(this.id, '');
            dialogRef.close();
            this.toastService.pushInfo('COMPONENT.TABLE.CONFIG.CLEAR_SUCCESS');
          },
        },
        {
          text: this.translator.translate('COMPONENT.TABLE.CONFIG.CLOSE'),
          css: 'btn-danger',
          handler: (dialogRef) => {
            dialogRef.close();
          },
        },
      ],
      config: { disableClose: false },
    });
  }

  private orderColumns(savedConfig: ColDef[], currentColumns: ColDef[]): void {
    if (!savedConfig.length) return;

    const orderMap = new Map<string, number>();
    savedConfig.forEach((col, index) => {
      const key = col.colId || col.field;
      if (key) {
        orderMap.set(key, index);
      }
    });

    currentColumns.sort((a, b) => {
      const keyA = a.colId || a.field;
      const keyB = b.colId || b.field;

      if (keyA && keyB && orderMap.has(keyA) && orderMap.has(keyB)) {
        return orderMap.get(keyA)! - orderMap.get(keyB)!;
      }

      if (keyA && orderMap.has(keyA)) return -1;
      if (keyB && orderMap.has(keyB)) return 1;
      return 0;
    });
  }
}

export interface TableProperty extends ColDef {
  name: string;
  field: string;
  width?: number;

  inputType?: string;
  placeholder?: string;
  label?: string;
  value?: string;
}

export interface ActionsProperty {
  callback: CallableFunction;
  icon: string;
  label: string;
  show?: CallableFunction; //expected a boolean as return
}
