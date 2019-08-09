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
  MatDialogModule,
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
  MatDialogModule
];

@NgModule({
  imports:  [material],
  exports:  [material]
})
export class MaterialModule { }
