// multi-actions-renderer.component.ts
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ActionsProperty } from './app-server-table.component';
import { MobileService } from '../../../../../services/mobile.service';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-server-actions-renderer',
  imports: [TranslateModule, MatMenu, MatMenuTrigger],
  templateUrl: './action.component.html',
})
export class ServerActionsRendererComponent
  implements ICellRendererAngularComp
{
  public params!: ICellRendererParams & { actions?: ActionsProperty[] };
  public actions: ActionsProperty[] = [];

  constructor(private mobileService: MobileService) {}

  get isMobile() {
    return this.mobileService.isMobile;
  }

  agInit(params: ICellRendererParams & { actions?: ActionsProperty[] }): void {
    this.params = params;
    this.actions = params.actions || [];
  }

  refresh(
    params: ICellRendererParams & { actions?: ActionsProperty[] }
  ): boolean {
    this.params = params;
    this.actions = params.actions || [];
    return true;
  }

  shouldShowAction(action: ActionsProperty): boolean {
    if (action.show) {
      return action.show(this.params.data);
    }
    return true;
  }

  handleAction(action: ActionsProperty, event: MouseEvent): void {
    event.stopPropagation();
    try {
      action.callback(this.params.data);
    } catch (error) {
      console.error('Erro ao executar ação:', error);
      alert('Erro ao executar ação');
    }
  }
}
