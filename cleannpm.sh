#!/bin/bash

cd changemappers-frontend
rm -r node_modules
npm install

cd ..

cd changemappers-backend
rm -r node_modules
npm install
