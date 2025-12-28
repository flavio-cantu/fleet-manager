import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavComponent } from './components/nav/nav.component';
import { ClientTableComponent } from './components/table/client-side/app-client-table.component';
import { InputFieldComponent } from './components/input/app-input.component';
import { FormularyContainerComponent } from './components/forms/formulary/app-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSelectComponent } from './components/input/app-select.component';
import { SearchContainerComponent } from './components/forms/search/app-search.component';
import { ServerTableComponent } from './components/table/server-side/app-server-table.component';
import { ToastComponent } from './components/toast/toast.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { CpfCnpjMaskPipe } from './directive/cpf-cnpj.directive';
import { DecimalMaskPipe, PercentMaskPipe } from './directive/mask.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    CpfCnpjMaskPipe,
    DecimalMaskPipe,
    PercentMaskPipe,
    MatSidenavModule,
    MatIconModule,

    NavComponent,
    ClientTableComponent,
    ServerTableComponent,
    InputFieldComponent,
    InputSelectComponent,
    FormularyContainerComponent,
    SearchContainerComponent,
    ToastComponent,
  ],
  providers: [],
  exports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatSidenavModule,
    MatIconModule,
    CpfCnpjMaskPipe,
    DecimalMaskPipe,
    PercentMaskPipe,

    NavComponent,
    ClientTableComponent,
    ServerTableComponent,
    InputFieldComponent,
    InputSelectComponent,
    FormularyContainerComponent,
    SearchContainerComponent,
    ToastComponent,
    NgSelectModule,
  ],
})
export class SharedModule {}
