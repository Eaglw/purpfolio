import { onMount, type JSX } from 'solid-js'
import invariant from 'tiny-invariant'

import type { ImageJSON } from '../resources'
import { useState } from '../state'
import { loadGsap } from '../utils'

export default function GalleryImage(props: {
  children?: JSX.Element
  load: boolean
  ij: ImageJSON
  loadingText: string
}): JSX.Element {
  let img: HTMLImageElement | undefined
  let loadingDiv: HTMLDivElement | undefined
  let revealed = false

  let _gsap: typeof gsap | undefined

  const [state] = useState()

  const revealImage: () => void = () => {
    if (revealed) return
    revealed = true

    invariant(img, 'ref must be defined')
    invariant(loadingDiv, 'loadingDiv must be defined')

    if (_gsap === undefined) {
      img.style.opacity = '1'
      loadingDiv.style.opacity = '0'
      return
    }

    if (state().index !== props.ij.index) {
      _gsap.set(img, { opacity: 1 })
      _gsap.set(loadingDiv, { opacity: 0 })
    } else {
      _gsap.to(img, {
        opacity: 1,
        delay: 0.5,
        duration: 0.5,
        ease: 'power3.out'
      })
      _gsap.to(loadingDiv, { opacity: 0, duration: 0.5, ease: 'power3.in' })
    }
  }

  onMount(() => {
    loadGsap()
      .then((g) => {
        _gsap = g
      })
      .catch((e) => {
        console.log(e)
      })
    img?.addEventListener(
      'load',
      () => revealImage(),
      { once: true, passive: true }
    )

    img?.addEventListener(
      'error',
      () => revealImage(),
      { once: true, passive: true }
    )

    // Chrome Android can serve cached images before the load listener runs.
    // If it's already complete, reveal immediately to avoid a stuck opacity: 0 state.
    if (img?.complete) {
      setTimeout(() => {
        revealImage()
      }, 0)
    }
  })

  return (
    <>
      <div class="slideContainer">
        <img
          ref={img}
          {...(props.load && { src: props.ij.hiUrl })}
          height={props.ij.hiImgH}
          width={props.ij.hiImgW}
          data-src={props.ij.hiUrl}
          alt={props.ij.alt}
          style={{ opacity: 0 }}
        />
        <div ref={loadingDiv} class="loadingText">
          {props.loadingText}
        </div>
      </div>
    </>
  )
}
