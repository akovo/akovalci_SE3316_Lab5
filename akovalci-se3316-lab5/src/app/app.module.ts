import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AuthService } from './auth.service';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { HomeComponent } from './home/home.component';
import { NewCollectionComponent } from './new-collection/new-collection.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import { AddImageModalComponent } from './add-image-modal/add-image-modal.component';
import { ViewCollectionComponent } from './view-collection/view-collection.component';
import { PublicCollectionsComponent } from './public-collections/public-collections.component';


const appRoutes: Routes = [
 // { path: 'crisis-center', component: CrisisListComponent },
//  { path: 'hero/:id',      component: HeroDetailComponent },
  { path: '',
    component: LandingComponent
  },
  { path: 'home',
    component: HomeComponent
  },
  { path: 'new',
    component: NewCollectionComponent
  },
  { path: 'edit',
    component: EditCollectionComponent
  },
  { path: 'view',
    component: ViewCollectionComponent
  },
  { path: 'pub',
    component: PublicCollectionsComponent
  }
  
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LandingComponent,
    HomeComponent,
    NewCollectionComponent,
    EditCollectionComponent,
    AddImageModalComponent,
    ViewCollectionComponent,
    PublicCollectionsComponent,
  ],
  entryComponents: [
        AddImageModalComponent
  ],
  imports: [
    BrowserModule,
    BootstrapModalModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
