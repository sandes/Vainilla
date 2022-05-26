class Position{
    constructor(idx, ln, col, fn, ftxt){
        this.idx = idx;
        this.ln = ln;
        this.col = col;
        this.fn = fn;
        this.ftxt = ftxt;
    }
    next(current=null){
        this.idx++;
        this.col++;

        if (current == "\n"){
            this.ln++;
            this.col = 0;
        }
        return this;
    }
    get(){
        return new Position(
            this.idx,
            this.ln,
            this.col,
            this.fn,
            this.ftxt
        );
    }

}

module.exports = Position;