# IG Crawler
> This is a crawler parsing data from two IG APIs by node.js.

1. https://www.instagram.com/{username}/?__a=1
2. https://www.instagram.com/graphql/query/?query_hash=....&variables=...
* query_hash: 8c2a529969ee035a5063f2fc8602a0fd
* variables: string of urlencoded json
```json
{
    "id": <userid>,
    "fist": <at most 50 posts per request>,
    "after": <end_cursor>,
}
```

## Usage
* Put your logged in cookie in file which named credential.txt in the same folder of this project. (It will be like the format below.)
> mid=...; ig_did=...; ig_nrcb=1; csrftoken=...; ds_user_id=...; sessionid=...:...:...; shbid="..."; shbts="..."; rur="..."

* run with URL and the number of months
> node index.js https://www.instagram.com/{username}/ 5