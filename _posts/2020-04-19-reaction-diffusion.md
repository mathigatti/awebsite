---
layout: post
title:  Reaction Diffusion Systems - introduction
category: shaders
img: "assets/img/reaction-diffusion/pattern4.jpg"
 
---

## Context and definitions

 **Reaction diffusion systems** are mathematical models which  study the behaviour of different phenomas, such as the variation of concentration of one or more chemical substances. 
 Behavior can be understand as the change in space and time.

Let's dive into examles:

### Reducing to one substance: difussion system

  <div style="display: flex; justify-content:space-around">
    <div style="padding:.5em">When throwing ink into water, the ink moves from higher concentrations to lower. This proccess is called diffusion and can be matematically modelled with the following equation: </div>
  <img src="https://i.pinimg.com/originals/7e/57/7d/7e577dd75ec4865cada599ba7d90acda.gif" alt="ink" style="height: 100px; width:190px;"/> 
  </div>
 <img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/7c223846a05763066b3ecbcda30bf3282438f573" alt="ink"/>
 
 
 
 For understnding it, imagine time is discrete: [0 1 2 3 4 5 6 7 ...]

 and for each moment t, for each x in space: you are defining C the concentration of ink accordingly to D a constant that represents the rate of diffusion; and N, value obtained from the difference of the value of x and a value representing it neighbourhood at the previous step, for example average.


 Our discrete interpretation of the formula would look something like this:

 `C(x, t) =  D * N(x, t-1)`


### Two substances: reaction diffusion systems

  <div>
   <img src="/assets/img/reaction-diffusion/pattern1.jpg" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/pattern2.jpg" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/pattern3.jpg" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
  </div>
 
### Morphogenesis and Alan Turing 
In 1952 Alan turing presented [The chemical basis of Morphogenesis](http://www.dna.caltech.edu/courses/cs191/paperscs191/turing.pdf). In this paper he described systems that have two different substances, called morphogens, that are diffusing at different rates and reacting together. He introduced a mathematical model, equations which capture these  dynamics and showed how patterns are yield. These patterns matched to many found in nature.

For learning more on I suggest reading [pattern formation in the animal skin](http://hopf.chem.brandeis.edu/members_content/yanglingfa/pattern/Turing/The%20reaction-diffusion%20system_%20a%20mechanism%20for%20autonomous.pdf).

### Gray Scott Model
It is a simulation of reaction-diffusion system of 2 virtual chemicals in a 2D grid. This [tutorial](https://www.karlsims.com/rd.html) of Karl Sims explains how the algorithm works. He describes the simulation in terms of the following equations:

![equation](https://www.karlsims.com/rd-equation.png)

Making analogy to our diffusion system interpretation, let's imagine time is discrete [0 1 2 3 4 5 6 7 ...].

Essentialy, for each cell(x,y) in your grid you have A concentration of one chemical, and B concentration of the other. And you are updating the values according to: it previous value, how it diffuse and how they react.

Reaction depends on 2 constant value: feed and kill rate, it is important to notice that only a special combinations of these values evolves in a pattern.

[This is a grat resource to explore those values. ](http://mrob.com/pub/comp/xmorphia/index.html)

You will see this a grid as these:
<div style="display: flex; justify-content:space-around">
    <img src="http://mrob.com/pub/comp/xmorphia/xmorphia-parameter-map.jpg" alt="Reaction diffusion" style="height: 190px; width:190px;"/>
    <div style="padding: 0em .9em">
    Where the horizontal axis are the kill values, and the vertical the feed ones.
    By clicking over {kill, feed} cell, you will see how the system will evolve.
    The green-ish area, are the rates that we eventually would like to explore in our simulation. 
    </div>
</div>

 Or can try values with [Pearson's classification](http://mrob.com/pub/comp/xmorphia/pearson-classes.html)
