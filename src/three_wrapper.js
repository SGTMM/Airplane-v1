import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import Stats from 'three/examples/jsm/libs/stats.module'

window.THREE = THREE
window.OrbitControls = OrbitControls
window.PointerLockControls = PointerLockControls
window.GLTFLoader = GLTFLoader
window.ConvexGeometry = ConvexGeometry
window.Stats = Stats
window.RGBELoader = RGBELoader
window.CSS2DRenderer = CSS2DRenderer
window.CSS2DObject = CSS2DObject

import { BloomEffect, GodRaysEffect, EffectComposer, EffectPass, RenderPass, ShaderPass, BloomEffect, SelectiveBloomEffect, Selection, BlendFunction } from "postprocessing";

window.BloomEffect = BloomEffect
window.EffectComposer = EffectComposer
window.EffectPass = EffectPass
window.RenderPass = RenderPass
window.GodRaysEffect = GodRaysEffect
window.BloomEffect = BloomEffect
window.SelectiveBloomEffect = SelectiveBloomEffect
window.Selection = Selection
window.ShaderPass = ShaderPass
window.BlendFunction = BlendFunction


import vertexShader from './shader/vertex.glsl'
import fragmentShader from './shader/fragment.glsl'

window.vertexShader = vertexShader
window.fragmentShader = fragmentShader

import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';

window.VRButton = VRButton

import { io } from "socket.io-client";

window.io = io

/* window.raycastWorker = new Worker(new URL('raycastWorker.js',
    import.meta.url))
 */