import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react'
import cn from 'classnames'

type Size = 'small' | 'medium' | 'large'

type BaseProps = {
  color?: 'white' | 'black'
  size?: Size
  active?: boolean
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>

/**
 * Primary UI component for user interaction.
 */
export const Button = forwardRef(function Button(
  {
    color = 'black',
    size = 'medium',
    disabled = false,
    active = false,
    type = 'button',
    children,
    className,
    ...rest
  }: Props,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      {...rest}
      className={cn(
        `w-36 cursor-click relative rounded-md flex items-center justify-center focus:outline-none
      disabled:bg-gray-200 disabled:text-gray-600 disabled:cursor-not-allowed uppercase
      drop-shadow hover:drop-shadow-md
      p-4 bg-indigo-500 text-white
      disabled:hover:bg-gray-200 disabled:hover:text-gray-600 fill-current font-bold`,
        className,
      )}
      ref={ref}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
})
