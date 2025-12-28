import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { LoginService } from './services/login.service';

@NgModule({
  declarations: [],
  imports: [SharedModule],
  providers: [LoginService],
  exports: [SharedModule],
})
export class LoginModule {}
