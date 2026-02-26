import { createEffect, onMount } from 'solid-js'

import { useState } from '../state'
import { expand } from '../utils'

/**
 * Nav component
 */

export default function Nav(): null {
  const [state, { incThreshold, decThreshold }] = useState()

  onMount(() => {
    // threshold div
    const thresholdDiv = document.getElementsByClassName('threshold')[0] as HTMLDivElement
    if (!thresholdDiv) return

    // threshold nums span
    const thresholdDispNums = Array.from(
      thresholdDiv.getElementsByClassName('num')
    ) as HTMLSpanElement[]
    // threshold buttons
    const decButton = thresholdDiv
      .getElementsByClassName('dec')
      .item(0) as HTMLButtonElement
    const incButton = thresholdDiv
      .getElementsByClassName('inc')
      .item(0) as HTMLButtonElement
    
    // index div
    const indexDiv = document.getElementsByClassName('index').item(0) as HTMLDivElement
    if (!indexDiv) return

    // index nums span
    const indexDispNums = Array.from(
      indexDiv.getElementsByClassName('num')
    ) as HTMLSpanElement[]

    decButton.onclick = () => {
      decThreshold()
    }
    incButton.onclick = () => {
      incThreshold()
    }

    createEffect(() => {
      const indexValue = expand(state().index + 1)
      const indexLength = expand(state().length)
      const thresholdValue = expand(state().threshold)

      indexDispNums.forEach((e: HTMLSpanElement, i: number) => {
        if (i < 4) {
          e.innerText = indexValue[i]
        } else {
          e.innerText = indexLength[i - 4]
        }
      })

      thresholdDispNums.forEach((e: HTMLSpanElement, i: number) => {
        e.innerText = thresholdValue[i]
      })
    })
  })

  return null
}
