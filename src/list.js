const Value = require('./value.js');
const e = require('./error.js');

class List extends Value{

    constructor(elements){
      super();
      this.elements = elements;
    }

    as_string(){

      const String_ = require('./string.js');

      return "[ " +
        this.elements.map(e => {
          if(e instanceof String_){
            return "'" + e.value + "'";
          }
          else{
            return e.as_string()
          }
        }).join(", ")
        +" ]";
    }

    add(other){

      var new_list = this.get();
      new_list.elements.push(other);


      return {
          'n':new_list,
          'error':null
      }


    }

    retrieve(other){

        const Number_ = require('./number.js');

      if (other instanceof Number_) {

        
        if (this.elements[other.value] /* != undefined */){
          return {
            'n': this.elements[other.value],
            'error': null
          }

        }else{
          return { 'n': null, 'error': this.out_of_range(other) }
        }

      }
      else {
        return { 'n': null, 'error': this.illegal_operaction(other) }
      }
    }


    is_true(){

        return this.elements.length > 0;
    }

    get(){
      var copy = new List(this.elements);
      copy.set_position(this.pos_start, this.pos_end);
      copy.set_context(this.context);

      return copy;
    }
    repr(){

      return `[${this.elements.map(e => e.value).join(",")}]`;

    }
}

module.exports = List;
