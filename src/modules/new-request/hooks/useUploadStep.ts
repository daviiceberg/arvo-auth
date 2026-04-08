'use client'

import { useState } from 'react'

export function useUploadStep() {
  const [uploadState, setUploadState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleUpload = (onComplete: () => void) => {
    setUploadState('loading')
    setUploadProgress(0)
    // Simulate progress: fast start, decelerate near end
    const milestones = [8, 20, 35, 50, 63, 74, 83, 89, 94, 98]
    milestones.forEach((target, i) => {
      setTimeout(() => { setUploadProgress(target); }, (i + 1) * 180)
    })
    setTimeout(() => {
      setUploadProgress(100)
      setUploadState('done')
      setTimeout(() => { onComplete(); }, 400)
    }, 2200)
  }

  const resetUpload = () => {
    setUploadState('idle')
    setUploadProgress(0)
  }

  const zoomIn = () => { setZoom(z => Math.min(200, z + 10)); }
  const zoomOut = () => { setZoom(z => Math.max(50, z - 10)); }
  const rotate = () => { setRotation(r => (r + 90) % 360); }

  return {
    uploadState,
    uploadProgress,
    dragOver,
    setDragOver,
    zoom,
    rotation,
    handleUpload,
    resetUpload,
    zoomIn,
    zoomOut,
    rotate,
  }
}
