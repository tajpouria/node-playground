// @flow 

// Primitive

function method (str: string, strCons: String, numCons: Number, boolCons: Boolean){}

method('foo', new String('foo'), new Number(2), new Boolean(false))

  // Primitive number

function methodNum(inf: number, nan: number){}

methodNum(Infinity, NaN)

  // null and void(for undefined)

function acceptNullAndUndefind(n: null, und: void){}

acceptNullAndUndefind(null, undefined) // void for undefined

  // Maybe type when a value is optional

function AcceptMaybeParam(may: ?string){}

AcceptMaybeParam(null)
AcceptMaybeParam(undefined)
AcceptMaybeParam('foo')
// $ExceptError
AcceptMaybeParam(null)

 // Optional object param

function acceptObj (obj: {foo?: string}){}

acceptObj({})

 // Symbol

function acceptSymbol(s: Symbol){}

acceptSymbol(new Symbol())


// Refine to symbol
const x = new Symbol()
if (typeof x === "symbol") {
  const y: symbol = x;
}

