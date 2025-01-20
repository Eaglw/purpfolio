import { onMount, type JSX } from 'solid-js'
import invariant from 'tiny-invariant'

import type { ImageJSON } from '../resources'
import { useState } from '../state'
import { loadGsap } from '../utils'
import { setupAndroidFallback } from '../../../src/utils/androidDetection'

export default function GalleryImage(props: {
  children?: JSX.Element
  load: boolean
  ij: ImageJSON
  loadingText: string
}): JSX.Element {
  let img: HTMLImageElement | undefined
  let loadingDiv: HTMLDivElement | undefined

  let _gsap: typeof gsap

  const [state] = useState()

  onMount(() => {
    loadGsap()
      .then((g) => {
        _gsap = g
        img?.addEventListener(
          'load',
          () => {
            invariant(img, 'ref must be defined')
            invariant(loadingDiv, 'loadingDiv must be defined')
            
            const fadeAnimation = setupAndroidFallback({
              opacity: 1,
              delay: 0.5,
              duration: 0.5,
              ease: 'power3.out'
            })

            if (state().index !== props.ij.index) {
              _gsap.set(img, { opacity: 1 })
              _gsap.set(loadingDiv, { opacity: 0 })
            } else {
              _gsap.to(img, fadeAnimation)
              _gsap.to(loadingDiv, { opacity: 0, duration: 0.5, ease: 'power3.in' })
            }
          },
          { once: true, passive: true }
        )
      })
      .catch((e) => {
        console.log(e)
      })
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
