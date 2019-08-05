import { NgModule } from '@angular/core';
import { 
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule, 
  MatIconModule, 
  MatListModule, 
  MatTableModule, 
  MatPaginatorModule, 
  MatSortModule,
  MatSelectModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSliderModule,
} from '@angular/material';

const material = [
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule, 
  MatIconModule, 
  MatListModule, 
  MatTableModule, 
  MatPaginatorModule, 
  MatSortModule,
  MatSelectModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSliderModule,
];

@NgModule({
  imports:  [material],
  exports:  [material]
})
export class MaterialModule { }
