import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PowerbiComponent } from './powerbi/powerbi.component';
import { ForecastingComponent } from './forecasting/forecasting.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }