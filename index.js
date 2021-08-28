const https = require('https');
const express = require('express');
const fastJson = require('fast-json-stringify')
const fs = require('fs');

// const get_id = fastJson ({
//     title: 'get_id',
//     type: 'object',
//     properties: {
//         seo_category_infos: 'array',
//         logging_page_id: 'string',
//         graphql: { 
//             id: 'string'
//         },
//     }
// })
const argvs = process.argv.slice(2);
let month = 0
let basic_arg = '?__a=1'
let query_hash = '472f257a40c653c64c666ce877d59d2b&variables=%7B%22id%22%3A%22275237117%22%2C%22first%22%3A12%2C%22after%22%3A%22AQDgv0_xlXhuHI_YQW8deViqPYXPj7dim6ODe_tAbM6XLhqwbe-Xp4JPEHpLAJ5XGusu-nKdFoCYCVFcF7OkjSscKISMfCYIsEVs8zx9h2rWaQ%22%7D'

if (!argvs[0]) {
    console.log("Please enter the IG URL")
    process.exit(1)
} 

const url = new URL (argvs[0])

if (argvs[1]) {
    month = argvs[1]
} 

const options = {
    hostname: url.hostname,
    port: 443,
    path: url.pathname + basic_arg,
    method: 'GET',
    // family: 4,
    headers: {
        Cookie: 'mid=YRoT9gAEAAFVU9z-0gSaWs7k3804; ig_did=B689243A-062D-4858-BA5E-65847FB70CC3; ig_nrcb=1; csrftoken=PlW3beVGxorV5MR43M6SKZ0zHdLA1iw7; ds_user_id=4041465553; sessionid=4041465553%3AWfXDqMthkVP5a2%3A23; shbid="3317\0544041465553\0541661501481:01f73eaea89deccb3d11b006973845dc2a36b7cf8ee577dfdc08e8d3a2457fbb860279d4"; shbts="1629965481\0544041465553\0541661501481:01f74ca40a371b3fcf753d9937f0261447615f4957922fb6fe69a732d2bb6c6173908565"; rur="PRN\0544041465553\0541661544173:01f7a339cf09961b5ca8f6a41c716c63ed3cfe812ddd47a5b9971aa5d88a37fde321a3c5"'
    },
  }

https.get(options, (res) => {
  let data = '';

  // A chunk of data has been received.
  res.on('data', (chunk) => {
    data += chunk;
  });

  // The whole resonse has been received. Print out the result.
  res.on('end', () => {
    console.log(JSON.parse(data).graphql.user.id)
    // console.log(get_id(data))
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});

// const option_query = {
//     hostname: url.hostname,
//     port: 443,
//     path: url.pathname + query_hash,
//     method: 'GET',
//     // family: 4,
//     headers: {
//         Cookie: 'mid=YRoT9gAEAAFVU9z-0gSaWs7k3804; ig_did=B689243A-062D-4858-BA5E-65847FB70CC3; ig_nrcb=1; csrftoken=PlW3beVGxorV5MR43M6SKZ0zHdLA1iw7; ds_user_id=4041465553; sessionid=4041465553%3AWfXDqMthkVP5a2%3A23; shbid="3317\0544041465553\0541661501481:01f73eaea89deccb3d11b006973845dc2a36b7cf8ee577dfdc08e8d3a2457fbb860279d4"; shbts="1629965481\0544041465553\0541661501481:01f74ca40a371b3fcf753d9937f0261447615f4957922fb6fe69a732d2bb6c6173908565"; rur="PRN\0544041465553\0541661544173:01f7a339cf09961b5ca8f6a41c716c63ed3cfe812ddd47a5b9971aa5d88a37fde321a3c5"'
//     },
//   }

// https.get(option_query, (res) => {
// let data = '';

// // A chunk of data has been received.
// res.on('data', (chunk) => {
//     data += chunk;
// });

// // The whole resonse has been received. Print out the result.
// res.on('end', () => {
//     console.log(JSON.parse(data))
//     // console.log(get_id(data))
// });

// }).on("error", (err) => {
// console.log("Error: " + err.message);
// });