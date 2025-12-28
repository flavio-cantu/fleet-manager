import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {
  _SortModule,
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  ModuleRegistry,
  RowAutoHeightModule,
  ValidationModule,
} from 'ag-grid-community';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ValidationModule,
  RowAutoHeightModule,
  CellStyleModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
]);
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
