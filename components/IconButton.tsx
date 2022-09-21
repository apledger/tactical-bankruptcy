import { ComponentPropsWithoutRef, forwardRef, Ref } from 'react'
import classNames from 'classnames'

type BaseProps = {}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>

export const IconButton = forwardRef(function IconButton(
  { children, className, ...rest }: Props,
  ref: Ref<HTMLButtonElement>,
) {
  return (
    <button
      {...rest}
      className={classNames(
        className,
        `w-8 h-8 text-zinc-400 relative rounded-md flex items-center justify-center 
        text-lg uppercase text-white fill-current bg-transparent hover:bg-gray-100 transition-all
        focus:outline-none disabled:cursor-not-allowed disabled:opacity-25 active:scale-95`,
      )}
      ref={ref}
    >
      {children}
    </button>
  )
})
