import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragulaModule } from 'ng2-dragula';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PersonalInformationComponent } from './travel-expenses/personal-information/personal-information.component';
import { ExpensesCollectionComponent } from './travel-expenses/expenses-collection/expenses-collection.component';
import { SubmissionOverviewComponent } from './travel-expenses/submission-overview/submission-overview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddExpenseModalComponent } from './travel-expenses/expenses-collection/add-expense-modal/add-expense-modal.component';
import { ExpenseListRowComponent } from './travel-expenses/expenses-collection/expense-list-row/expense-list-row.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { PlanExpenseFormComponent } from './travel-expenses/expenses-collection/add-expense-modal/plan-expense-form/plan-expense-form.component';
import { BikeExpenseFormComponent } from './travel-expenses/expenses-collection/add-expense-modal/bike-expense-form/bike-expense-form.component';
import { CarExpenseFormComponent } from './travel-expenses/expenses-collection/add-expense-modal/car-expense-form/car-expense-form.component';
import { TrainExpenseFormComponent } from './travel-expenses/expenses-collection/add-expense-modal/train-expense-form/train-expense-form.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PdfExpenseLineItemComponent } from './travel-expenses/submission-overview/pdf-expense-line-item/pdf-expense-line-item.component';
import { APP_BASE_HREF } from '@angular/common';
import { PdfViewComponent } from './travel-expenses/submission-overview/pdf-view/pdf-view.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { ProgressIndicatorComponent } from './travel-expenses/submission-overview/progress-indicator/progress-indicator.component';
import { ImprintComponent } from './info/imprint/imprint.component';
import { LogoComponent } from './icons/logo/logo.component';
import { InstagramIconComponent } from './icons/instagram-icon/instagram-icon.component';
import { GithubIconComponent } from './icons/github-icon/github-icon.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { InfoComponent } from './info/info.component';
import { ChevronRightIconComponent } from './icons/chevron-right-icon/chevron-right-icon.component';
import { TravelExpensesComponent } from './travel-expenses/travel-expenses.component';
import { ExpenseListComponent } from './travel-expenses/expenses-collection/expense-list/expense-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PersonalInformationComponent,
    ExpensesCollectionComponent,
    SubmissionOverviewComponent,
    AddExpenseModalComponent,
    ExpenseListRowComponent,
    PlanExpenseFormComponent,
    BikeExpenseFormComponent,
    CarExpenseFormComponent,
    TrainExpenseFormComponent,
    PdfExpenseLineItemComponent,
    PdfViewComponent,
    DataProtectionComponent,
    ProgressIndicatorComponent,
    ImprintComponent,
    LogoComponent,
    InstagramIconComponent,
    GithubIconComponent,
    BreadcrumbsComponent,
    InfoComponent,
    ChevronRightIconComponent,
    TravelExpensesComponent,
    ExpenseListComponent
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
  providers: [{ provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
