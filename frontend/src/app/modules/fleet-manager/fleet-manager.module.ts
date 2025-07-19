import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SpaceshipService } from './services/spaceship.service';


@NgModule({
    declarations: [],
    imports: [SharedModule],
    providers: [SpaceshipService],
    exports: [SharedModule]
})
export class ManagerModule { }
