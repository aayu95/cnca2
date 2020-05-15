const express = require('express');
const request = require('request');

const servers = ['http://localhost:3000', 'http://localhost:3001','http://localhost:3000'];

let error_counter = 0;
let request_counter=1
let cur = (Math.floor(request_counter/20))%servers.length



const handler = (req, res) => {
    //console.log(req.url);
    console.log(req.ip);
    console.log(request_counter)
    console.log(cur);

    const _req = request({ url: servers[cur] + req.url })
        .on('response', response => {
            error_counter = 0;
        })
        .on('error', error => {
            error_counter += 1;
            //console.log("hopping to next: "+error_counter);
            if (error_counter < 10) {
                request_counter+=20
                cur = (Math.floor(request_counter/20))%servers.length;
                handler(req, res);
                console.log(error.message)
            }
            else{
                res.status(500).send("All servers down right now!");
                request_counter=0
                error_counter=0
            }
        });
    req.pipe(_req).pipe(res);
    // console.info("executed");
    // console.log(cur);
    request_counter+=1;
    cur = (Math.floor(request_counter/20))%servers.length;
    //console.log(cur);
};


const server = express().get('*', handler).post('*', handler);
server.use(requestIp.mw())

server.listen(9876);

