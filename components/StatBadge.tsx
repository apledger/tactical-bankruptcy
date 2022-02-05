import classNames from 'classnames'
import { ReactNode, ComponentPropsWithoutRef } from 'react'

type BaseProps = {
  label: string | ReactNode
  value?: string | ReactNode
  color?: 'gray' | 'orange'
}

type Props = BaseProps & Omit<ComponentPropsWithoutRef<'button'>, keyof BaseProps>

export function StatBadge({ className, label, color = 'gray', value }: Props) {
  return (
    <div
      className={classNames(
        className,
        'h-12 px-4 flex flex-col justify-center items-center uppercase',
        { gray: 'bg-zinc-300 text-black', orange: 'bg-amber-600 text-white' }[color],
      )}
    >
      {value ? (
        <>
          <div className="text-xs">{label}</div>
          <div className="text-xl">{value}</div>
        </>
      ) : (
        <div className="text-xl">{label}</div>
      )}
    </div>
  )
}
