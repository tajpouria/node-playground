/* Primitive */
function method(str, strCons, numCons, boolCons) {}

method("foo", new String("foo"), new Number(2), new Boolean(false)); // Primitive number

function methodNum(inf, nan) {}

methodNum(Infinity, NaN); // null and void(for undefined)

function acceptNullAndUndefind(n, und) {}

acceptNullAndUndefind(null, undefined); // void for undefined
// Maybe type when a value is optional

function AcceptMaybeParam(may) {}

AcceptMaybeParam(null);
AcceptMaybeParam(undefined);
AcceptMaybeParam("foo");
AcceptMaybeParam(null); // Optional object param

function acceptObj(obj) {}

acceptObj({}); // Symbol

function acceptSymbol(s) {}

acceptSymbol(new Symbol()); // Refine to symbol

const x = new Symbol();

if (typeof x === "symbol") {
  const y = x;
}
/* Literal types */


function accepLit(a, b) {}

accepLit(2, "foo");
/* mixed */

function acceptMixed(sth) {
  // Error mixed could behave either like a string or number
  // return sth + 2
  if (typeof sth === "number") {
    return sth + 2;
  }
}

acceptMixed(2);
/* any */

function accAny(sth) {
  const foo
  /* :number */
  = 2 + sth;
  const bar = sth + "spam";
  return foo;
}

accAny(1);
/* Maybe */

function acceptMayNumber(n) {}

acceptMayNumber(null);
acceptMayNumber(undefined);
acceptMayNumber(2); // acceptMayNumber("a");

function acceptOptNumber(n) {}

acceptOptNumber(2);
acceptOptNumber(undefined); // acceptOptNumber(null);

function acceptsMaybeProp({
  value
}) {// ...
}

acceptsMaybeProp({
  value: undefined
}); // Works!

acceptsMaybeProp({}); // Error!

function refineToNumber(val) {
  if (val != null) {
    // null == undefined => true, false == null || false == undefined => false
    // Check for not not null and undefined
    const bar = val;
  }
} // Vars


let l
/* : 2 */
= 2; // l = 1;

let foo = 2;
if (Math.random()) foo = true;
if (Math.random()) foo = "bar";
let insOf = foo; // number | boolean | string
// Function

const withOutParamName = (string, number, boolean) => {
  console.log(string, number, boolean);
};
