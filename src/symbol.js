class Symbol_{
    constructor(parent=null){
        this.symbols = {};
        this.parent = parent;
    }
    set(name, value){
        this.symbols[name] = value;
    }
    get(name){
        const value = this.symbols[name];

        if (value == undefined && this.parent != null)
            return this.parent.get(name);

        return value;

    }
    reset(){
      this.symbols = {};
    }
    remove(name){
        delete this.symbols[name];
    }
}

module.exports = Symbol_;
