/* eslint-disable react/no-unescaped-entities */

import Head from 'next/head'
import Image from 'next/image'
import { faBomb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '../components/Button'

export default function Home() {
  return (
    <>
      <div className="h-screen flex flex-col">
        <div className="h-24 bg-black flex items-center p-4 text-lg text-white">
          Tactical Bankruptcy
        </div>
        <div className="flex-1 p-4">
          <p className="text-3xl font-bold underline mb-4">
            <FontAwesomeIcon className="fill-current text-indigo-500" icon={faBomb} size="lg" />
            Hello world!
          </p>

          <Button>Continue</Button>
        </div>
        <div className="h-24 bg-black"></div>
      </div>
    </>
  )
}
