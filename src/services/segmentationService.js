/**
 * Client-side image segmentation service using MediaPipe Selfie Segmentation
 * Creates silhouettes by detecting the person outline in photos
 */

import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'

let segmentationModel = null
let isInitializing = false
let initPromise = null
let scriptLoaded = false

/**
 * Load MediaPipe script from CDN
 */
async function loadMediaPipeScript() {
  if (scriptLoaded) return
  if (typeof window.SelfieSegmentation !== 'undefined') {
    scriptLoaded = true
    return
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load MediaPipe script'))
    document.head.appendChild(script)
  })
}

/**
 * Initialize the MediaPipe segmentation model (lazy loaded)
 * @returns {Promise<void>}
 */
export async function initSegmentation() {
  if (segmentationModel) return
  if (isInitializing) return initPromise

  isInitializing = true
  initPromise = (async () => {
    try {
      segmentationModel = new SelfieSegmentation({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        }
      })

      segmentationModel.setOptions({
        modelSelection: 1, // 0 = landscape (faster), 1 = general (more accurate)
        selfieMode: false,
      })

      // Wait for model to be ready by sending a dummy image
      await new Promise((resolve) => {
        segmentationModel.onResults(() => {
          resolve()
        })
        
        // Create a small dummy image
        const canvas = document.createElement('canvas')
        canvas.width = 1
        canvas.height = 1
        segmentationModel.send({ image: canvas })
      })

      console.log('MediaPipe Segmentation model loaded successfully')
    } catch (error) {
      console.error('Failed to initialize segmentation:', error)
      segmentationModel = null
      throw error
    } finally {
      isInitializing = false
    }
  })()

  return initPromise
}

/**
 * Create a silhouette from an image element
 * @param {HTMLImageElement} imgElement - The source image
 * @param {Object} options - Silhouette options
 * @param {string} options.backgroundColor - Background color (default: 'white')
 * @param {string} options.silhouetteColor - Person silhouette color (default: 'black')
 * @returns {Promise<string>} Data URL of the silhouette image
 */
export async function createSilhouette(imgElement, options = {}) {
  const {
    backgroundColor = 'black',  // Changed to black
    silhouetteColor = 'white'    // Changed to white - person will be white
  } = options

  if (!segmentationModel) {
    await initSegmentation()
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Set canvas size to match image
    canvas.width = imgElement.naturalWidth || imgElement.width
    canvas.height = imgElement.naturalHeight || imgElement.height

    segmentationModel.onResults((results) => {
      try {
        // The segmentation mask is an ImageData-like object
        // We need to read from its data buffer, not iterate it directly
        const maskCanvas = document.createElement('canvas')
        const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })
        maskCanvas.width = canvas.width
        maskCanvas.height = canvas.height
        
        // Draw mask to temporary canvas to get pixel data
        maskCtx.drawImage(results.segmentationMask, 0, 0)
        const maskImageData = maskCtx.getImageData(0, 0, canvas.width, canvas.height)
        const maskData = maskImageData.data
        
        // Create image data
        const imageData = ctx.createImageData(canvas.width, canvas.height)
        
        // Convert colors to RGB
        const tempCanvas = document.createElement('canvas')
        const tempCtx = tempCanvas.getContext('2d')
        tempCanvas.width = 1
        tempCanvas.height = 1
        
        // Get background color RGB
        tempCtx.fillStyle = backgroundColor
        tempCtx.fillRect(0, 0, 1, 1)
        const bgData = tempCtx.getImageData(0, 0, 1, 1).data
        const [bgR, bgG, bgB] = bgData
        
        // Get silhouette color RGB
        tempCtx.fillStyle = silhouetteColor
        tempCtx.fillRect(0, 0, 1, 1)
        const silData = tempCtx.getImageData(0, 0, 1, 1).data
        const [silR, silG, silB] = silData

        // Apply mask: where person exists (high mask value), paint silhouette color
        // The mask is RGBA where R channel contains the mask value (0-255)
        let personPixels = 0
        let backgroundPixels = 0
        
        for (let i = 0; i < maskData.length; i += 4) {
          // Read mask value from red channel (0-255)
          const maskValue = maskData[i]
          
          // Threshold: if mask > 128 (half of 255), it's person
          if (maskValue > 128) {
            // Person detected - paint silhouette color (white)
            imageData.data[i] = silR
            imageData.data[i + 1] = silG
            imageData.data[i + 2] = silB
            imageData.data[i + 3] = 255
            personPixels++
          } else {
            // Background - paint background color (black)
            imageData.data[i] = bgR
            imageData.data[i + 1] = bgG
            imageData.data[i + 2] = bgB
            imageData.data[i + 3] = 255
            backgroundPixels++
          }
        }
        
        ctx.putImageData(imageData, 0, 0)
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png')
        resolve(dataUrl)
      } catch (error) {
        console.error('[Segmentation] Error creating silhouette:', error)
        reject(error)
      }
    })

    // Send image to segmentation model
    segmentationModel.send({ image: imgElement })
  })
}

/**
 * Batch process multiple images into silhouettes
 * @param {Array<{imgUrl: string, id: string}>} images - Array of image objects
 * @param {Function} progressCallback - Called with progress (0-1)
 * @returns {Promise<Array<{id: string, silhouetteUrl: string, error?: string}>>}
 */
export async function batchCreateSilhouettes(images, progressCallback = null) {
  // Initialize model first
  await initSegmentation()

  const results = []
  
  for (let i = 0; i < images.length; i++) {
    const { imgUrl, id } = images[i]
    
    try {
      // Load image
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = imgUrl
      await img.decode()

      // Create silhouette
      const silhouetteUrl = await createSilhouette(img)
      
      results.push({ id, silhouetteUrl })
    } catch (error) {
      console.error(`Failed to create silhouette for ${id}:`, error)
      results.push({ id, silhouetteUrl: null, error: error.message })
    }

    // Report progress
    if (progressCallback) {
      progressCallback((i + 1) / images.length)
    }
  }

  return results
}

/**
 * Check if segmentation is supported in current browser
 * @returns {boolean}
 */
export function isSegmentationSupported() {
  // Check for required browser features
  return !!(
    typeof document !== 'undefined' &&
    document.createElement &&
    HTMLCanvasElement &&
    CanvasRenderingContext2D
  )
}
