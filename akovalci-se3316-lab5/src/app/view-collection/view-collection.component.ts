import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.css']
})
export class ViewCollectionComponent implements OnInit {
  collection;
  images;
  constructor(private auth:AuthService, private router:Router,private route: ActivatedRoute) { 
      var tt = this;
      
     this.route.params.subscribe(params => {
        tt.images = params.images.split(',');
        if(tt.images[0]==""){
          tt.images.splice(0,1);
        }
        tt.collection = params;
        if(params.priv=="true" && params.owner !=auth.getActive() ){
        this.router.navigate(['']);
      }
      });
  }

  ngOnInit() {
  }

}
