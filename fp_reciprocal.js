const _ = require('lodash');
const f2f = require('fixed2float');

let reciprocal_model = (data, m, n) => {
  let a = f2f.toFloat(data,m,n);
  console.log('a: ' + a + ' fixed: ' + f2f.toFixed(a,m,n).toString(16));
  const b = 1.466 - a;
  console.log('b: ' + b + ' fixed: ' + f2f.toFixed(b,m,n).toString(16));
  const c = a * b;
  console.log('c: ' + c + ' fixed: ' + f2f.toFixed(c,m,n).toString(16));
  const d = 1.0012 - c;
  console.log('d: ' + d + ' fixed: ' + f2f.toFixed(d,m,n).toString(16));
  const e = d * b;
  console.log('e: ' + e + ' fixed: ' + f2f.toFixed(e,m,n).toString(16));
  return f2f.toFixed(e * 4, m, n);
};

// Qmn fixed point format
const m = 7;
const n = 16-m;

let lzc = (data) => {
  let val = 16;
  for(i of _.range(16)) {
    if( (data & ~(Math.pow(2,i) - 1)) > 1) {
      val--;
    }
  }
  return val;
};

let din = 0x50ac;
//din= f2f.toFixed(0.5,m,n);
console.log(din.toString(16));

let normalize = (data) => {
  return {data: data >> (m - lzc(data)), shift: (m-lzc(data))};
};


console.log(lzc(din));

let norm_dout = normalize(din);
console.log(norm_dout.data.toString(16) + ' ' + norm_dout.shift);
console.log('Model');
console.log(reciprocal_model(norm_dout.data, m, n).toString(16));

//lhsop b = 1.466 -a

let b_op = (a) => {
  return f2f.toFixed(1.466,m,n) - a;
};

// c= a*b
let c_op = (a, b) => {
  return ((a * b) >> n) & 0xFFFF;
};

// d = 1.0012 - c
let d_op = (c) => {
  return f2f.toFixed(1.0012, m, n) - c;
};

// e = d * b
let e_op = (d, b) => {
  return ((d*b) >> n) & 0xFFFF;
};

// reciprocal = e * 4 or e >> 2
let reci_out = (e) => {
  return e << 2;
};

let b = b_op(norm_dout.data);
console.log('b: ' + b.toString(16));

let c = c_op(norm_dout.data, b);
console.log('c: ' + c.toString(16));

let d = d_op(c);
console.log('d: ' + d.toString(16));

let e = e_op(d, b);
console.log('e: ' + e.toString(16));

let reci = reci_out(e);
console.log('f: ' + reci.toString(16));
