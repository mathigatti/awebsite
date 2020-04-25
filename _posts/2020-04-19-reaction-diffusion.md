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
 
 
 
 For understanding it, imagine time is discrete: [0 1 2 3 4 5 6 7 ...]

 and for each moment t, for each x in space: you are defining C the concentration of ink accordingly to D a constant that represents the rate of diffusion; and N, value obtained from the difference of the value of x and a value representing its neighbourhood at the previous step, for example average.


 Our discrete interpretation of the formula would look something like this:

 `C(x, t) =  D * N(x, t-1)`

 Diffusion is normally thought of as a smooth and stable process.


### Two substances: reaction diffusion systems

  <div>
   <img src="/assets/img/reaction-diffusion/pattern1.jpg" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/pattern2.jpg" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/pattern3.jpg" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
  </div>
 
### Morphogenesis and Alan Turing 
In 1952 Alan turing presented [The chemical basis of Morphogenesis](http://www.dna.caltech.edu/courses/cs191/paperscs191/turing.pdf). 


In this paper he introduced a mathematical model(system of equations) which capture these  dynamics and showed how patterns are yield. These patterns matched to many found in nature.


He described systems which have two different substances, called them morphogens, that are diffusing at different rates and reacting together.


In the reaction, the substances works opposite to each other, as it is known in a growth-decay or activator-inhibtor relationship. And if as a pre-condition the reaction rate of the decay is faster the the growth rate,  you would expect a system to behave smoothly and stable a diffusion one, but here is where Turing introduced an amazing idea: known as "diffusion-driven instability", where the diffusion rates of substances would carry an asymetry thorughout the solution, so under certain parameters these instabilities cause the formation of patterned concentrations. 


For learning more on I suggest reading [pattern formation in the animal skin](http://hopf.chem.brandeis.edu/members_content/yanglingfa/pattern/Turing/The%20reaction-diffusion%20system_%20a%20mechanism%20for%20autonomous.pdf).

### Gray Scott Model
It is a simulation of reaction-diffusion system of 2 virtual chemicals in a 2D grid. This [tutorial](https://www.karlsims.com/rd.html) of Karl Sims explains how the algorithm works. He describes the simulation in terms of the following equations:

![equation](https://www.karlsims.com/rd-equation.png)

Making a analogy to our diffusion system interpretation, let's imagine time is discrete [0 1 2 3 4 5 6 7 ...].

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


### DIVING INTO PATTERNS


## Three.js  + WebGL implementation

It is important to notice that systems mentioned uses previous state as input to generate the next state. So for each pixel we will have a simulation step that will define new concentrations in terms on the previous value.

In order to make it possible I used the following rendereing technique.

### Introducing: 
   <img src="/assets/img/reaction-diffusion/ping-pong.gif" alt="Ping Pong" style="height: 250px; width:500px;"/>

  In three.js:

  - STEP 0: Set up 2 scenes, main one and buffered one. Initialize 2 textures : ping and pong. One for each respective scene.
  - STEP 1: Set texture ping to be rendered in the buffer scene.
  - STEP 2-3-4: Swap textures.
  - STEP 5: update scene materials.


## Experiments:

  I first started with a simple diffusion in order to understand how ping pong buffers worked.
  Three.js scripts are structured the same:

  - Setting up the scenes

    ```
      var camera,renderer,scene;
      function setupMainScene(){
        ...
      }

      var bufferScene ,ping ,pong, renderTargetParams; 
      function setupBufferScene(){
        ...

      //initialize textures ping and pong
      }
    ```

  -  Initializing scenes

  ```
  var bufferUniforms, bufferMaterial, plane, bufferObject;
    function initBufferScene(){
      bufferUniforms = {
        ...
    };
    
    bufferMaterial = new THREE.ShaderMaterial({
        //uniforms, and shaders involved
    });
    
    plane = new THREE.PlaneBufferGeometry( 2, 2 );
    bufferObject = new THREE.Mesh( plane, bufferMaterial );
    bufferScene.add(bufferObject); 
    }

    var finalMaterial,quad;
    function initMainScene(){
        finalMaterial =  new THREE.MeshBasicMaterial({map: ping}); [*]
        quad = new THREE.Mesh( plane, finalMaterial );
       scene.add(quad);
    }
  ```
  - Rendering the scene

  ```
  function render(){
    requestAnimationFrame( render );
    //Ping to buffer scene
    renderer.setRenderTarget(ping); [**]
    renderer.render(bufferScene, camera);

    renderer.setRenderTarget(null);
    renderer.clear();
        
    //Swap ping and pong
    let temp = pong;
    pong = ping;
    ping = temp;

    //Update uniforms 
      ...

    //Draw to screen
    renderer.render( scene, camera );
  }
  ```
[*] for Gray Scott model I changed form MeshBasicMaterial to Shader Material since I added an extra color shader.


[**] I found this a little bit tricky


# Simple diffusion system:
 Code is available [here](https://github.com/solsarratea/visualizer/tree/master/03-diffusion)
  <div>
   <img src="/assets/img/reaction-diffusion/dif0.png" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/dif1.png" style="height: 100px; width:190px;"/>
  </div>

### [YOU CAN TRY THE DEMO HERE](https://visualizer.solquemal.com/03-diffusion/)  
 

# Gray Scott model:
  Code is available [here](https://github.com/solsarratea/visualizer/tree/master/04-gray-scott). For rendering just patterns, interpolation value should be 0.
  
   <div>
   <img src="/assets/img/reaction-diffusion/gs0.png" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/gs1.png" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/gs3.png" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
  </div>
 

# Mapped on 3D-Surfaces:
   Added a vertex shader for meshing to geometry. Experimental code is found in [here](https://github.com/solsarratea/learn-three)

   <div>
    <img src="/assets/img/reaction-diffusion/torus0.png" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
    <img src="/assets/img/reaction-diffusion/torus1.png" alt ="Reaction dffusion" style="height: 100px; width:190px;"/>
   </div>

# Gray Scott model mixed with video capture:

  <div>
   <img src="/assets/img/reaction-diffusion/video1.png" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/rotting2.png" style="height: 100px; width:190px;"/>
   <img src="/assets/img/reaction-diffusion/video0.png" alt="Reaction diffusion" style="height: 100px; width:190px;"/>
  </div>
 


### [YOU CAN TRY THE DEMO HERE](https://visualizer.solquemal.com/04-gray-scott/)  
