class Result{
    constructor(){
        this.error = null;
        this.node = null;
        this.next_count = 0;
        this.last_registered_next_count = 0;
        this.to_reverse_count = 0;
    }

    register_next(){
        this.last_registered_next_count = 1;
        this.next_count++;
    }
    register(res){

        if (res instanceof Result) {

            this.last_registered_next_count = res.next_count;
            this.next_count = this.next_count + res.next_count;

            if (res.error){
                this.error = res.error;
            }

            return res.node;

        }
        return res;

        
    }
    try_register(res){
        if(res.error){
            
            this.to_reverse_count = res.next_count;
            return null;
        }
        return this.register(res);
    }

    success(node){
        this.node = node;
        return this;
    }
    failure(error){
        if(! this.error || this.last_registered_next_count == 0){
            this.error = error;
        }

        return this;
    }
}

module.exports = Result;