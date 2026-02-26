import { type gsap } from 'gsap'
import {
  createEffect,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  type Accessor,
  type JSX,
  type Setter
} from 'solid-js'
import { createStore } from 'solid-js/store'
import { type Swiper } from 'swiper'
import invariant from 'tiny-invariant'

import { type ImageJSON } from '../resources'
import { useState } from '../state'
import { loadGsap, type Vector } from '../utils'

import GalleryImage from './galleryImage'
import GalleryNav, { capitalizeFirstLetter } from './galleryNav'

function removeDuplicates<T>(arr: T[]): T[] {
  if (arr.length < 2) return arr // optimization
  return [...new Set(arr)]
}

async function loadSwiper(): Promise<typeof Swiper> {
  const s = await import('swiper')
  return s.Swiper
}

export default function Gallery(props: {
  children?: JSX.Element
  ijs: ImageJSON[]
  closeText: string
  loadingText: string
  isAnimating: Accessor<boolean>
  setIsAnimating: Setter<boolean>
  isOpen: Accessor<boolean>
  setIsOpen: Setter<boolean>
  setScrollable: Setter<boolean>
}): JSX.Element {
  // variables
  let _gsap: typeof gsap | undefined
  let _swiper: Swiper | undefined
  let initPromise: Promise<void> | undefined

  let curtain: HTMLDivElement | undefined
  let gallery: HTMLDivElement | undefined
  let galleryInner: HTMLDivElement | undefined

  // eslint-disable-next-line solid/reactivity
  const _loadingText = capitalizeFirstLetter(props.loadingText)

  // states
  let lastIndex = -1
  let mounted = false
  let hasOpenedGallery = false
  let navigateVector: Vector = 'none'

  const [state, { setIndex }] = useState()
  const [libLoaded, setLibLoaded] = createSignal(false)
  // eslint-disable-next-line solid/reactivity
  const [loads, setLoads] = createStore(Array<boolean>(props.ijs.length).fill(false))

  // helper functions
  const ensureLibrariesLoaded: () => Promise<void> = async () => {
    if (libLoaded()) return
    if (initPromise !== undefined) {
      await initPromise
      return
    }

    initPromise = Promise.all([loadGsap(), loadSwiper()])
      .then(([g, S]) => {
        invariant(galleryInner, 'galleryInner is not defined')
        _gsap = g
        if (_swiper === undefined) {
          _swiper = new S(galleryInner, { spaceBetween: 20 })
          _swiper.on('slideChange', ({ realIndex }) => {
            setIndex(realIndex)
          })
        }
        setLibLoaded(true)
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
      .finally(() => {
        initPromise = undefined
      })

    await initPromise
  }

  const slideUp: () => void = () => {
    // isAnimating is prechecked in isOpen effect
    if (!libLoaded() || !mounted || _gsap === undefined) return
    hasOpenedGallery = true
    props.setIsAnimating(true)

    invariant(curtain, 'curtain is not defined')
    invariant(gallery, 'gallery is not defined')

    _gsap.to(curtain, {
      opacity: 1,
      duration: 1
    })

    _gsap.to(gallery, {
      y: 0,
      ease: 'power3.inOut',
      duration: 1,
      delay: 0.4
    })

    setTimeout(() => {
      props.setScrollable(false)
      props.setIsAnimating(false)
    }, 1200)
  }

  const slideDown: () => void = () => {
    // isAnimating is prechecked in isOpen effect
    if (_gsap === undefined) {
      props.setScrollable(true)
      props.setIsAnimating(false)
      lastIndex = -1
      return
    }

    props.setIsAnimating(true)

    invariant(gallery, 'curtain is not defined')
    invariant(curtain, 'gallery is not defined')

    _gsap.to(gallery, {
      y: '100%',
      ease: 'power3.inOut',
      duration: 1
    })

    _gsap.to(curtain, {
      opacity: 0,
      duration: 1.2,
      delay: 0.4
    })

    setTimeout(() => {
      // cleanup
      props.setScrollable(true)
      props.setIsAnimating(false)
      lastIndex = -1
    }, 1400)
  }

  const galleryLoadImages: () => void = () => {
    let activeImagesIndex: number[] = []
    const _state = state()
    const currentIndex = _state.index
    const nextIndex = Math.min(currentIndex + 1, _state.length - 1)
    const prevIndex = Math.max(currentIndex - 1, 0)
    switch (navigateVector) {
      case 'next':
        activeImagesIndex = [nextIndex]
        break
      case 'prev':
        activeImagesIndex = [prevIndex]
        break
      case 'none':
        activeImagesIndex = [currentIndex, nextIndex, prevIndex]
        break
    }
    setLoads(removeDuplicates(activeImagesIndex), true)
  }

  const changeSlide: (slide: number) => void = (slide) => {
    // we are already in the gallery, don't need to
    // check mounted or libLoaded
    galleryLoadImages()
    _swiper?.slideTo(slide, 0)
  }

  // effects
  onMount(() => {
    mounted = true
    void ensureLibrariesLoaded()
  })

  onCleanup(() => {
    _swiper?.destroy(true, true)
    _swiper = undefined
  })

  createEffect(
    on(
      () => {
        state()
      },
      () => {
        const i = state().index
        if (i === lastIndex)
          return // change slide only when index is changed
        else if (lastIndex === -1)
          navigateVector = 'none' // lastIndex before set
        else if (i < lastIndex)
          navigateVector = 'prev' // set navigate vector for galleryLoadImages
        else if (i > lastIndex)
          navigateVector = 'next' // set navigate vector for galleryLoadImages
        else navigateVector = 'none' // default
        changeSlide(i) // change slide to new index
        lastIndex = i // update last index
      }
    )
  )

  createEffect(
    on(
      () => {
        return [props.isOpen(), libLoaded()] as const
      },
      ([isOpen, isLibLoaded]) => {
        if (!isLibLoaded) {
          void ensureLibrariesLoaded()
          return
        }
        if (props.isAnimating()) return
        if (isOpen) slideUp()
        else if (hasOpenedGallery) slideDown()
      },
      { defer: true }
    )
  )

  return (
    <>
      <div ref={gallery} class="gallery">
        <div ref={galleryInner} class="galleryInner">
          <div class="swiper-wrapper">
            <For each={props.ijs}>
              {(ij, i) => (
                <div class="swiper-slide">
                  <GalleryImage load={loads[i()]} ij={ij} loadingText={_loadingText} />
                </div>
              )}
            </For>
          </div>
        </div>
        <GalleryNav
          closeText={props.closeText}
          isAnimating={props.isAnimating}
          setIsOpen={props.setIsOpen}
        />
      </div>
      <div ref={curtain} class="curtain" />
    </>
  )
}
