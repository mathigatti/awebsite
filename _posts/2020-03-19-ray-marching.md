---
layout: post
title:  Ray marching
category: shaders
img: https://i.pinimg.com/originals/f2/d2/3b/f2d23b843880a68af8b5d5d05ff69ae9.jpg
path: "analogy-ray-march"
 
---

### Context and definitions
 
Fragment shaders are a set of instructions executed by your GPU at once for every single pixel on your screen.
Each instruction receive as input the position of the pixel and returns a vector representing the color the pixel will be showing.

**Ray Marching** is a technique used for rendering 3D scenes in a screen. That means giving a color to each pixel.

In order to map the 2D canvas with a 3D scene, we introduce rays!

The main idea is that for each pixel of the screen, a ray is passing through it. All the rays starts from a viewport, so they have the same origin. And in order to recreate the scene, we define the trace (as we were walking through the ray) and see if we hit or miss an object in the scene.

<img src="/assets/img/analogy-ray-march.png" alt="Anlogy vision" style="height: 200px; width:500px;"/>

> This is a  good analogy for understanding it. 



Observe your computer and imagine that your eyes are emitting rays. Your mental perception of what you observing is in fact what I call canvas in the diagram. So the black cross (pixel) maps the red cross (computer).


The interesting part is the procedure of the algorithm.  For identifying this "hits" it does not use an analytical method bewteen the ray and the objects in the scene.
Instead it uses a distance estimator function that at each step along the ray identifies the nearest object until a fixed amount of steps, or until it reached some object which is close enough.

 <img src="/assets/img/distance-estimator.gif" alt="Distance Estimator" style="height: 300px; width:500px;"/>
 
 >In this example:
 
 >> At each step, you identify the minimal distance from the ray to all objects.
 
 >> Go back to the ray, repeat procedure.
 
 >>  In 7 steps reaches near enough.
 

#### It's all about distance estimator

  Code, code, code.
  
We will be using GLSL while exploring [this example](https://www.shadertoy.com/view/wdlyD8)  


#### mainImage function
  Receives as input fragCoord that is a 2d vector with the position of each pixel.
  
  After normalizing and postioning pixels, it is defined the camera origin (the viewport), the ray origin and the direction of the ray.
  Rotations are not necessary ( defined just to explore with transformations in a vector space).
  
  fragColor is the output of the function and renders a 4d vector for each pixel representing RGB and alpha component.
  And as we said, the color is given by aplying the trace function from the rayOrigin in each direction.
  
#### Ray marching algorithm in trace function 

Boundaries are set at the begining of the file.
```
#define MAX_STEPS 32
#define MAX_DIST 10.
#define SURF_DIST .001
```

For the trace, we  start our walking at 0; if we did not reach the maximun steps we keep on walking through the ray and find de distance to the scene (ds).
We stop if we are close enough to the surface, or if we walked enough.

```
vec3 trace(vec3 rayOrigin, vec3 dir) {
	float walk=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = rayOrigin + dir*walk;
        float dS = scene(p);
        walk += dS;
        if(walk>MAX_DIST || dS<SURF_DIST) break;
    }

    return hsv2rgb(vec3((1.-walk)/1.9));
}
 ```

 I customize the function to return some colors.
 
 
#### Comments on scene function

You define your scene by using or combining the distance estimator primitives to create the objects in your scene.

The ModSpace is used for repeating shapes, in one or more dimensions.



 
#### Sources for getting started
 [Distance Functions](http://iquilezles.org/www/articles/distfunctions/distfunctions.htm)
 
 
 [Syntopia - Ray tracing and polygons](http://blog.hvidtfeldts.net/index.php/2014/01/combining-ray-tracing-and-polygons/) 
 
 
 [Ray marching signed distance functions](http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/)
 
 
 
  [Inigo Quilez - articles](http://iquilezles.org/)
  
  
  [Patricio Gonzalez- book of shaders](https://thebookofshaders.com/)
 
 
### introduced to this technique by amazing workshop of [Char Stiles](http://charstiles.com/)
 
  
  

