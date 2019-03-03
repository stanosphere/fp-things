# FP Things

This repo is going to be quite messy for now. It's basically just me playing around with functional programming things in JavaScript. I think a lot of this might just end up as me taking notes about things and also implementing some lovely functional stuff of my own. 

## Resources

- **Mostly Adequate Guide to Functional Programming**
  - https://github.com/MostlyAdequate/mostly-adequate-guide 
  - This is a great book
  - It starts out by explaining how we can write programs using nothing more than functions and compositions
  - And eventually gets into the mysterious land of **Algebraic Data Types**
  - It draws a lot of inspiration in the latter chapters from https://github.com/fantasyland/fantasy-land

- Fantasy Land
  - https://github.com/fantasyland/fantasy-land
  - This is a specification for all the usual Algebraic Data Types in JavaScript

- **Fantas, Eel, and Specification blog by Tom Harding**
  - http://www.tomharding.me/2017/03/03/fantas-eel-and-specification/
  - This is actually amazing
  - Kind of gives an overview of all these wonderful things from scratch
  - Seems to go through the **Fantasy Land Spec** and try to explain it to normal people like me

- Daggy
  - https://github.com/fantasyland/daggy
  - Lets you create **Sum Types** in JS
  - I use it becasue it's in the fantas blog. Also it is pretty cool

- Project Awesome 
  - https://project-awesome.org/stoeffel/awesome-fp-js
  - A rather eclectic list of fp resources that I have found useful :) 

- Fira Code
  - https://github.com/tonsky/FiraCode
  - This literally just makes my arrows look pretty

- lodash/fp
  - https://github.com/lodash/lodash/wiki/FP-Guide
  - For all the ususal fp utils
  - My main reason for using this is that it's what I've used in both my jobs

## What is here?

- algebraic-data-structures
  - I've basically stolen all the things from the mostly adequate guide
  - I've probably changed and added to them a bit
  - There are also some probably incomprehensible things that are me trying to figure out what on Earth is going on

- fanta-eel
  - Notes on Tom Harding's blog
  - I'll hopefully end up doing some more of his exercises
  - I've probably also just generally messed around with stuff

- scripts
  - Not gonna lie, I intend for this folder to be an absolute mess
  - It'll probably be the first place I go when I don't understand stuff
  - And I would quite like to have a reference to things I struggle with
  - Becasue I'll probably struggle with them again

## To Do (3/3/19)

- Convert my logs into proper tests
  - I'm looking at you PaulSet file!
  - I might be able to use that jsverify thing that I've seen lying around
- Perhaps add tests for some of my other things
- Finish off work on PaulSet and the Setoid type in general
- Move on to the next thing in Tom's blog: Ords!
- Consider using something other than lodash/fp
  - Although it is good to use what I use at work every day probably
