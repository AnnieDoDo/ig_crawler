const https = require('https');
const express = require('express');
const fastJson = require('fast-json-stringify')
const fs = require('fs');

const batch = '50';
const length = parseInt(batch);
const key_basic_info = '?__a=1'
const path_query_hash = '/graphql/query/?query_hash='
const now_timestamp = Date.now();
let posts = [];

const get_url = function () {
  const argvs = process.argv.slice(2);
  if (!argvs[0]) {
    console.log("Please enter the IG URL")
    process.exit(1)
  } 
  return new URL (argvs[0])
}

const get_month = function () {
  const argvs = process.argv.slice(2);
  if (!argvs[1]) {
    console.log("Please enter the number of month")
    process.exit(1)
  } else if (!Number.isInteger(parseInt(argvs[1]))) {
    console.log("Please enter integer")
    process.exit(1)
  }
  return argvs[1]*30*24*60*60*1000
}

const get_credential = fs.readFileSync('./credential.txt', 'utf8' , (err, data) => {
  if (err) {
    console.log("Please enter the IG Loggined credential")
    process.exit(1)
  }
  return data.toString()
})

const get_options = function () {
  let credential = get_credential
  return {
    hostname: get_url().hostname,
    port: 443,
    path: get_url().pathname + key_basic_info,
    method: 'GET',
    headers: {
      Cookie: credential
    },
  }
}

const get_query_hash_options = function (id,cursor) {
  let credential = get_credential
  return {
    hostname: get_url().hostname,
    port: 443,
    path: path_query_hash + '8c2a529969ee035a5063f2fc8602a0fd&variables=%7B%22id%22%3A%22'+ id + '%22%2C%22first%22%3A' + batch + '%2C%22after%22%3A%22' + cursor +'%3D%3D%22%7D',
    method: 'GET',
    headers: {
      Cookie: credential
    },
  }
}

let profile = {
  id: "",
  follower_count: 0,
  biography: "",
  username: ""
}


let get_base_info = function () {
  let options = get_options();

  return new Promise ((resolve, reject) => {
    let req = https.get(options, (res) => {
      let raw = '';

      res.on('data', (chunk) => {
        raw += chunk;
      }).on("error", (error) => {
        reject(console.error(error))
      });

      res.on('end', () => {
        let data = JSON.parse(raw)

        profile.id = data.graphql.user.id
        profile.follower_count = data.graphql.user.edge_followed_by.count
        profile.biography = data.graphql.user.biography
        profile.username = data.graphql.user.username

        let count = 0
        edge_length = data.graphql.user.edge_owner_to_timeline_media.edges.length
        for(let i = 0; i < edge_length; i++) {
          let n = data.graphql.user.edge_owner_to_timeline_media.edges[i].node
          if ((now_timestamp-n.taken_at_timestamp*1000) < get_month()) {
              posts.push({
                id: n.id,
                shortcode: n.shortcode,
                display_url: n.display_url,
                like_count: n.edge_media_preview_like.count,
                comment_count: n.edge_media_to_comment.count,
                is_video: n.is_video,
                taken_at_timestamp: n.taken_at_timestamp
            })
            count ++ 
          }
        }

        let get_next = false
        if (count == edge_length) {
          get_next = true
        }
        has_next_page = data.graphql.user.edge_owner_to_timeline_media.page_info.has_next_page
        end_cursor = data.graphql.user.edge_owner_to_timeline_media.page_info.end_cursor.slice(0,-2)

        resolve({profile: profile,has_next_page: has_next_page, end_cursor: end_cursor, get_next: get_next})
      })
    })
    req.end()
  })
}

let get_next_page = function (id, cursor) {
  let options = get_query_hash_options(id, cursor);

  return new Promise ((resolve, reject) => {
    let req = https.get(options, (res) => {
      let raw = '';

      res.on('data', (chunk) => {
        raw += chunk;
      }).on("error", (error) => {
        reject(console.error(error))
      });
      res.on('end', () => {
        let data = JSON.parse(raw).data
        let count = 0

        for(let i = 0; i < length; i++) {
          let n = data.user.edge_owner_to_timeline_media.edges[i].node
          if ((now_timestamp-n.taken_at_timestamp*1000) < get_month()) {
              posts.push({
                id: n.id,
                shortcode: n.shortcode,
                display_url: n.display_url,
                like_count: n.edge_media_preview_like.count,
                comment_count: n.edge_media_to_comment.count,
                is_video: n.is_video,
                taken_at_timestamp: n.taken_at_timestamp
            })
            count ++ 
          }
        }

        let get_next = false
        if (count == length) {
          get_next = true
        }
        has_next_page = data.user.edge_owner_to_timeline_media.page_info.has_next_page
        end_cursor = data.user.edge_owner_to_timeline_media.page_info.end_cursor.slice(0,-2)
        resolve({has_next_page: has_next_page, end_cursor: end_cursor, get_next: get_next})
      })
    })
    req.end()
  })
}

async function control_flow() {

  let base_info = await get_base_info();
  if (base_info.has_next_page && base_info.get_next) {
    let page_info = await get_next_page(base_info.profile.id, base_info.end_cursor)

    let has_next_page = page_info.has_next_page
    let get_next = page_info.get_next
    while (has_next_page && get_next) {
      let repeat_page_info = await get_next_page(base_info.profile.id, page_info.end_cursor)
      has_next_page = repeat_page_info.has_next_page
      get_next = repeat_page_info.get_next
    }
  }
  let object = {
    profile,
    posts
  }
  console.log(object)
}

control_flow()

