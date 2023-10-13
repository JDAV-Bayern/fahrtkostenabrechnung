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

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PersonalInformationComponentComponent,
    ExpensesCollectionComponentComponent,
    SubmissionOverviewComponentComponent,
    AddExpenseModalComponent,
    ExpenseListRowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    DragulaModule,
    NoopAnimationsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
