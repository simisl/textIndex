import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface index{
  text: string
  pageNo: number[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'textIndex';
  textArray!: string[];
  indexArray!: index[];
  fileNmaes!: string[]
  constructor(private http: HttpClient){}
  ngOnInit(){
    this.fileNmaes = ['/assets/Page1.txt','/assets/Page2.txt','/assets/Page3.txt']
    this.textArray = []
    this.indexArray =[]
    this.fileNmaes.map((name,i)=>{
      this.createIndex(name,i)
    })
  }
  showIndex(){
    this.textArray = []
    this.indexArray.map((obj,i)=>{
      obj.text = obj.text.toLowerCase()
      obj.pageNo = [...new Set(obj.pageNo)]
      this.textArray[i] = obj.text + ' : '+obj.pageNo+'\n'

    })
    this.textArray.splice(0,0,'Word : Page Numbers\n')
    this.textArray.splice(1,0,'--------------------\n')
    let file = new Blob(this.textArray, {type: '.txt'});
    var a = document.createElement("a")
    var url = URL.createObjectURL(file);
    a.href = url;
    a.download = 'index';
    document.body.appendChild(a);
    a.click();

  }
  createIndex(fileName: string, pageNo:number){
    pageNo = pageNo + 1
    this.http.get(fileName,{responseType: 'text'}).subscribe(data=>{
      var word = data.split(' ');
      if(this.indexArray.length>0){
        word.map((wd)=>{
          if(wd.includes('\r\n')){
            let words = wd.split(/\r?\n/)
            this.addToIdexArray(words,pageNo)
          }
          else if(wd.includes('-'))
          {

            let words = wd.split('-')
            this.addToIdexArray(words,pageNo)

          }
          else if(wd.includes('/'))
          {

            let words = wd.split('/')
            this.addToIdexArray(words,pageNo)

          }
          else {
            wd = wd.replace(/[^a-zA-Z_' ]/g, "").trim()
            var textFound = 0
            this.indexArray.filter(obj=>{
              if(obj.text.toUpperCase() === wd.toUpperCase()){
                textFound = 1
                obj.pageNo.push(pageNo)
              }
            })
            if(!textFound){
              this.indexArray = this.indexArray.concat({text: wd, pageNo:[pageNo]})
            }

          }
        })

      }
      else {
        word.map((wd)=>{
          if(wd.includes('\r\n')){
            let words = wd.split(/\r?\n/)
            this.addToTextArray(words)
          }
          else if(wd.includes('-'))
          {

            let words = wd.split('-')
            this.addToTextArray(words)
          }
          else if(wd.includes('/'))
          {

            let words = wd.split('/')
            this.addToTextArray(words)

          }
          else {
            wd = wd.replace(/[^a-zA-Z_' ]/g, "").trim()
            this.textArray = this.textArray.concat(wd)

          }
        })
        this.textArray = this.textArray.filter(word=>word!='')
        this.textArray = this.textArray.map(word=>{
          return word.toLowerCase()})
        this.textArray = [...new Set(this.textArray)]
        this.textArray.sort((a,b)=>a.localeCompare(b))
        this.textArray.map(obj=>{
          this.indexArray.push({text:obj,pageNo:[pageNo]})
        })
      }
      this.indexArray.sort((a,b)=>a.text.localeCompare(b.text))
      this.indexArray = this.indexArray.filter(obj=>{return obj.text!=''&& obj.text != 'and' && obj.text != 'or' && obj.text != 'of' && obj.text != 'to' && obj.text != 'is' && obj.text != 'the' && obj.text != 'a' && obj.text != 'are' && obj.text != 'in'})

    })

  }
  addToTextArray(words: string[]){
    words.map(wrd=>{
      wrd = wrd.replace(/[^a-zA-Z_' ]/g, "").trim()
      this.textArray = this.textArray.concat(wrd)
    })

  }
  addToIdexArray(words: string[], pageNo: number){
    words.map(wrd=>{
      wrd = wrd.replace(/[^a-zA-Z_' ]/g, "").trim()
      var textFound = 0
      this.indexArray.filter(obj=>{
        if(obj.text.toUpperCase() === wrd.toUpperCase()){
          textFound = 1
          obj.pageNo.push(pageNo)
        }
      })
      if(!textFound){
        this.indexArray = this.indexArray.concat({text: wrd, pageNo:[pageNo]})
      }
    })
  }
}
