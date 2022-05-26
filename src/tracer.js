class Tracer{

    constructor(txt, pos_start, pos_end){
        this.txt = txt;
        this.pos_start = pos_start;
        this.pos_end = pos_end;
    }

    tracer_error(){

        var result = '';

        var idx_start = Math.max( this.txt.lastIndexOf('\n', this.pos_start.idx  ) ,0);
        var idx_end = this.txt.indexOf('\n', idx_start + 1);

        if (idx_end < 0){
            idx_end = this.txt.length;
        }

        var line_count = this.pos_end.ln - this.pos_start.ln + 1;

        for (var i = 0; i < line_count; i++) {

            var line = this.txt.substring(idx_start, idx_end);

            if (i == 0)
                var col_start = this.pos_start.col;
            else
                var col_start = 0;

            if (i == line_count - 1)
                var col_end = this.pos_end.col;
            else
                var col_end = line.length - 1;

            result = result + line + '<br>' +'\n' ;



            if ((col_end - col_start)>0) {
                result = result + ' '.repeat(col_start) + '^'.repeat(col_end - col_start);
            }

            idx_start = idx_end;
            idx_end = this.txt.indexOf('\n', idx_start + 1);
            if (idx_end < 0)
                idx_end = this.txt.length;
        }

        return result.replace('\t','');

    }
}

module.exports = Tracer;
