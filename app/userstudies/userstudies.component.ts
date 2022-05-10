import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserstudiesService } from './userstudies.service';
import { Router } from '@angular/router';
declare var $;
@Component({
  selector: 'app-userstudies',
  templateUrl: './userstudies.component.html',
  styleUrls: ['./userstudies.component.css']
})
export class UserstudiesComponent implements OnInit {
  userStudies :[];
  row_count:any;
    //sorting
  key: string = 'name'; //set default
  reverse: boolean = true;
  debugger
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
  //initializing p to one
  p: number = 1;
  constructor(private service:UserstudiesService,private toastr:ToastrService,private router: Router) { }
  ngOnInit() {
    this.GetUserStudies();    
  }
  GetUserStudies()
  {
    this.service.UserStudies().subscribe(
      res=>{
        debugger
        console.log(res);
        this.userStudies = res;//.sort((a,b) => 0 - (a > b ? -1 : 1));
      },
  err => {
    console.log(err);
  });
  }
  downloadUploadVideos(data)
  {debugger
    this.service.DownloadUploadedVideo(data).subscribe(
      res=>{
       this.toastr.success('Successfully','File Downloaded');
      },
      err=>{
        console.log(err);
      });
  }
  downloadMainProcess(data)
  {debugger
    this.service.DownloadMainProcessVideo(data).subscribe(
      res=>{
        this.toastr.success('Successfully','File Downloaded');
      },
      err=>{
        console.log(err);
      });
  }
  // onSearchChange(searchValue: string){ 
  //   debugger 
  //  // this.row_count =  $('#example').children().length;
  //   this.row_count= $("#tbody").find("tr").not("thead tr").length ;    
  //   console.log(this.row_count);
  // }

  //Create New Study
  CreateStudy()
  {
    this.router.navigate(['UploadVideo']);
  }
}
