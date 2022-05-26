class Token{
    constructor(type, value=null, pos_start=null, pos_end=null){
        this.type = type;
        this.value = value;

        if (pos_start){
            this.pos_start = pos_start.get();
            this.pos_end = pos_start.get();
            this.pos_end.next();
        }
        if (pos_end) {
            this.pos_end = pos_end;
        }
    }
    matches(type, value){
        return this.type == type && this.value == value;
    }
    as_string(){
        if (this.value) {
            return `${this.type}:${this.value}`;
        }else{
            return `${this.type}`;
        }
    }
}

module.exports = Token;