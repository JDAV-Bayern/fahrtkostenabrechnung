import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PersonalInformationComponent } from './travel-expenses/personal-information/personal-information.component';
import { ExpensesCollectionComponent } from './travel-expenses/expenses-collection/expenses-collection.component';
import { SubmissionOverviewComponent } from './travel-expenses/submission-overview/submission-overview.component';
import { AddExpenseModalComponent } from './travel-expenses/expenses-collection/add-expense-modal/add-expense-modal.component';
import { ExpenseListRowComponent } from './travel-expenses/expenses-collection/expense-list-row/expense-list-row.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PdfExpenseLineItemComponent } from './travel-expenses/submission-overview/pdf-expense-line-item/pdf-expense-line-item.component';
import { PdfViewComponent } from './travel-expenses/submission-overview/pdf-view/pdf-view.component';
import { DataProtectionComponent } from './info/data-protection/data-protection.component';
import { ProgressIndicatorComponent } from './travel-expenses/submission-overview/progress-indicator/progress-indicator.component';
import { LogoComponent } from './icons/logo/logo.component';
import { InstagramIconComponent } from './icons/instagram-icon/instagram-icon.component';
import { GithubIconComponent } from './icons/github-icon/github-icon.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { InfoComponent } from './info/info.component';
import { ChevronRightIconComponent } from './icons/chevron-right-icon/chevron-right-icon.component';
import { TravelExpensesComponent } from './travel-expenses/travel-expenses.component';
import { ExpenseListComponent } from './travel-expenses/expenses-collection/expense-list/expense-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FinishedDialogComponent } from './travel-expenses/submission-overview/finished-dialog/finished-dialog.component';

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
    PdfExpenseLineItemComponent,
    PdfViewComponent,
    DataProtectionComponent,
    ProgressIndicatorComponent,
    LogoComponent,
    InstagramIconComponent,
    GithubIconComponent,
    BreadcrumbsComponent,
    InfoComponent,
    ChevronRightIconComponent,
    TravelExpensesComponent,
    ExpenseListComponent,
    FinishedDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDialogModule,
    NgxFileDropModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    NgSelectModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/fahrtkostenabrechnung/' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
