/*
Team number: 15
City: Melbourne 
Team Members: Aayush Mehta (1105081); Abhijeet Singh (1094984); Anoushka Doctor (1012827); Muhammad Atif (924009); Siddharth Agarwal (1077275)
*/

const express = require('express');
const request = require('request');

const servers = ['http://localhost:3000', 'http://localhost:3001'];
let cur = 0;
let error_counter = 0;

const handler = (req, res) => {
    //console.log(req.url);

    const _req = request({ url: servers[cur] + req.url })
        .on('response', response => {
            error_counter = 0;
        })
        .on('error', error => {
            error_counter += 1;
            //console.log("hopping to next: "+error_counter);
            if (error_counter < 10) {
                handler(req, res);
                console.log(error.message)
            }
            else{
                res.status(500).send("All servers down right now!");
                error_counter=0
            }
        });
    req.pipe(_req).pipe(res);
    // console.info("executed");
    // console.log(cur);
    cur = (cur + 1) % servers.length;
};


const server = express().get('*', handler).post('*', handler);

server.listen(9876);