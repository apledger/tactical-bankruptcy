import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react'
import classNames from 'classnames'

type BaseProps = {
  color?: 'white' | 'black'
  active?: boolean
  hover?: boolean
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>

/**
 * Primary UI component for user interaction.
 */
export const Button = forwardRef(function Button(
  {
    color = 'black',
    disabled = false,
    active = false,
    hover = false,
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
      className={classNames(
        className,
        `h-12 p-4 cursor-click relative rounded-md flex items-center justify-center 
        text-lg uppercase text-white fill-current border 
        focus:outline-none disabled:cursor-not-allowed disabled:opacity-25 active:scale-95`,
        hover
          ? {
              black: 'border-black bg-black text-white',
              white: 'text-black bg-white',
            }[color]
          : {
              black:
                'bg-transparent border-black text-black hover:bg-black hover:text-white disabled:hover:bg-transparent disabled:hover:text-black',
              white:
                'bg-transparent border-white text-white hover:text-black hover:bg-white disabled:hover:bg-transparent disabled:hover:text-white',
            }[color],
        active && 'scale-95',
      )}
      ref={ref}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
})
