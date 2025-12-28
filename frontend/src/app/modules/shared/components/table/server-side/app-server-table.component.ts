import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslatorService } from '../../../../../services/translator.service';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { GridOptions, ColDef, themeQuartz, GridApi } from 'ag-grid-community';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ServerActionsRendererComponent } from './action.component';
import { ModalService } from '../../modal/modal.service';
import { ToastService } from '../../../../../services/toast.service';
import { MaskUtil } from '../../../directive/mask.uti';
import { ServerInputCheckRendererComponent } from './check/server.input.check.component';
import { MobileService } from '../../../../../services/mobile.service';

@Component({
  selector: 'app-server-table',
  standalone: true,
  imports: [CommonModule, AgGridAngular, MatPaginator, TranslateModule],
  providers: [],
  templateUrl: './app-server-table.component.html',
})
export class ServerTableComponent implements OnInit {
  public readonly pageSizeOptions = [100, 300, 500];
  public readonly themeQuartz = themeQuartz;
  public readonly sizePerAction = 60;

  @Input() id!: string;
  @Input() loading: boolean = false;
  @Input() errorMessage: string = '';
  @Input() columnsProperties: TableProperty[] = [];
  @Input() actions?: ActionsProperty[];
  @Input() actionsFirst: boolean = false;
  @Input() list: any[] = [];
  @Input() labelNoRecords: string = 'NO_RECORDS';
  @Input() qntRecords: number = 0;
  @Input() actionsToShow?: number;

  @Output() onSort = new EventEmitter<SortEvent>();
  @Output() onPage = new EventEmitter<PageEvent>();
  @Output() onExport = new EventEmitter();

  transformedColumns!: ColDef[];

  pageSize: number = this.pageSizeOptions[0];
  pageParameter?: PageEvent = {
    pageIndex: 0,
    pageSize: this.pageSizeOptions[0],
  };
  sortParameter?: SortEvent;

  private gridApi!: GridApi;
  gridOptions: GridOptions = {
    enableCellTextSelection: true,
    suppressDragLeaveHidesColumns: true,
    autoSizeStrategy: { type: 'fitGridWidth', defaultMinWidth: 200 },
    onSortChanged: (x) => {
      this.onSortChange({
        direction: x.columns![0].getSort(),
        property: x.columns![0].getColId(),
      });
    },
    onGridReady: (params) => {
      this.gridApi = params.api;
    },
  };

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private translator: TranslatorService,
    private modalService: ModalService,
    private toastService: ToastService,
    private mobileService: MobileService
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
    this.onPage.emit(this.pageParameter);
  }

  exportXlsx() {
    const headers = this.columnsProperties.reduce(
      (acc, column) => ({
        ...acc,
        [column.field]: this.translator.translate(column.name),
      }),
      {} as Record<string, string>
    );

    this.onExport.emit(headers);
  }

  onSortChange(sortEvent: SortEvent) {
    if (
      !this.sortParameter ||
      this.sortParameter.direction !== sortEvent.direction ||
      this.sortParameter?.property !== sortEvent.property
    ) {
      this.sortParameter = sortEvent;
      this.onSort.emit(sortEvent);
    }
  }

  onPageChange(event: any) {
    const pageEvent: PageEvent = {
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    };
    if (
      !this.pageParameter ||
      this.pageParameter.pageIndex !== pageEvent.pageIndex ||
      this.pageParameter?.pageSize !== pageEvent.pageSize
    ) {
      this.pageParameter = pageEvent;
      this.onPage.emit(pageEvent);
    }
  }

  setSortPage(sort: SortEvent, page: PageEvent) {
    this.sortParameter = sort;
    this.pageParameter = page;
    this.pageSize = page.pageSize;
  }

  setColumnDefs(columns: TableProperty[]) {
    this.columnsProperties = columns;
    this.transformedColumns = this.convertTableColumns();
  }

  convertTableColumns(): ColDef[] {
    const storage = localStorage.getItem(this.id);
    const config: ColDef[] = storage ? JSON.parse(storage) : [];
    const columns: ColDef[] = this.columnsProperties.map((column, index) => {
      const savedConfig = config.find(
        (col) => col.colId === column.name || col.colId === column.field
      );

      if (column.inputType) {
        return this.inputCell(savedConfig, column);
      } else {
        return this.textCell(savedConfig, column);
      }
    });

    if (this.actions) {
      columns.push(this.convertActionColumns());
    }

    this.orderColumns(config, columns);

    return columns;
  }

  private textCell(
    savedConfig: ColDef<any, any> | undefined,
    column: TableProperty
  ) {
    const {
      name,
      width,
      sortable,
      formatter,
      customCellRenderer,
      ...columnWithoutName
    } = column;
    return {
      ...columnWithoutName,
      headerName: this.translator.translate(name),
      sortable: sortable === undefined ? true : sortable,
      minWidth: width,
      width: width,
      valueFormatter: (params: any) => MaskUtil.parseMask(params, formatter),
      ...savedConfig,
      cellRenderer: customCellRenderer,
    };
  }

  private inputCell(
    savedConfig: ColDef<any, any> | undefined,
    column: TableProperty
  ): any {
    const { name, width, inputType, placeholder, ...columnWithoutName } =
      column;
    let cellRenderer;
    if (inputType === 'check') {
      cellRenderer = ServerInputCheckRendererComponent;
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
      },
      cellClass: 'input-cell',
      autoHeight: true,
      cellStyle: {
        alignItems: 'center',
      },
    };
  }

  private convertActionColumns(): any {
    let width;
    if (this.actionsToShow) {
      if (this.mobileService.isMobile) {
        this.actionsToShow = 2;
      }
      width = this.sizePerAction * this.actionsToShow;
    }
    return {
      headerName: 'Ações',
      field: 'actions',
      minWidth: width,
      width: width,
      maxWidth: width,
      sortable: false,
      filter: false,
      resizable: false,
      autoHeight: true,
      suppressMovable: true,
      suppressSizeToFit: true,
      lockPosition: this.actionsFirst ? 'left' : 'right',
      pinned: this.actionsFirst ? 'left' : 'right',
      lockPinned: true, // Impide que a coluna seja movida para fora da área pinada
      lockVisible: true,
      cellRenderer: ServerActionsRendererComponent,
      cellRendererParams: {
        actions: this.actions,
      },
      headerClass: 'actions-header',
      cellClass: this.actionsFirst ? 'actions-cell-right' : 'actions-cell-left',
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
  sortable?: boolean;
  inputType?: string;
  placeholder?: string;
  formatter?: string;
  customCellRenderer?: any;
}

export interface ActionsProperty {
  callback: CallableFunction;
  icon: string;
  label: string;
  show?: CallableFunction;
}

export interface SortEvent {
  property: string;
  direction: string | undefined | null;
}

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
}
