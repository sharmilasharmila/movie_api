// let PI = 3.14159265359;
// module.exports.area = (radius) => Math.pow(radius,2) * PI;
// module.exports.circumfarence = (radius) => 2 * radius * PI;

const PI = 3.14159265359;
export function area(radius){return radius ** 2 * PI;}
export function circumfarence(radius){return radius * 2 * PI;}