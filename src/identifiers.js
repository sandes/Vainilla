class Identifiers{
    constructor(){
        this.TK_INT = 'INT';
        this.TK_FLOAT = 'FLOAT';
        this.TK_BOOLEAN = 'BOOLEAN';
        this.TK_STRING = 'STRING';
        this.TK_PLUS = 'PLUS';
        this.TK_MINUS = 'MINUS';
        this.TK_MUL = 'MUL';
        this.TK_DIV = 'DIV';
        this.TK_DIV_INTEGER = 'DIVINT';
        this.TK_MOD = 'MOD';
        this.TK_POW = 'POW';
        this.TK_LPAREN = 'LPAREN';
        this.TK_RPAREN = 'RPAREN';
        this.TK_LSQBRA = 'LSQBRA';
        this.TK_RSQBRA = 'RSQBRA';
        this.TK_IDENTIFIER = 'IDENTIFIER';
        this.TK_IDENTIFIER_DEFINED = 'IDENTIFIER_DEFINED';
        this.TK_EQUALS = 'EQUALS';
        this.TK_KEYWORD = 'KEYWORD';
        this.TK_IS_EQ = 'IS_EQUAL';
        this.TK_IS_NEQ = 'IS_NOT_EQUAL';
        this.TK_IS_LT = 'IS_LT';
        this.TK_IS_GT = 'IS_GT';
        this.TK_IS_LTE = 'IS_LTE';
        this.TK_IS_GTE = 'IS_GTE';
        this.TK_COMMA = 'COMMA';
        this.TK_ARROW = 'ARROW';
        this.TK_NEWLINE = 'NEWLINE';
        this.TK_EOF = 'EOF';
    }

    reserved(){
        return [
            'nulo',
            'verdadero',
            'falso',
            'pi',
            "y",
            "o",
            "no",
            'si',
            'sino',
            'entonces',
            'para',
            'hasta',
            'con',
            'paso',
            'hacer',
            'mientras',
            'funcion',
            'retornar',
            'continuar',
            'detener',
            'finfuncion',
            'finpara',
            'finmientras',
            'finsi',
            "mostrar",
            "alertar",
            "ingresar",
            "numero",
            "texto",
            "minus",
            "mayus",
            "raiz",
            "unir",
            "max",
            "min",
            "abs",
            "ln",
            "log",
            "sen",
            "cos",
            "tan",
            "esnumero",
            "estexto",
            "eslista",
            "agregar",
            "remover",
            "extender",
            "insertar",
            "reemplazar",
            "longitud",
            "azar",
            "subtexto",
            "buscar",
            "trunc",
            "redondear",
            "piso",
            "techo",
            "fecha"

        ];
    }

    nums(){
        return '0123456789.';
    }
    letters(){
        var en = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var es = 'ñáéíóúÑÁÉÍÓÚ';
        var pt = 'áâãàçéêèíìóôõòúù';
        var fr = 'îôûçëïü';
        return en+es+pt+fr;
    }

    spanish_keywords(){
        return [
            'definir', 'si', 'y', 'o', 'no',
            'sino', 'entonces', 'para', 'hasta',
            'con', 'paso', 'hacer', 'mientras',
            'función', 'funcion', 'retornar',
            'continuar', 'detener', 'finfuncion',
            'finfunción', 'finpara', 'finmientras','finsi',
        ];
    }

}




module.exports = Identifiers;
