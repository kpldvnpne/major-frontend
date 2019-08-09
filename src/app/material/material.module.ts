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
  MatRadioModule,
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
  MatDialogModule,
  MatRadioModule
];

@NgModule({
  imports:  [material],
  exports:  [material]
})
export class MaterialModule { }
