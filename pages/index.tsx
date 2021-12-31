/* eslint-disable react/no-unescaped-entities */

import Head from 'next/head'
import Image from 'next/image'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '../components/Button'

export default function Home() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="h-24 bg-black flex items-center p-4 text-lg font-display text-white justify-center uppercase">
          <FontAwesomeIcon className="fill-current text-white mr-3" icon={faCoins} size="lg" />
          Tactical Bankruptcy
        </div>
        <div className="flex-1 p-4 flex flex-col items-center">
          <p className="text-xl mb-2">Sean, you're up</p>
          <p className="text-5xl font-mono font-bold">0:05:13</p>

          <Button className="mt-5">Continue</Button>
        </div>
        <div className="h-24 bg-black flex items-center p-4 text-sm font-display text-white justify-center uppercase">
          Next Round
        </div>
      </div>
    </>
  )
}
