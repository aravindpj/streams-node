const { Readable } = require('node:stream');
const fs = require('node:fs');

class MyReadableStream extends Readable{
   constructor({highWaterMark,fileName}){
      super({highWaterMark})
      this.fileName=fileName
      this.fd=null
   }

   _construct(callback){
      fs.open(this.fileName,"r",(err,fd)=>{
        if(err) {
            callback(err)
        }else{
            this.fd=fd
            callback()
        }
      })
   }

   _read(size){
    // console.log(size)
    const buff=Buffer.alloc(size)
    fs.read(this.fd,buff,0,size,null,(err,bytesRead)=>{
        if(err){
           return this.distroy(err)
        }
        /**
         * Push with Data: When data is pushed, the stream can emit a data event, and consumers can read this data.
         * Push with null: When null is pushed, it indicates the end of the stream, and an end event is emitted.
         * buff.subarray(0,bytesRead) : Creates a new subarray containing only the valid bytes read, avoiding pushing unused buffer space
         */
        this.push(bytesRead>0 ? buff.subarray(0,bytesRead) : null)
    })
   }
   _distroy(error,callback){
      if(this.fd){
          fs.close(this.fd,(err)=>{
            if(err) return callback(err || error)
            callback()    
          })
      }else{
        callback(error)
      }
   }
}

// const stream=new MyReadableStream({highWaterMark:64*1024,fileName:"text.txt"})

// stream.on("data",(chunk)=>{
//     // console.log(chunk.toString('utf-8'))
// })

module.exports=MyReadableStream