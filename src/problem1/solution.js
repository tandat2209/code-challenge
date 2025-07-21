var sum_to_n_a = function(n) {
  return n * (n + 1) / 2;
};

var sum_to_n_b = function(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
};

var sum_to_n_c = function(n) {
  if (n === 0) {
    return 0;
  }
  return n + sum_to_n_c(n - 1);
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));