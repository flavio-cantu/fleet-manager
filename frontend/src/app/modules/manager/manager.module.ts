import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ExampleService } from './services/example.service';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  providers: [ExampleService],
  exports: [SharedModule],
})
export class ManagerModule {}
