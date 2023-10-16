import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/share.module';
import { COMPONENTS } from './components';
import { CommissionManagerRoutingModule } from './commission-manager-routing.module';
import { CommissionFlotravelComponent } from './commission-flotravel/commission-flotravel.component';
import { CommissionAgentComponent } from './commission-agent/commission-agent.component';
import { CommissionManagerComponent } from './commission-manager.component';
import { CommissionFlotravelDetailComponent } from './commission-flotravel-detail/commission-flotravel-detail.component';
import { CommissionFlotravelCreateComponent } from './commission-flotravel-create/commission-flotravel-create.component';
import { CommissionFlotravelEditComponent } from './commission-flotravel-edit/commission-flotravel-edit.component';
import { CommissionAgentDetailComponent } from './commission-agent-detail/commission-agent-detail.component';
import { CommissionAgentCreateComponent } from './commission-agent-create/commission-agent-create.component';
import { CommissionAgentEditComponent } from './commission-agent-edit/commission-agent-edit.component';

@NgModule({
  declarations: [
    ...COMPONENTS,
    CommissionFlotravelComponent,
    CommissionAgentComponent,
    CommissionManagerComponent,
    CommissionFlotravelDetailComponent,
    CommissionFlotravelCreateComponent,
    CommissionFlotravelEditComponent,
    CommissionAgentDetailComponent,
    CommissionAgentCreateComponent,
    CommissionAgentEditComponent
  ],
  imports: [
    CommonModule,
    CommissionManagerRoutingModule,
    SharedModule
  ],
})
export class CommissionManagerModule {}
