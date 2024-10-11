#!/bin/bash

sleep 2
enscript -B -f "Helvetica@12" -p - print.txt | lp

