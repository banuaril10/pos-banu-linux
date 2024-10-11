#!/bin/bash

echo -e -n "\x1b\x70\x00\x19\xfa" | lpr -o raw
sleep 2
lp print.txt

