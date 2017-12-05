import { Component, OnInit,Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule, Routes, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-collection',
  templateUrl: './view-collection.component.html',
  styleUrls: ['./view-collection.component.css']
})
export class ViewCollectionComponent implements OnInit {
  @Input() showPictures = true;
  collection;
  images=[];
  pic;
  constructor(private auth:AuthService, private router:Router,private route: ActivatedRoute) { 
     /**
      * Get all images pretaining to the collection passed through parameters
      * Check whether the full resolution image is of type jpg or type tif by querying nasa for it
      * assign image thumbnails to display and originals to open in a new tab
     **/
     var pictures;
     this.route.params.subscribe(params => {
        if(params.images==""){
          this.showPictures = false;
        }
        else{
          this.showPictures = true;
          pictures = params.images.split(',');
          for(var i =0;i<pictures.length;i++){
            this.pic = pictures[i];
            console.log(this.pic);
            var tt = this;
            var request = new Request(tt.pic.replace('thumb.jpg','orig.jpg'),{
             method: 'GET'
            });
            fetch(request).then( function(resp){
                  if(resp.status==200){
                    tt.images.push({thumb:resp.url.replace('orig.jpg','thumb.jpg'),full:resp.url}); 
                  }
                  else if(resp.status==404){
                    tt.images.push({thumb:resp.url.replace('orig.jpg','thumb.jpg'),full:resp.url.replace('orig.jpg','orig.tif')});
                  }
              
            }).catch(err =>{
            });
           
          }
        }
        this.collection = params;
        if(params.priv=="true" && params.owner !=auth.getActive() ){
          this.router.navigate(['']);
        }
      });
  }

  ngOnInit() {
  }

}
