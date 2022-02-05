import Image from 'next/image'

import { PlayerMarker } from '../components/PlayerMarker'

import { players } from '../services/players'
import { factions } from '../services/factions'
import { FactionBadge } from '../components/FactionBadge'
import { StatBadge } from '../components/StatBadge'
import { CombatStars } from '../components/CombatStars'
import { Button } from '../components/Button'

export default function Sandbox(): JSX.Element {
  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="flex flex-wrap gap-2">
        <StatBadge label="Score" />
        <StatBadge label="Time" value="05:55" color="gray" />
        <StatBadge
          label={
            <div className="flex items-center gap-2">
              <CombatStars />
              <span>Combat and Upkeep</span>
            </div>
          }
          color="orange"
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        {factions.map(faction => (
          <FactionBadge key={faction.id} factionId={faction.id} />
        ))}
      </div>
      <div className="flex gap-2 flex-wrap bg-gray-400 p-4">
        <Button className="w-20" color="black">
          Done
        </Button>
        <Button className="w-20" color="white">
          Pass
        </Button>
      </div>
    </div>
  )
}
