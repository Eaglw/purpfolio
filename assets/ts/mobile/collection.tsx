import {
  For,
  createEffect,
  on,
  type Accessor,
  type JSX,
  type Setter
} from 'solid-js'

import type { ImageJSON } from '../resources'
import { useState } from '../state'

import type { MobileImage } from './layout'

function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function Collection(props: {
  children?: JSX.Element
  ijs: ImageJSON[]
  isAnimating: Accessor<boolean>
  isOpen: Accessor<boolean>
  setIsOpen: Setter<boolean>
}): JSX.Element {
  // variables
  // eslint-disable-next-line solid/reactivity
  const imgs: MobileImage[] = Array<MobileImage>(props.ijs.length)

  // states
  const [state, { setIndex }] = useState()

  // helper functions
  const handleClick: (i: number) => void = (i) => {
    if (props.isAnimating()) return
    setIndex(i)
    props.setIsOpen(true)
  }

  const scrollToActive: () => void = () => {
    imgs[state().index].scrollIntoView({ behavior: 'auto', block: 'center' })
  }

  createEffect(
    on(
      () => {
        props.isOpen()
      },
      () => {
        if (!props.isOpen()) scrollToActive() // scroll to active when closed
      },
      { defer: true }
    )
  )

  return (
    <>
      <div class="collection">
        <For each={props.ijs}>
          {(ij, i) => (
            <img
              ref={imgs[i()]}
              src={ij.loUrl}
              height={ij.loImgH}
              width={ij.loImgW}
              data-src={ij.loUrl}
              loading="lazy"
              decoding="async"
              alt={ij.alt}
              style={{
                transform: `translate3d(${i() !== 0 ? getRandom(-25, 25) : 0}%, ${i() !== 0 ? getRandom(-35, 35) : 0}%, 0)`
              }}
              onClick={() => {
                handleClick(i())
              }}
              onKeyDown={() => {
                handleClick(i())
              }}
            />
          )}
        </For>
      </div>
    </>
  )
}
