import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavComponent } from './components/nav/nav.component';
import { InputFieldComponent } from './components/input/app-input.component';
import { FormContainerComponent } from './components/form/app-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputSelectComponent } from './components/input/app-select.component';
import { ClientTableComponent } from './components/table/app-client-table.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveFormsModule,

        NavComponent,
        ClientTableComponent,
        InputFieldComponent,
        InputSelectComponent,
        FormContainerComponent,
        LanguageSwitcherComponent



    ],
    exports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        ReactiveFormsModule,

        NavComponent,
        ClientTableComponent,
        InputFieldComponent,
        InputSelectComponent,
        FormContainerComponent,
        LanguageSwitcherComponent


    ]
})
export class SharedModule { }