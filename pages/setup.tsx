import classNames from 'classnames'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '../components/Button'
import { FactionBadge } from '../components/FactionBadge'
import { factions } from '../services/factions'
import { useGameContext } from '../services/useGameContext'

export default function Setup() {
  const router = useRouter()
  const { state, dispatch } = useGameContext()
  const { players } = state
  const {
    values: { name, factionId },
    resetForm,
    setFieldValue,
    handleSubmit,
  } = useFormik({
    onSubmit: data => {
      console.log('submitting')
      dispatch({ type: 'ADD_PLAYER', data })
      resetForm()
    },
    initialValues: { name: '', factionId: null },
  })

  useHotkeys('cmd+z, ctrl+z', () => dispatch({ type: 'UNDO' }), [dispatch])
  useHotkeys('cmd+shift+z, ctrl+shift+z, cmd+y, ctrl+y', () => dispatch({ type: 'REDO' }), [
    dispatch,
  ])

  return (
    <div className="flex flex-col h-screen">
      <div className="h-16 bg-black">Sup</div>
      <form className="flex-grow flex flex-col max-w-5xl m-auto pt-10" onSubmit={handleSubmit}>
        <div className="grid grid-cols-6 gap-4">
          {factions.map(faction => {
            const selectedFactionColors = players.map(
              player => factions.find(faction => faction.id === player.factionId).color,
            )
            const disabled = selectedFactionColors.includes(faction.color)

            return (
              <FactionBadge
                type="button"
                key={faction.id}
                className={classNames(
                  'cursor-pointer transform hover:scale-105 disabled:opacity-5 disabled:scale-90 disabled:hover:scale-90 disabled:cursor-not-allowed',
                  !disabled && factionId !== null && faction.id === factionId && 'scale-105',
                  !disabled &&
                    factionId !== null &&
                    faction.id !== factionId &&
                    'scale-90 hover:scale-100 opacity-60',
                )}
                disabled={disabled}
                factionId={faction.id}
                onClick={() => {
                  setFieldValue('factionId', faction.id)
                }}
              />
            )
          })}
        </div>
        <div className="grid gap-4 w-64 m-auto">
          <div className="text-md uppercase text-gray-500">Name</div>
          <div className="flex gap-2">
            <input
              className="h-12 bg-gray-100 px-4 uppercase"
              value={name}
              onChange={({ currentTarget }) => setFieldValue('name', currentTarget.value)}
            />
            <Button color="black" type="submit" disabled={!name || !factionId}>
              Add Player
            </Button>
          </div>
        </div>
      </form>
      <div className="bg-black h-20 flex items-center justify-end px-4">
        <Button disabled={players.length < 2} onClick={() => router.push('/play')}>
          Start game
        </Button>
      </div>
    </div>
  )
}
