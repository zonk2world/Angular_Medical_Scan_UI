import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UploadvideoComponent } from './uploadvideo/uploadvideo.component';
import { CropvideoComponent } from './cropvideo/cropvideo.component';
import { CropimageComponent } from './cropimage/cropimage.component'
import { DragScrollModule } from 'ngx-drag-scroll';
import { VideodownloadComponent } from './videodownload/videodownload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// videogular
// import { VgCoreModule } from 'videogular2/core';
// import { VgControlsModule } from 'videogular2/controls';
// import { VgOverlayPlayModule } from 'videogular2/overlay-play';
// import { VgBufferingModule } from 'videogular2/buffering';

import { GuideFrameComponent } from './guide-frame/guide-frame.component';
import { CroppedVideoPreviewComponent } from './cropped-video-preview/cropped-video-preview.component';
import { SanitizeHtmlPipe } from 'src/shared/sanitize-html-pipe';
import { DrawBoundariesComponent } from './draw-boundaries/draw-boundaries.component';
import { ApprovecroppedvideoComponent } from './approvecroppedvideo/approvecroppedvideo.component';
import { VideolistComponent } from './videolist/videolist.component';
import { VideodetailsComponent } from './videodetails/videodetails.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BoundarypreviewComponent } from './boundarypreview/boundarypreview.component';
import { AddBoundariesComponent } from './add-boundaries/add-boundaries.component';



@NgModule({
  declarations: [SanitizeHtmlPipe,
    AppComponent, VideodownloadComponent, CropimageComponent,
    LoginComponent, DashboardComponent, NavComponent, SidebarComponent, CropvideoComponent, UploadvideoComponent, GuideFrameComponent, CroppedVideoPreviewComponent, DrawBoundariesComponent, ApprovecroppedvideoComponent, VideolistComponent, VideodetailsComponent, BoundarypreviewComponent, AddBoundariesComponent
  ],
  imports: [
    BrowserModule,NgxDatatableModule,
    AppRoutingModule, BrowserAnimationsModule, 

    FormsModule, ReactiveFormsModule, HttpClientModule, DragScrollModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
