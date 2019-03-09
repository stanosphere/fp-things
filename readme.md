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

- mostly-adequate
  - I've basically stolen all the things from the mostly adequate guide
  - I've probably changed and added to them a bit
  - There are also some probably incomprehensible things that are me trying to figure out what on Earth is going on

- fanta-eel
  - Notes on Tom Harding's blog
    - Each on has its own folder eg `Setoid` 
    - Often I'll update my `algebraic-data-types` folder and give my classes the corresponding methods from the blog post
      - For instance I blessed my `List` class with the `lte` method after going through the `Ord` post
  - I'll hopefully end up doing some more of his exercises
  - I'll probably also invent som e exercises of my own
  - `algebraic-data-types` 
    - Contains algebraic data types
    - Sometimes stolen directly from the blog posts
    - Sometimes just made up by me
    - I'm trying to keep them up to date as I go through the blog but I will almost certainly forget some things

- scripts
  - Not gonna lie, I intend for this folder to be an absolute mess
  - It'll probably be the first place I go when I don't understand stuff
  - And I would quite like to have a reference to things I struggle with
  - Becasue I'll probably struggle with them again

## To Do (9/3/19)

- Make notes on the Semi group
  - implement `concat` on the stuff that it can be implemented on
  - promote `PaulSet` to a semigroup
    - two ways
    - 1) Implement `concat` as a set **intersection**
    - 2) Implement `concat` as a set **union**
- I might be able to use that `jsverify` thing that I've seen lying around
- Perhaps add tests for some of my other things
- Finish off work on PaulSet and the Setoid type in general
  - Should probably not use the tagged sum thing
  - originally I used it for my set because I thought the empty set should kind of be its own thing
  - removing it would get rid of the cata boiler plate so it's probs worth it
  - I wonder if I could use an applicative for when I'm mapping over a map when I'm verifying that the map method on `PaulSet` does what I want
- Modify List.equal so it doesn't break if the lists have different lengths
- Think about how you might test List's lte
- Implement a `powerSet` method on `PaulSet`
- Create an `OrderedSet`
  - I _could_ give it an ordered list as its internal structure actually