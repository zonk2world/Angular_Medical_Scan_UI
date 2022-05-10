import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { UploadvideoComponent } from './uploadvideo/uploadvideo.component';
import { CropvideoComponent } from './cropvideo/cropvideo.component';
import { VideodownloadComponent } from './videodownload/videodownload.component';
import { CropimageComponent } from './cropimage/cropimage.component';
import { GuideFrameComponent } from './guide-frame/guide-frame.component';
import { CroppedVideoPreviewComponent } from './cropped-video-preview/cropped-video-preview.component';
import { DrawBoundariesComponent } from './draw-boundaries/draw-boundaries.component';
import { ApprovecroppedvideoComponent } from './approvecroppedvideo/approvecroppedvideo.component';
import { VideolistComponent } from './videolist/videolist.component';
import { VideodetailsComponent } from './videodetails/videodetails.component';
import { BoundarypreviewComponent } from './boundarypreview/boundarypreview.component';
import { AddBoundariesComponent } from './add-boundaries/add-boundaries.component';


const approute: Routes = [
  {
    path: '', component: AppComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: '', component: DashboardComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'cropvideo', component: CropvideoComponent },
      { path: 'uploadvideo', component: UploadvideoComponent },
      { path: 'videodownload', component: VideodownloadComponent },
      { path: 'cropimage', component: CropimageComponent },
      { path: 'guideframe', component: GuideFrameComponent },
      { path: 'croppedvideopreview', component: CroppedVideoPreviewComponent },
      { path: 'approvecroppedvideo', component: ApprovecroppedvideoComponent },
      { path: 'videoList', component: VideolistComponent },
      { path: 'videoDetails', component: VideodetailsComponent },
      { path: 'videoDetails', component: VideodetailsComponent },
      { path: 'drawboundaries', component: DrawBoundariesComponent },
      { path: 'boundarypreview', component: BoundarypreviewComponent },
      { path: 'addboundaries', component: AddBoundariesComponent },
    ]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(approute, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
