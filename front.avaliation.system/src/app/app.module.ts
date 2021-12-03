import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
// import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { Ng5SliderModule } from 'ng5-slider';

//Pages
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

// Services
import { LoginService } from '../app/services/login.service';
import { ColaboratorService } from '../app/services/colaborator.service';
import { DashboardService } from '../app/services/dashboard.service';
import { PrintService } from '../app/services/print.service';
import { ResponsibilityService } from './services/responsibility.service';
import { DepartmentService } from '../app/services/department.service';
import { AreaService } from '../app/services/area.service';


//Route
import { Routing } from './app-routing.module';

//Mask
import { AuthGuard } from '../app/guards/auth-guard.service';


//Material
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';

//Components
import { FormtEvaluation } from './components/evaluation/evaluation';
import { PrintComponent } from './components/print/print.component';
import { LoadingComponent } from './components/loading/loading.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataControlComponent } from './components/data-control-collaborator/data-control.component';
import { CollaboratorComponent } from './components/data-crud/collaborator/collaborator.component';
import { DepartmentComponent } from './components/data-crud/department/department.component';
import { ResponsabilityComponent } from './components/data-crud/responsability/responsability.component';
import { AreaComponent } from './components/data-crud/area/area.component';
import { WeightComponent } from './components/data-crud/weight/weight.component';
import { DataControlWeightComponent } from './components/data-control-evaluative/data-control-evaluative.component';
import { PipesSearchComponent } from './components/pipes/pipes-search/pipes-search.component';
import { MatSelectSearchClearDirective } from './components/pipes/pipes-search/mat-select-search-clear.directive';
import { NoteComponent } from './components/data-crud/note/note.component';
import { AnimationNotFoundComponent } from './components/animation-not-found/animation-not-found.component';
import { AnimationBackgroundComponent } from './components/animation-background/animation-background.component';
import { QuestionCriterionComponent } from './components/data-crud/question/question.component';
import { RelationshipAreaResponsibilityComponent } from './components/data-crud/relationship-area-responsibility/relationship-area-responsibility.component';
import { RelationshipResponsibilityPermissionComponent } from './components/data-crud/relationship-responsibility-permission/relationship-responsibility-permission.component';
import { ScalesComponent } from './components/data-crud/scales/scales.component';
import { CriterionComponent } from './components/data-crud/criterion/criterion.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    FormtEvaluation,
    PrintComponent,
    LoadingComponent,
    HomePageComponent,
    DataControlComponent,
    CollaboratorComponent,
    DepartmentComponent,
    ResponsabilityComponent,
    AreaComponent,
    WeightComponent,
    DataControlWeightComponent,
    PipesSearchComponent,
    MatSelectSearchClearDirective,
    NoteComponent,
    AnimationNotFoundComponent,
    AnimationBackgroundComponent,
    QuestionCriterionComponent,
    RelationshipAreaResponsibilityComponent,
    RelationshipResponsibilityPermissionComponent,
    ScalesComponent,
    CriterionComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    Routing,
    BrowserAnimationsModule,

    MatProgressBarModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTableModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatStepperModule,
    MatExpansionModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [LoginService, AuthGuard, ColaboratorService, DashboardService, AreaService,DepartmentService,ResponsibilityService,PrintService, { provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
