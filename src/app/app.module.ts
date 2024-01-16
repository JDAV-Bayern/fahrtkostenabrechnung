import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PersonalInformationComponentComponent } from './personal-information-component/personal-information-component.component';
import { ExpensesCollectionComponentComponent } from './expenses-collection-component/expenses-collection-component.component';
import { SubmissionOverviewComponentComponent } from './submission-overview-component/submission-overview-component.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddExpenseModalComponent } from './add-expense-modal/add-expense-modal.component';
import { ExpenseListRowComponent } from './expense-list-row/expense-list-row.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PlanExpenseFormComponent } from './add-expense-modal/plan-expense-form/plan-expense-form.component';
import { BikeExpenseFormComponent } from './add-expense-modal/bike-expense-form/bike-expense-form.component';
import { CarExpenseFormComponent } from './add-expense-modal/car-expense-form/car-expense-form.component';
import { TrainExpenseFormComponent } from './add-expense-modal/train-expense-form/train-expense-form.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PdfExpenseLineItemComponent } from './submission-overview-component/pdf-expense-line-item/pdf-expense-line-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PersonalInformationComponentComponent,
    ExpensesCollectionComponentComponent,
    SubmissionOverviewComponentComponent,
    AddExpenseModalComponent,
    ExpenseListRowComponent,
    PlanExpenseFormComponent,
    BikeExpenseFormComponent,
    CarExpenseFormComponent,
    TrainExpenseFormComponent,
    PdfExpenseLineItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DragulaModule.forRoot(),
    NoopAnimationsModule,
    MatDialogModule,
    NgxFileDropModule
  ],
  providers: [
    { provide: 'APP_BASE_HREF', useValue: '/fahrtkostenabrechnung' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
