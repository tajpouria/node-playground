
const res = heavyOperation();

process.send(res);

function heavyOperation() {
  let res = 0;
  for (let i = 0; i < 1e10; i++) {
    res += 1;
  }
  return res;
}
