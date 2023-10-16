import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommissionAgentCreateComponent } from './commission-agent-create/commission-agent-create.component';
import { CommissionAgentDetailComponent } from './commission-agent-detail/commission-agent-detail.component';
import { CommissionAgentEditComponent } from './commission-agent-edit/commission-agent-edit.component';
import { CommissionAgentComponent } from './commission-agent/commission-agent.component';
import { CommissionFlotravelCreateComponent } from './commission-flotravel-create/commission-flotravel-create.component';
import { CommissionFlotravelDetailComponent } from './commission-flotravel-detail/commission-flotravel-detail.component';
import { CommissionFlotravelEditComponent } from './commission-flotravel-edit/commission-flotravel-edit.component';
import { CommissionFlotravelComponent } from './commission-flotravel/commission-flotravel.component';
import { CommissionManagerComponent } from './commission-manager.component';

const routes: Routes = [
  {
    path: '', component: CommissionManagerComponent,
    children: [
      { path: '', redirectTo: 'agent', pathMatch: 'full' },
      { path: 'agent', component: CommissionAgentComponent },
      { path: 'agent/create', component: CommissionAgentCreateComponent },
      { path: 'agent/:commissionId', component: CommissionAgentDetailComponent },
      { path: 'agent/edit/:commissionId', component: CommissionAgentEditComponent },
      { path: 'flotravel', component: CommissionFlotravelComponent },
      { path: 'flotravel/create', component: CommissionFlotravelCreateComponent },
      { path: 'flotravel/:commissionId', component: CommissionFlotravelDetailComponent },
      { path: 'flotravel/edit/:commissionId', component: CommissionFlotravelEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommissionManagerRoutingModule { }
