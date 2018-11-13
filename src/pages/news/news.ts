import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import 'rxjs/add/operator/map';
import * as x2js from 'xml2js';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@Component({
  selector: 'page-news',
  templateUrl: 'news.html'
})

export class NewsPage { 
  targetUrl : string ;
  public  items : any = [];
  public  str_firstUrl : string;
  public str_firstImgurl : string;
  public str_firstDescription : string;
  public str_publishDate : any;  
  constructor(public navCtrl: NavController, public navParams: NavParams,  public http: HTTP,public http1:Http, public iab: InAppBrowser) {
    this.getNewsData();
    
  }

  //fetching from site url
  getNewsData(){
    var itemlist = [];
    var splitarray = [];
    var splitarray1 = [];
    var splitarray2 = [];
    var splitarray3 = [];
    var str_url : string;
    var str_imgurl : string;
    var str_description : string ;
    var publishDate : any;

    let that =  this;
    /// use when you run in browser

      this.http1.get("http://feeds.feedburner.com/daily-express-tennis-news?format=xml",)
          .subscribe(data =>{
              //debugger;
              x2js.parseString(data['_body'], function (err, result) {

    //use when you need to to apk
    // this.http.get("http://feeds.feedburner.com/daily-express-tennis-news?format=xml",{},{})
   
    // .then(data =>{
    
    //   x2js.parseString(data.data, function (err, result) {

    console.log(result.rss.channel[0].item[0].title[0]);   
    for (let i = 0; i < result.rss.channel[0].item.length; i++) {

          str_description = result.rss.channel[0].item[i].description[0].toString();
          splitarray = str_description.split("=", 3);
          splitarray1 = splitarray[2].split("</a>", 3);
          splitarray2 = splitarray1[1].split("<", 3); 
          splitarray3 = splitarray[1].split(">", 3); 

          str_imgurl = splitarray1[0].substring(1, (splitarray1[0].length-3));
          str_description = splitarray2[2].substring(5, splitarray2[2].length);
          str_url = splitarray3[0].substring(1, splitarray3[0].length - 1);
          publishDate = new Date(result.rss.channel[0].item[i].pubDate[0]);        


           let newName = {
              id:i.toString(),
              link_url: str_url,
              imgurl : str_imgurl,
              publishDate : that.getDate(publishDate),
              description : str_description,
              title : result.rss.channel[0].item[i].title[0]
             
           };
           itemlist.push(newName);
        }
        that.items = itemlist;
        that.items.sort(function(a,b) { 
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime() 
        });  
        that.str_firstUrl = that.items[0].link_url;
        that.str_firstImgurl = that.items[0].imgurl;
        that.str_publishDate = that.items[0].publishDate;
        that.str_firstDescription = that.items[0].description;
       console.log(that.items);

      }); 
                   
      },error=>{
        console.log(error);// Error getting the data
    });  
  }
  getDate(publishDate) {
    var date = new Date(publishDate),
      year = date.getFullYear(),
      month = (date.getMonth() + 1).toString(),
      formatedMonth = (month.length === 1) ? ("0" + month) : month,
      day = date.getDate().toString(),
      formatedDay = (day.length === 1) ? ("0" + day) : day,
      hour = date.getHours().toString(),
      formatedHour = (hour.length === 1) ? ("0" + hour) : hour,
      minute = date.getMinutes().toString(),
      formatedMinute = (minute.length === 1) ? ("0" + minute) : minute,
      second = date.getSeconds().toString(),
      formatedSecond = (second.length === 1) ? ("0" + second) : second;
    return formatedMonth + "/" + formatedDay + "/" + year + " " + formatedHour + ':' + formatedMinute + ':' + formatedSecond;
  };
  openUrl(entry){

    this.iab.create(entry.link_url,"_self");

 }
 buttonClick(event){
    console.log("button clicked");
    console.log(event);
   }
  
   itemClicked(event,itemData){
     console.log("item clicked");
     console.log(event);
     console.log(itemData);
   }  

}
