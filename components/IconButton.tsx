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
        `w-8 h-8 fill-current stroke-current text-slate-500 relative rounded-md flex items-center justify-center 
        text-lg uppercase text-white fill-current bg-transparent
        focus:outline-none disabled:cursor-not-allowed disabled:opacity-25 active:scale-95`,
      )}
      ref={ref}
    >
      {children}
    </button>
  )
})
