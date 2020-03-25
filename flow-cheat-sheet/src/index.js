// @flow

/* Primitive */

function method(
  str: string,
  strCons: String,
  numCons: Number,
  boolCons: Boolean,
) {}

method("foo", new String("foo"), new Number(2), new Boolean(false));

// Primitive number

function methodNum(inf: number, nan: number) {}

methodNum(Infinity, NaN);

// null and void(for undefined)

function acceptNullAndUndefind(n: null, und: void) {}

acceptNullAndUndefind(null, undefined); // void for undefined

// Maybe type when a value is optional

function AcceptMaybeParam(may: ?string) {}

AcceptMaybeParam(null);
AcceptMaybeParam(undefined);
AcceptMaybeParam("foo");
AcceptMaybeParam(null);

// Optional object param

function acceptObj(obj: { foo?: string }) {}

acceptObj({});

// Symbol

function acceptSymbol(s: Symbol) {}

acceptSymbol(new Symbol());

// Refine to symbol
const x = new Symbol();
if (typeof x === "symbol") {
  const y: symbol = x;
}

/* Literal types */

function accepLit(a: 2, b: "foo" | "spam") {}

accepLit(2, "foo");

/* mixed */

function acceptMixed(sth: mixed) {
  // Error mixed could behave either like a string or number
  // return sth + 2

  if (typeof sth === "number") {
    return sth + 2;
  }
}

acceptMixed(2);

/* any */

function accAny(sth: any) {
  const foo /* :number */ = 2 + sth;
  const bar = sth + "spam";
  return foo;
}

accAny(1);

/* Maybe */
function acceptMayNumber(n: ?number) {}

acceptMayNumber(null);
acceptMayNumber(undefined);
acceptMayNumber(2);
// acceptMayNumber("a");

function acceptOptNumber(n?: number) {}

acceptOptNumber(2);
acceptOptNumber(undefined);
// acceptOptNumber(null);

function acceptsMaybeProp({ value }: { value: ?number }) {
  // ...
}

acceptsMaybeProp({ value: undefined }); // Works!
acceptsMaybeProp({}); // Error!

function refineToNumber(val: ?number) {
  if (val != null) {
    // null == undefined => true, false == null || false == undefined => false
    // Check for not not null and undefined
    const bar = val;
  }
}

// Vars

let l /* : 2 */ = 2;

// l = 1;

let foo = 2;

if (Math.random()) foo = true;
if (Math.random()) foo = "bar";

let insOf = foo; // number | boolean | string

// Function

function receiveRest(...params: Array<number>): number[] {
  return params;
}

receiveRest(1, 2);

// Predicate

function trusty(a, b): boolean %checks {
  return !!a && !!b;
}

function useTrusty(a, b): string {
  if (trusty(1, 2)) {
    return a + b;
  }
  return "";
}

function isString(a): %checks {
  return typeof a === "string";
}

// Callable objects

type CallableObject = {
  (number, number): number,
  foo: "bar",
};

const addToThing: CallableObject = (a, b) => {
  return a + b;
};

// Object type

const objT = {};

if (Math.random() >= 0.5) objT.prop = 1;
else objT.prop = true;

const a: number | boolean = objT.prop;

// Exact object type

type FooType = {| foo: "foo" |};

// const f1: FooType = { foo: "foo", bar: "bar" }; It's not ok to add more props
const f1: FooType = { foo: "foo" };

type BarType = {| bar: "bar" |};
type FooBarType = {| ...FooType, ...BarType |};

const fb1: FooBarType = { foo: "foo", bar: "bar" };

// Objects as maps

type Oam = {
  foo: string,
  [id: number]: Array<string>,
};

// const oamObj: Oam = { foo: "bar", hello: ["guys"] }; // Error

const oamObj: Oam = { foo: "bar", [2]: ["guys"] };

/* Array Type */

// new Array(2); // [ undefined, undefined ]
// new Array(1, 2, 3); // [1, 2, 3]

const arrMix: Array<mixed> = [1, 2, "string", undefined];

// readonlyArray

const readonlyArray: $ReadOnlyArray<string> = ["foo", "bar"];

// readonlyArray[1] = 2; // Error

/* Tuple type */

let tp1: [number, number] = [1, 2];

// tp1.push(3); // Error

/* Type alias */

type objTypeAl<T, K, U> = {
  a: T,
  b: K,
  c: U,
};

/* opaque type alias */

opaque type ID = string;

const id12: ID = "foo";

// export { ID };
// import type { ID } from "./export.js";

/* interface */

interface Animal {
  walk(): void;
}

class Dog implements Animal {
  walk() {}
}

interface MyInterface<T> {
  +foo: String; // readOnly
  -[key: string]: T; // writeOnly
}

// read and write only

interface SomeInterface {
  +reo: string;
  -wro: string;
}

function someFunc(par: SomeInterface) {
  par.reo;
  par.wro = "foo";

  //  par.reo = 2; // Error
  //  par.wro; // Error
}

/* Genetic type */

// Specifying just some types // Notice also able to specify
class Lo<T, U, K> {}

const lo1 = new Lo<_, number, _>();

/* Intersection type */

type TAlef =  { foo: string }
type TBlef = { bar: number }

function getTAlefAndTBlef(stg: TAlef & TBlef){
  const a: TAlef = stg;
  const b: TBlef = stg;
}

// getTAlefAndTBlef({foo: 'foo'}) // Error
getTAlefAndTBlef({foo: 'foo', bar: 2})

/* typeof */

const aNum2 = 1

// const bNum2: typeof aNum2 = 'string' // Error

/* Type casting expression */

// Casting using any

let toCast = (1: number);

let newValue = ((toCast: any): string)

// Clone e.g.

type ToCloneType = {
  foo: number,
}

const cloneObj = (toClone: ToCloneType ) => {
  let cloneTemp  = {}
  
  Object.keys(toClone).forEach( key => {cloneTemp[key] = toClone[key]} )
   
  return ( cloneTemp: ToCloneType )
}

const itsClonned: ToCloneType = cloneObj({foo: 10})


function cloneObjectWithotKnowingTheSchema<T: { [key: string]: mixed }>(obj: T): $Shape<T> { // $Shape Huh!
  let cloneTemp = {}
  // do the stuff

  return cloneTemp
}

/* Utility types */

const tmpUtil = { foo : 'FOO', bar: 'BAR' }

// $Keys<T>

type tmp$Keys = $Keys<typeof tmpUtil> // foo | bar

const testKeys: tmp$Keys = 'foo'

// $Values<T>

type tmp$Values = $Values<typeof tmpUtil> // FOO | BAR

// $Readonly<T> // {+foo: 'FOO', +bar: 'BAR'}

// $Exact<T> // {| foo: 'FOO', bar: 'BAR' |}

// $Diff<T, K> 
