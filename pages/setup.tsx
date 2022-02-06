import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import * as Yup from 'yup'

import { Button } from '../components/Button'
import { FactionBadge } from '../components/FactionBadge'
import { IconButton } from '../components/IconButton'
import { Input } from '../components/Input'
import { StatBadge } from '../components/StatBadge'
import { factions } from '../services/factions'
import { getOrderedPlayers } from '../services/selectors'
import { useGameContext } from '../services/useGameContext'

interface PlayerValues {
  name: string
  factionId: string | null
}

const validationSchema = Yup.object().shape({
  name: Yup.string().max(50, 'Too Long!').required('Required'),
  factionId: Yup.string().required('Required'),
})

export default function Setup() {
  const router = useRouter()
  const { state, dispatch, canUndo, canRedo } = useGameContext()
  const orderedPlayers = getOrderedPlayers(state)
  const { players } = state
  const initialValues: PlayerValues = { name: '', factionId: null }
  const {
    values: { name, factionId },
    resetForm,
    setFieldValue,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    onSubmit: values => {
      const { name, factionId } = values

      if (name && factionId) {
        dispatch({ type: 'ADD_PLAYER', data: { name, factionId } })
        resetForm()
      }
    },
    initialValues,
    validationSchema,
  })
  const nameInput = useRef<HTMLInputElement>(null)

  useHotkeys('cmd+z, ctrl+z', () => dispatch({ type: 'UNDO' }), [dispatch])
  useHotkeys('cmd+shift+z, ctrl+shift+z, cmd+y, ctrl+y', () => dispatch({ type: 'REDO' }), [
    dispatch,
  ])

  return (
    <>
      <div className="hidden lg:flex flex-col h-screen">
        <div className="flex h-20 p-4 items-center justify-between">
          <StatBadge label="Game setup" />
          <div className="flex gap-4">
            <IconButton
              disabled={!canUndo}
              onClick={() => {
                dispatch({ type: 'UNDO' })
              }}
            >
              <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
            </IconButton>
            <IconButton
              disabled={!canRedo}
              onClick={() => {
                dispatch({ type: 'REDO' })
              }}
            >
              <FontAwesomeIcon icon={faArrowAltCircleRight} size="2x" />
            </IconButton>
          </div>
        </div>
        <div className="flex-grow flex items-center">
          <form
            className="flex flex-col gap-10 max-w-5xl m-auto w-full items-center"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-6 gap-4">
              {errors.factionId && touched.factionId && (
                <div className="absolute bottom-full mb-4 text-lg text-red-500 uppercase justify-center w-full flex">
                  Please select a faction
                </div>
              )}
              {factions.map(faction => {
                const selectedFactionColors = players
                  .map(player => factions.find(faction => faction.id === player.factionId)?.color)
                  .filter(Boolean)
                const disabled = selectedFactionColors.includes(faction.color)

                return (
                  <FactionBadge
                    type="button"
                    key={faction.id}
                    className={classNames(
                      'transform hover:scale-105 disabled:opacity-5 disabled:scale-90 disabled:hover:scale-90 disabled:cursor-not-allowed',
                      !disabled && factionId !== null && faction.id === factionId && 'scale-105',
                      !disabled &&
                        factionId !== null &&
                        faction.id !== factionId &&
                        'scale-90 hover:scale-100 opacity-60',
                    )}
                    disabled={disabled}
                    factionId={faction.id}
                    onPointerDown={e => {
                      e.preventDefault()
                      setFieldValue('factionId', faction.id)
                      nameInput.current?.focus()
                    }}
                  />
                )
              })}
            </div>

            <div className="grid gap-1 w-96 m-auto">
              <div className="text-md uppercase text-gray-500">Name</div>
              <div className="flex gap-2 relative">
                <Input
                  ref={nameInput}
                  className="flex-grow"
                  value={name}
                  onChange={({ currentTarget }) => setFieldValue('name', currentTarget.value)}
                />
                <Button className="flex-shrink-0" color="black" type="submit">
                  Add Player
                </Button>
                {errors.name && touched.name && (
                  <div className="absolute top-full mt-2 text-md text-red-500 uppercase">
                    Name is required
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="bg-black h-20 flex items-center justify-between px-4 gap-2 min-w-0">
          <div className="flex gap-4">
            <StatBadge label="Players" />
            <div className="flex gap-2">
              {orderedPlayers.map(player => (
                <FactionBadge
                  key={player.id}
                  className="cursor-default"
                  size="small"
                  factionId={player.factionId}
                />
              ))}
            </div>
          </div>
          <Button
            className="flex-shrink-0"
            color="white"
            disabled={players.length < 2}
            onClick={() => router.push('/play')}
          >
            Create game
          </Button>
        </div>
      </div>
      <div className="flex lg:hidden flex-col h-screen items-center justify-center p-10">
        <div className="max-w-md text-3xl text-center uppercase">
          Tactical Bankruptcy is best experienced with a keyboard
        </div>
      </div>
    </>
  )
}
