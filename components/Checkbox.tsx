import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react'
import classNames from 'classnames'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type BaseProps = {
  value: boolean
  onChange: (value: boolean) => void
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps>

/**
 * Primary UI component for user interaction.
 */
export const Checkbox = forwardRef(function Checkbox(
  { className, value = false, onChange, ...rest }: Props,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={classNames(
        className,
        `h-12 px-4 rounded-md flex items-center justify-center bg-zinc-200
        text-lg uppercase fill-current border cursor-pointer
        focus:outline-none disabled:cursor-not-allowed hover:bg-zinc-300 focus:border-zinc-500 focus:bg-white focus:hover:bg-white`,
      )}
    >
      {value && <FontAwesomeIcon className="text-gray-600" icon={faCheck} />}
    </div>
  )
})
