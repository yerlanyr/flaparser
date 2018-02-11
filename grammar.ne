@{% var ast = require('./ast.js'); %}


main -> 
   _ MATH _       {% d => d[1] %}
  | _ ASSIGNMENT _ {% d => d[1] %}
  | _ FUNCTIONDEC _ {% d => d[1] %}

ASSIGNMENT -> VAR _ "=" _ MATH {% d => ast.Assignment([d[0],d[4]]) %}

MATH -> ADD_SUB {% id %}

ADD_SUB -> ADD_SUB _ "+" _ MUL_DIV  {% d => ast.Addition([d[0], d[4]])%}
         | ADD_SUB _ "-" _ MUL_DIV  {% d => ast.Subtraction([d[0], d[4]])%}
         | "(" _ ADD_SUB _ ")" {% d => d[2] %}
         | MUL_DIV                  {% id %}

MUL_DIV -> MUL_DIV _ "*" _ EXPONENTIATION {% d => ast.Multiplication([d[0], d[4]]) %}
         | NUM _ "(" _ MATH _ ")"          {% d => ast.Multiplication([d[0], d[4]]) %}
         | MUL_DIV _ "/" _ EXPONENTIATION {% d => ast.Division([d[0], d[4]]) %}
         | EXPONENTIATION                 {% id %}

EXPONENTIATION -> EXPONENTIATION _ "^" _ PARENTHESIS {% d => ast.Exponentiation([d[0], d[4]])%}
                | PARENTHESIS                        {% id %}

NEGATION  -> "-" _ NUM          {% d => ast.Negation([d[2]])%}
MODULO    -> NUM _ "%" _ NUM    {% d => ast.Modulo([d[0], d[4]])%}

PARENTHESIS -> "(" _ ATOMIC _ ")" {% d => d[2]%}
             | ATOMIC             {% id %}

ATOMIC -> MODULO {% id %}| NEGATION {% id %}| FUNCTION {% id %}| VAL {% id %}

FUNCTIONDEC -> "fun" _ string _ "(" _ VARARGS _ ")" _ "=>" _ MATH {% d => ast.Functiondec([d[2]].concat([d[6]]).concat(d[12])) %}
FUNCTION -> string _ "(" _ FUNCARGS _ ")" {% d => ast.Function([d[0]].concat([d[4]]))%}
FUNCARGS -> 
   FUNCARGS _ "," _ MATH       {% d => [d[0]].concat(d[4]) %}
  | MATH {% id %}
    
VARARGS -> VARARGS _ "," _ VAR   {% d => d[0].concat(d[4]) %}
  | VAR

VAL -> VAR {% id %}
  | NUM {% id %}
NUM -> decimal          {% d => ast.Number([d[0]])%}
VAR -> string           {% d => ast.Variable([d[0]]) %}

decimal -> int "." int  {% d => parseFloat(d[0] + d[1] + d[2]) %}
	| int                 {% d => parseInt(d[0]) %}

string -> [a-zA-Z]:+      {% d =>  d[0].join("") %}
int -> [0-9]:+          {% d => d[0].join("") %}

_ -> null     {% d => null %}
	| _ [\s]    {% d => null %}