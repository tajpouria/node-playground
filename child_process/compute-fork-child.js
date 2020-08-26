process.on("message", () => {
  const sum = computeLarge();
  process.send(sum);
});

function computeLarge() {
  let sum = 0;
  for (let i = 0; i < 1e10; i++) {
    sum += i;
  }
  return sum;
}
