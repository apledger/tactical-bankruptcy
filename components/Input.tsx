import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react'
import classNames from 'classnames'

type BaseProps = {}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'input'>, keyof BaseProps>

/**
 * Primary UI component for user interaction.
 */
export const Input = forwardRef(function Input(
  { className, ...rest }: Props,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      {...rest}
      className={classNames(
        className,
        `h-12 px-4 rounded-md flex items-center justify-center bg-zinc-200
        text-lg uppercase fill-current border
        focus:outline-none disabled:cursor-not-allowed hover:bg-zinc-300 focus:border-zinc-500 focus:bg-white focus:hover:bg-white`,
      )}
      ref={ref}
    />
  )
})
