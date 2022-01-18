import Image from 'next/image'

import { PlayerMarker } from '../components/PlayerMarker'

import { players } from '../services/players'
import { factions } from '../services/factions'
import { FactionBadge } from '../components/FactionBadge'

export default function Sandbox(): JSX.Element {
  return (
    <div className="flex gap-2 flex-wrap">
      {factions.map(faction => (
        <FactionBadge key={faction.id} factionId={faction.id} />
      ))}
    </div>
  )
}
