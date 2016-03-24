var woof = [ { url: 'localhost', path: '/Users/willwh/Sites/carlyle8' } ];

console.log(woof.len);

var sites = [];
console.log(sites);
var site1 = { 'url':'localhost','path':'/Users/willwh/Sites/drupal8.dev'};
var site2 = { 'url':'drupal8.dev','path':'/Users/willwh/Sites/drupal8.dev'};
var site3 = { 'url':'drupal8.staging','path':'/Users/willwh/Sites/drupal8.dev'};
sites.push(site1);
sites.push(site2);
sites.push(site3);
console.log(sites);

for (var i = 0, len = sites.length; i < len; i++) {
  console.log(sites[i].url);
}
