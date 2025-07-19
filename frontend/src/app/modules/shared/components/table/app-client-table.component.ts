// input-field.component.ts
import { Component, Input, OnChanges, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatorService } from '../../../../services/translator.service';
import { NgxMaskDirective } from 'ngx-mask';
import { CpfCnpjMaskPipe } from '../../directive/cpf-cnpj.directive';


export interface TableProperty {
    name: string;
    field: string;
}

export interface ActionsProperty {
    callback: CallableFunction;
    icon: string;
    label: string;
}

@Component({
    selector: 'app-client-table',
    standalone: true,
    imports: [CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        TranslateModule,
        CpfCnpjMaskPipe
    ],
    providers: [],
    templateUrl: "./app-client-table.component.html"
})
export class ClientTableComponent implements OnChanges {
    @Input() id!: string;
    @Input() loading: boolean = false;
    @Input() errorMessage: string = '';
    @Input() columnsProperties: TableProperty[] = [];
    @Input() actions?: ActionsProperty[];
    @Input() list: any[] = [];
    @Input() labelNoRecords: string = 'NO_RECORDS';

    @Input() exportCsv: boolean = false;
    @Input() allowChangeTable: boolean = false;

    @Input() forceActions: boolean = false;
    @Input() customActionContent!: TemplateRef<any>;



    dataSource!: MatTableDataSource<any>;

    paginator!: MatPaginator;
    sort!: MatSort;

    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
        if (mp) {
            mp._intl = this.paginatorIntl;
        }
        this.paginator = mp;
        this.ngOnChanges();
    }

    @ViewChild(MatSort) set matSorter(ms: MatSort) {
        this.sort = ms;
        this.ngOnChanges();
    }

    constructor(private paginatorIntl: MatPaginatorIntl,
        translator: TranslatorService
    ) {
        this.paginatorIntl.itemsPerPageLabel = translator.translate('COMPONENT.TABLE.ITENS_PER_PAGE');
        this.paginatorIntl.nextPageLabel = translator.translate('COMPONENT.TABLE.NEXT_PAGE');
        this.paginatorIntl.previousPageLabel = translator.translate('COMPONENT.TABLE.PREV_PAGE');
        this.paginatorIntl.firstPageLabel = translator.translate('COMPONENT.TABLE.FIRST_PAGE');
        this.paginatorIntl.lastPageLabel = translator.translate('COMPONENT.TABLE.LAST_PAGE');

        this.dataSource = new MatTableDataSource();
    }

    ngOnChanges() {
        if (this.list) {
            this.dataSource.data = this.list;

            if (this.paginator) {
                this.dataSource.paginator = this.paginator;
            }
            if (this.sort) {
                this.dataSource.sort = this.sort;
            }
        }
    }

    get columnsField(): string[] {
        const columns = this.columnsProperties.map(property => property.field)
        if (this.actions || this.forceActions) {
            columns.push('actions');
        }
        return columns;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    isCpfCnpj(columnName: string): boolean {
        const column = columnName.toLowerCase()
        return column.indexOf('cpf') != -1 || column.indexOf('cnpj') != -1
    }

    cpfCnpjMask(value: string): string {
        const len = value.replace(/\D/g, '').length;
        return len > 11
            ? '00.000.000/0000-00'
            : '000.000.000-009';
    }

    exportCSV() {
        //TODO exporte a list para csv e dê para o usuário como download
        alert('Implemente-me!');
    }

    modalSettings() {
        //TODO Abrir modal com as propriedades pra ele fazer um check e ordenar, 
        // salvar isso no navegador e carregar qndo subir essa tela
        // para identificar, vamos usar o campo id do componente
        alert('Implemente-me!');
    }
}