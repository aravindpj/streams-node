class Writable{
    constructor(){
       
    }

    write(){
        this._write()
    }
}

class MyWritable extends Writable{
    constructor(){
        super()
    }

    _write(){
        console.log("Hello World")
    }
}
const myWritable = new MyWritable();

// Call the write method, which will internally call the _write method
myWritable.write(); 