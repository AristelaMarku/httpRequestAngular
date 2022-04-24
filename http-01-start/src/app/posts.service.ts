import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { title } from "process";
import { Subject,throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })

export class PostsService {
  error = new Subject<string>()

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        "https://ng-complete-guide-d434c-default-rtdb.firebaseio.com/posts.json",
        postData,
        {
          observe:'response'
        }
      )
      .subscribe((responseData) => {
        console.log(responseData);
      }, error =>{
        this.error.next(error.message)
      });
  }

  fetchPosts() {
   return this.http.get('https://ng-complete-guide-d434c-default-rtdb.firebaseio.com/posts.json',
  {
    headers: new HttpHeaders({ "Custom-Header": "Hello" }),
    params: new HttpParams().set('print', 'pretty')
  })
    .pipe(map((responseData: {[key: string]: Post})=> {
      const postArray: Post[] =[];
      for (const key in responseData){
        if(responseData.hasOwnProperty(key)){
        postArray.push({...responseData[key], id:key})
        }
      }
      return postArray;
    }),
      catchError(errorRes => {
        //Send to
        return throwError(errorRes)
      })
    )
  }

  deletePosts(){
    return this.http.delete( "https://ng-complete-guide-d434c-default-rtdb.firebaseio.com/posts.json",
    {
      observe:'events',
      responseType: 'json'
    }
    ).pipe(tap(event =>{
      console.log(event)

      if(event.type === HttpEventType.Response){
        console.log(event.body)
      }
    }))
  }


}
