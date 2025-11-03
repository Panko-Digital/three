import '@testing-library/jest-dom'
import 'vitest-canvas-mock'
import ResizeObserver from 'resize-observer-polyfill'

// Add ResizeObserver polyfill
globalThis.ResizeObserver = ResizeObserver

// Mock WebGL context for Three.js testing
/* eslint-disable @typescript-eslint/no-explicit-any */
HTMLCanvasElement.prototype.getContext = (() => {
    const originalGetContext = HTMLCanvasElement.prototype.getContext
    return function (this: HTMLCanvasElement, contextId: string, ...args: any[]): any {
        if (contextId === 'webgl' || contextId === 'webgl2') {
            return {
                canvas: this,
                getExtension: () => null,
                getParameter: () => null,
                getShaderPrecisionFormat: () => ({ precision: 1, rangeMin: 1, rangeMax: 1 }),
                createProgram: () => ({}),
                createShader: () => ({}),
                attachShader: () => { },
                linkProgram: () => { },
                getProgramParameter: () => true,
                getUniformLocation: () => null,
                getAttribLocation: () => 0,
                enableVertexAttribArray: () => { },
                vertexAttribPointer: () => { },
                useProgram: () => { },
                enable: () => { },
                disable: () => { },
                depthFunc: () => { },
                clear: () => { },
                clearColor: () => { },
                viewport: () => { },
                drawArrays: () => { },
                drawElements: () => { },
                createBuffer: () => ({}),
                bindBuffer: () => { },
                bufferData: () => { },
                createTexture: () => ({}),
                bindTexture: () => { },
                texParameteri: () => { },
                texImage2D: () => { },
                activeTexture: () => { },
                uniform1i: () => { },
                uniformMatrix4fv: () => { },
            }
        }
        return (originalGetContext as any).apply(this, [contextId, ...args])
    }
})() as any
/* eslint-enable @typescript-eslint/no-explicit-any */
